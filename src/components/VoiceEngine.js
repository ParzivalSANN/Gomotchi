import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Audio } from 'expo-av';

const VoiceEngine = ({ isActive, onLipSync }) => {
  const [recording, setRecording] = useState(null);
  const [status, setStatus] = useState('Idle');
  const silenceTimer = useRef(null);
  const lastAmplitude = useRef(0);

  useEffect(() => {
    if (isActive) {
      startListening();
    } else {
      stopListening();
    }
    return () => stopListening();
  }, [isActive]);

  const startListening = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(newRecording);
      setStatus('Listening');

      // Noise gate & Silence detection simulation
      // In a real production app, we would use setOnRecordingStatusUpdate
      newRecording.setOnRecordingStatusUpdate((status) => {
        const amplitude = status.metering || -160;
        lastAmplitude.current = amplitude;

        if (amplitude > -40) {
          // Reset silence timer if noise is detected
          if (silenceTimer.current) {
            clearTimeout(silenceTimer.current);
            silenceTimer.current = null;
          }
          setStatus('Recording...');
        } else {
          // Start 1.5s silence timer
          if (!silenceTimer.current) {
            silenceTimer.current = setTimeout(() => {
              processAndPlay();
            }, 1500);
          }
        }
      });

    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopListening = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      setRecording(null);
      setStatus('Idle');
    }
  };

  const processAndPlay = async () => {
    if (!recording) return;

    setStatus('Processing...');
    const uri = recording.getURI();
    await recording.stopAndUnloadAsync();
    setRecording(null);

    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { 
        pitch: 1.8, // 1.5x - 2.0x pitch shift
        shouldCorrectPitch: false, // This ensures duration stays the same if rate is adjusted, but here we shift pitch
        rate: 1.0, 
      }
    );

    setStatus('Repeating...');
    
    // Lip Sync Simulation
    const syncInterval = setInterval(() => {
       onLipSync && onLipSync(Math.random()); // Map RMS to lip movement
    }, 100);

    await sound.playAsync();
    
    sound.setOnPlaybackStatusUpdate((playbackStatus) => {
      if (playbackStatus.didJustFinish) {
        clearInterval(syncInterval);
        onLipSync && onLipSync(0);
        setStatus('Listening again...');
        startListening(); // Restart loop
      }
    });
  };

  return null;
};


const styles = StyleSheet.create({
  debugContainer: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    marginTop: 10,
  },
  debugText: {
    color: '#00E5FF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default VoiceEngine;
