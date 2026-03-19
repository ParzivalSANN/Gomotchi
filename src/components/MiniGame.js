import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const MiniGame = ({ visible, onClose, onFinish }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onFinish(score * 10); // Reward: 10 gold per tap
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, score]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setIsActive(true);
  };

  const handleTap = () => {
    if (isActive) {
      setScore((prev) => prev + 1);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.gameContainer}>
          <Text style={styles.title}>TAP CHALLENGE! ⚡</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>ZAMAN</Text>
              <Text style={styles.statValue}>{timeLeft}s</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>SKOR</Text>
              <Text style={styles.statValue}>{score}</Text>
            </View>
          </View>

          {!isActive ? (
            <View style={styles.startOverlay}>
              <Text style={styles.infoText}>
                {timeLeft === 0 ? `TEBRİKLER!\n${score * 10} 💰 KAZANDIN!` : '10 saniyede ne kadar çok dokunursan o kadar altın kazanırsın!'}
              </Text>
              <TouchableOpacity style={styles.primaryButton} onPress={timeLeft === 0 ? onClose : startGame}>
                <Text style={styles.buttonText}>{timeLeft === 0 ? 'KAPAT' : 'BAŞLAT!'}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              activeOpacity={0.8} 
              style={styles.tapArea} 
              onPress={handleTap}
            >
              <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.targetCircle}>
                <Text style={styles.targetText}>TAP!</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameContainer: {
    width: width * 0.9,
    height: height * 0.6,
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 30,
    letterSpacing: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 50,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  startOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  tapArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  targetText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MiniGame;
