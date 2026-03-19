import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Animated, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ClayStyles, CLAY_COLORS } from '../../styles/ClayStyles';


const { width, height } = Dimensions.get('window');
const PLATFORM_INITIAL_WIDTH = 200;

const CakeTower = ({ visible, onClose, onFinish }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [platformWidth, setPlatformWidth] = useState(PLATFORM_INITIAL_WIDTH);
  const [lastPlatformPos, setLastPlatformPos] = useState((width - PLATFORM_INITIAL_WIDTH) / 2);
  const [currentSliceX, setCurrentSliceX] = useState(new Animated.Value(0));
  const [gameOver, setGameOver] = useState(false);
  
  const movingLeft = useRef(true);
  const animationReq = useRef(null);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      startMovement();
    }
    return () => {
      currentSliceX.stopAnimation();
    };
  }, [isPlaying, gameOver]);

  const startMovement = () => {
    const toValue = movingLeft.current ? -100 : 100;
    Animated.timing(currentSliceX, {
      toValue,
      duration: Math.max(800, 2000 - score * 100), // Speeds up
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        movingLeft.current = !movingLeft.current;
        startMovement();
      }
    });
  };

  const handlePress = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      return;
    }

    currentSliceX.stopAnimation(({ value }) => {
      const currentPos = (width / 2) + value; // Approximate screen position
      const diff = Math.abs(currentPos - lastPlatformPos);
      
      if (diff >= platformWidth) {
        setGameOver(true);
        onFinish && onFinish(score * 2); // 2 gold per layer
      } else {
        // Perfect match or Slicing logic
        if (diff < 10) {
          // Perfect
          setScore(s => s + 1);
        } else {
          // Slice
          const newWidth = platformWidth - diff;
          setPlatformWidth(newWidth);
          // Update position to the overlapping part
          setLastPlatformPos(currentPos > lastPlatformPos ? currentPos - diff : currentPos);
          setScore(s => s + 1);
        }
        
        // Reset for next block
        currentSliceX.setValue(0);
        startMovement();
      }
    });
  };

  const resetGame = () => {
    setScore(0);
    setPlatformWidth(PLATFORM_INITIAL_WIDTH);
    setLastPlatformPos((width - PLATFORM_INITIAL_WIDTH) / 2);
    setGameOver(false);
    setIsPlaying(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <LinearGradient colors={['#0F172A', '#1E1B4B']} style={styles.gameBoard}>
          <TouchableOpacity style={styles.closeX} onPress={onClose}>
            <Text style={styles.closeXText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>CAKE TOWER 🍰</Text>
          <Text style={styles.score}>KAT: {score}</Text>

          {!isPlaying && !gameOver && (
            <TouchableOpacity style={styles.overlay} onPress={() => setIsPlaying(true)}>
              <Text style={styles.infoText}>Hizalamak için doğru anda dokun!{'\n'}Boşluk bırakırsan kek dilimlenir!</Text>
              <View style={ClayStyles.clayButton}>
                <Text style={styles.btnText}>BAŞLAMAK İÇİN DOKUN</Text>
              </View>
            </TouchableOpacity>
          )}

          {gameOver && (
            <View style={styles.overlay}>
              <Text style={styles.gameOverText}>EYVAH! KEK DÜŞTÜ!</Text>
              <Text style={styles.scoreText}>{score} Kat Çıktın!</Text>
              <TouchableOpacity style={ClayStyles.clayButton} onPress={resetGame}>
                <Text style={styles.btnText}>TEKRAR DENE</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Platform */}
          <View style={[styles.platform, { width: platformWidth, left: lastPlatformPos }]} />

          {/* Falling Slice */}
          {isPlaying && (
            <Animated.View 
              style={[
                styles.slice, 
                { 
                  width: platformWidth, 
                  transform: [{ translateX: currentSliceX }] 
                }
              ]} 
            />
          )}

          <TouchableOpacity style={styles.tapArea} onPress={handlePress} />
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  gameBoard: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  closeX: { position: 'absolute', top: 50, right: 25, zIndex: 100, backgroundColor: 'rgba(255,255,255,0.2)', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  closeXText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  title: { color: '#FFD700', fontSize: 24, fontWeight: '900', position: 'absolute', top: 60 },
  score: { color: '#fff', fontSize: 40, fontWeight: '900', position: 'absolute', top: 100 },
  platform: { position: 'absolute', bottom: 200, height: 40, backgroundColor: '#EC4899', borderRadius: 5, borderBottomWidth: 5, borderBottomColor: '#BE185D' },
  slice: { position: 'absolute', bottom: 240, height: 40, backgroundColor: '#F472B6', borderRadius: 5 },
  tapArea: { ...StyleSheet.absoluteFillObject },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  infoText: { color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
  gameOverText: { color: '#FF5252', fontSize: 32, fontWeight: '900', marginBottom: 10 },
  scoreText: { color: '#fff', fontSize: 24, marginBottom: 30 },
  btnText: { color: '#fff', fontWeight: 'bold' },
});


export default CakeTower;
