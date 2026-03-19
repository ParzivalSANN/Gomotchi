import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Animated } from 'react-native';
import { ClayStyles, CLAY_COLORS } from '../styles/ClayStyles';
import { useGomotchiStore } from '../store/useGomotchiStore';

const REWARDS = [
  { id: 1, name: '50 Altın', icon: '💰', weight: 60, action: (addGold) => addGold(50) },
  { id: 2, name: '200 Altın', icon: '💰', weight: 20, action: (addGold) => addGold(200) },
  { id: 3, name: '2 Elmas', icon: '💎', weight: 15, action: (_, addDiam) => addDiam(2) },
  { id: 4, name: '10 Elmas', icon: '💎', weight: 5, action: (_, addDiam) => addDiam(10) },
];

const DailyReward = ({ visible, onClose }) => {
  const { addGold, addDiamonds } = useGomotchiStore();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const spinValue = useRef(new Animated.Value(0)).current;

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    
    // Choose reward
    const totalWeight = REWARDS.reduce((acc, r) => acc + r.weight, 0);
    const rand = Math.random() * totalWeight;
    let cumulativeWeight = 0;
    let selected = REWARDS[0];
    for (const reward of REWARDS) {
      cumulativeWeight += reward.weight;
      if (rand <= cumulativeWeight) {
        selected = reward;
        break;
      }
    }

    // Animation: spin multiple times then stop
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 10, // 10 full rotations
      duration: 2500,
      useNativeDriver: true,
    }).start(() => {
      setResult(selected);
      selected.action(addGold, addDiamonds);
      setSpinning(false);
    });
  };

  const spinRotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <View style={[ClayStyles.clayCard, styles.card]}>
          <TouchableOpacity style={styles.closeX} onPress={onClose}>
             <Text style={styles.closeXText}>✕</Text>
          </TouchableOpacity>
          <Text style={[ClayStyles.clayText, styles.title]}>ŞANS ÇARKI 🎡</Text>
          
          <View style={styles.wheelArea}>
             <Animated.View style={[styles.wheel, { transform: [{ rotate: spinRotate }] }]}>
                {REWARDS.map((r, i) => (
                  <View key={r.id} style={[styles.rewardSlice, { transform: [{ rotate: `${i * (360/REWARDS.length)}deg` }, { translateY: -60 }] }]}>
                    <Text style={{ fontSize: 24 }}>{r.icon}</Text>
                  </View>
                ))}
             </Animated.View>
             <View style={styles.pointer} />
          </View>

          {result && (
            <Animated.View style={styles.resultContainer}>
              <Text style={styles.resultText}>TEBRİKLER! 🎉</Text>
              <Text style={styles.rewardName}>{result.name}</Text>
            </Animated.View>
          )}

          {!result && (
            <TouchableOpacity 
              style={[ClayStyles.clayButton, spinning && styles.btnDisabled]} 
              onPress={spin} 
              disabled={spinning}
            >
              <Text style={styles.btnText}>{spinning ? 'DÖNÜYOR...' : 'ÇARKI ÇEVİR'}</Text>
            </TouchableOpacity>
          )}

          {result && (
            <TouchableOpacity style={[ClayStyles.clayButton, { backgroundColor: CLAY_COLORS.success }]} onPress={onClose}>
              <Text style={styles.btnText}>HARİKA!</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  card: { width: '85%', alignItems: 'center', padding: 30 },
  closeX: { position: 'absolute', top: 15, right: 15 },
  closeXText: { color: '#94A3B8', fontSize: 20, fontWeight: 'bold' },
  title: { fontSize: 22, color: '#334155', marginBottom: 25 },
  wheelArea: { height: 200, width: 200, justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
  wheel: { 
    width: 180, 
    height: 180, 
    borderRadius: 90, 
    backgroundColor: '#F1F5F9',
    borderWidth: 8,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  rewardSlice: { position: 'absolute' },
  pointer: { position: 'absolute', top: -10, width: 20, height: 20, backgroundColor: '#FF4081', transform: [{ rotate: '45deg' }], zIndex: 10 },
  resultContainer: { alignItems: 'center', marginBottom: 20 },
  resultText: { color: '#EC4899', fontWeight: '900', fontSize: 20 },
  rewardName: { color: '#1E293B', fontWeight: '900', fontSize: 16 },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontWeight: '900', fontSize: 16 },
});

export default DailyReward;
