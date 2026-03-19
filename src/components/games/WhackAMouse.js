import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const WhackAMouse = ({ visible, onClose, onFinish }) => {
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(5);
  const [activeMouse, setActiveMouse] = useState(null); // { id: 0, type: 'brown', tapsNeeded: 1 }
  const [gameOver, setGameOver] = useState(false);
  const [mechaHealth, setMechaHealth] = useState(12);
  
  const timer = useRef(null);

  useEffect(() => {
    if (visible && !gameOver) {
      spawnMouse();
    }
    return () => clearTimeout(timer.current);
  }, [visible, gameOver]);

  const spawnMouse = () => {
    const id = Math.floor(Math.random() * 4);
    const rand = Math.random();
    let type = 'brown';
    let tapsNeeded = 1;

    if (rand > 0.9) {
      type = 'mecha';
      tapsNeeded = 12;
      setMechaHealth(12);
    } else if (rand > 0.7) {
      type = 'blue'; // Doc: swerves, let's just make it faster for now
    }

    setActiveMouse({ id, type, tapsNeeded });

    const timeout = Math.max(500, 1500 - (score / 100));
    timer.current = setTimeout(() => {
      handleMiss();
    }, timeout);
  };

  const handleMiss = () => {
    setHealth(h => {
      if (h <= 1) {
        setGameOver(true);
        onFinish && onFinish(Math.floor(score / 10));
        return 0;
      }
      return h - 1;
    });
    spawnMouse();
  };

  const handleHit = (id) => {
    if (!activeMouse || activeMouse.id !== id) return;

    if (activeMouse.type === 'mecha') {
      setMechaHealth(h => {
        if (h <= 1) {
          clearTimeout(timer.current);
          setScore(s => s + 250);
          spawnMouse();
          return 12;
        }
        return h - 1;
      });
    } else {
      clearTimeout(timer.current);
      setScore(s => s + (activeMouse.type === 'brown' ? 10 : 20));
      spawnMouse();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <LinearGradient colors={['#1e1b4b', '#312e81']} style={styles.gameBoard}>
          <TouchableOpacity style={styles.closeX} onPress={onClose}>
             <Text style={styles.closeXText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>WHACK-A-MOUSE 🔨</Text>
          <View style={styles.header}>
            <Text style={styles.scoreText}>SKOR: {score}</Text>
            <Text style={styles.healthText}>CAN: {'❤️'.repeat(health)}</Text>
          </View>

          <View style={styles.grid}>
            {[0, 1, 2, 3].map((id) => (
              <TouchableOpacity
                key={id}
                style={[styles.tile, { backgroundColor: id === 0 ? '#3b82f6' : id === 1 ? '#eab308' : id === 2 ? '#ef4444' : '#22c55e' }]}
                onPress={() => handleHit(id)}
              >
                {activeMouse?.id === id && (
                  <View style={styles.mouse}>
                    <Text style={{ fontSize: activeMouse.type === 'mecha' ? 60 : 40 }}>
                      {activeMouse.type === 'mecha' ? '🤖' : '🐭'}
                    </Text>
                    {activeMouse.type === 'mecha' && <Text style={styles.mechaLife}>{mechaHealth}</Text>}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {gameOver && (
            <View style={styles.overlay}>
              <Text style={styles.gameOverText}>OYUN BİTTİ!</Text>
              <Text style={styles.finalScore}>Fareler Peyniri Yedi! 🧀</Text>
              <TouchableOpacity style={styles.btn} onPress={onClose}>
                <Text style={styles.btnText}>PANELE DÖN</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
             <Text style={styles.closeText}>KAPAT</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' },
  gameBoard: { flex: 1, padding: 20, paddingTop: 60, alignItems: 'center' },
  title: { color: '#fbbf24', fontSize: 24, fontWeight: '900', marginBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 40 },
  scoreText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  healthText: { color: '#ff5252', fontSize: 16 },
  grid: { width: '100%', aspectRatio: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: { width: '48%', height: '48%', borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  mouse: { alignItems: 'center' },
  mechaLife: { color: '#fff', fontSize: 18, fontWeight: '900', marginTop: 5 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  gameOverText: { color: '#ff5252', fontSize: 36, fontWeight: '900', marginBottom: 10 },
  finalScore: { color: '#fff', fontSize: 18, marginBottom: 30 },
  btn: { backgroundColor: '#3b82f6', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 15 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  closeX: { position: 'absolute', top: 50, right: 25, zIndex: 100, backgroundColor: 'rgba(255,255,255,0.2)', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  closeXText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
});


export default WhackAMouse;
