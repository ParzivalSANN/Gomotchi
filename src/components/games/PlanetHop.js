import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { ClayStyles, CLAY_COLORS } from '../../styles/ClayStyles';

const { width, height } = Dimensions.get('window');

const PlanetHop = ({ visible, onClose, onFinish }) => {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const robotPos = useRef(new Animated.ValueXY({ x: width / 2 - 25, y: height - 150 })).current;
  const [planets, setPlanets] = useState([]);
  const gameInterval = useRef(null);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setPlanets([{ id: 1, x: width / 2 - 40, y: height - 250, size: 80 }]);
    robotPos.setValue({ x: width / 2 - 25, y: height - 150 });
  };

  const jump = () => {
    if (!isPlaying) return;
    Animated.sequence([
      Animated.timing(robotPos.y, { toValue: robotPos.y._value - 150, duration: 300, useNativeDriver: false }),
      Animated.timing(robotPos.y, { toValue: robotPos.y._value, duration: 300, useNativeDriver: false })
    ]).start(() => {
      setScore(s => s + 10);
      // Logic for landing on planets would go here
    });
  };

  useEffect(() => {
    if (isPlaying) {
      // Game loop logic
    }
    return () => clearInterval(gameInterval.current);
  }, [isPlaying]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <Text style={styles.scoreText}>SKOR: {score}</Text>
        
        {!isPlaying ? (
          <View style={[ClayStyles.clayCard, styles.startCard]}>
            <Text style={styles.title}>PLANET HOP 🚀</Text>
            <Text style={styles.desc}>Gezegenler arasında zıpla ve elmasları topla!</Text>
            <TouchableOpacity style={ClayStyles.clayButton} onPress={startGame}>
              <Text style={styles.btnText}>BAŞLA</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={{ marginTop: 15 }}>
              <Text style={{ color: '#94A3B8', fontWeight: 'bold' }}>KAPAT</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity activeOpacity={1} style={styles.gameArea} onPress={jump}>
            <TouchableOpacity style={styles.closeX} onPress={onClose}>
               <Text style={styles.closeXText}>✕</Text>
            </TouchableOpacity>
            {planets.map(p => (
              <View key={p.id} style={[styles.planet, { left: p.x, top: p.y, width: p.size, height: p.size }]} />
            ))}
            <Animated.View style={[styles.robot, { left: robotPos.x, top: robotPos.y }]}>
              <Text style={{ fontSize: 40 }}>🤖</Text>
            </Animated.View>
          </TouchableOpacity>

        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scoreText: { position: 'absolute', top: 50, width: '100%', textAlign: 'center', color: '#fff', fontSize: 24, fontWeight: '900' },
  startCard: { position: 'absolute', top: '30%', left: '10%', right: '10%', alignItems: 'center' },
  title: { fontSize: 24, color: '#334155', marginBottom: 10, fontWeight: '900' },
  desc: { textAlign: 'center', color: '#64748B', marginBottom: 20 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  gameArea: { flex: 1 },
  planet: { position: 'absolute', backgroundColor: '#3B82F6', borderRadius: 100, borderTopWidth: 4, borderLeftWidth: 4, borderTopColor: 'rgba(255,255,255,0.3)', borderLeftColor: 'rgba(255,255,255,0.3)' },
  robot: { position: 'absolute', width: 50, height: 50, alignItems: 'center', justifyContent: 'center' },
  closeX: { position: 'absolute', top: 50, right: 25, zIndex: 100, backgroundColor: 'rgba(255,255,255,0.2)', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  closeXText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
});


export default PlanetHop;
