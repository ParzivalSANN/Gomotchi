import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, PanResponder, Animated, Dimensions, Image } from 'react-native';
import { ClayStyles, CLAY_COLORS } from '../../styles/ClayStyles';

const { width, height } = Dimensions.get('window');

// 12 patches of dirt
const INITIAL_DIRT = [
  { id: 1, x: 40, y: 30, cleaned: false },
  { id: 2, x: 60, y: 30, cleaned: false },
  { id: 3, x: 50, y: 45, cleaned: false },
  { id: 4, x: 35, y: 50, cleaned: false },
  { id: 5, x: 65, y: 50, cleaned: false },
  { id: 6, x: 45, y: 65, cleaned: false },
  { id: 7, x: 55, y: 65, cleaned: false },
  { id: 8, x: 40, y: 80, cleaned: false },
  { id: 9, x: 60, y: 80, cleaned: false },
  { id: 10, x: 50, y: 35, cleaned: false },
  { id: 11, x: 30, y: 60, cleaned: false },
  { id: 12, x: 70, y: 60, cleaned: false },
];

const SpongeBath = ({ visible, onClose, onFinish }) => {
  const [dirt, setDirt] = useState(INITIAL_DIRT);
  const [cleanliness, setCleanliness] = useState(0);
  
  // High performance: track everything in Refs
  const dirtRef = useRef(INITIAL_DIRT);
  const spongePos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const gameAreaLayout = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const viewRef = useRef(null);

  useEffect(() => {
    if (visible) {
      dirtRef.current = INITIAL_DIRT.map(d => ({ ...d, cleaned: false }));
      setDirt(dirtRef.current);
      setCleanliness(0);
      spongePos.setValue({ x: 0, y: 0 });
    }
  }, [visible]);

  // Handle measurement of the game area
  const onLayout = () => {
    if (viewRef.current) {
      viewRef.current.measure((fx, fy, w, h, px, py) => {
        gameAreaLayout.current = { x: px, y: py, width: w, height: h };
      });
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // 1. Move the sponge visually
        spongePos.setValue({ x: gestureState.dx, y: gestureState.dy });

        // 2. Logic for cleaning
        // Get absolute finger position
        const fingerX = gestureState.moveX;
        const fingerY = gestureState.moveY;

        const { x: ax, y: ay, width: aw, height: ah } = gameAreaLayout.current;
        
        if (aw > 0) {
          // Finger relative to game area (0-100)
          const rx = ((fingerX - ax) / aw) * 100;
          const ry = ((fingerY - ay) / ah) * 100;

          let hasNewClean = false;
          const updatedDirt = dirtRef.current.map(item => {
            if (item.cleaned) return item;
            
            // Check distance
            const dist = Math.sqrt(Math.pow(rx - item.x, 2) + Math.pow(ry - item.y, 2));
            if (dist < 15) { // Hitbox size (15% of width)
              hasNewClean = true;
              return { ...item, cleaned: true };
            }
            return item;
          });

          if (hasNewClean) {
            dirtRef.current = updatedDirt;
            setDirt(updatedDirt);
            const cleanedCount = updatedDirt.filter(d => d.cleaned).length;
            const progress = (cleanedCount / updatedDirt.length) * 100;
            setCleanliness(progress);
          }
        }
      },
      onPanResponderRelease: () => {
        // Return to center
        Animated.spring(spongePos, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        
        // Final check
        if (dirtRef.current.every(d => d.cleaned)) {
          onFinish();
        }
      }
    })
  ).current;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[ClayStyles.clayCard, styles.modal]}>
          <TouchableOpacity style={styles.closeX} onPress={onClose}>
            <Text style={styles.closeXText}>✕</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>🧼 BANYO TESTİ</Text>
          <Text style={styles.subtitle}>Süngeri her kirli noktanın üzerinden geçirin!</Text>
          
          <View style={styles.progressWrapper}>
             <View style={[styles.progressFill, { width: `${cleanliness}%` }]} />
             <Text style={styles.progressText}>%{Math.floor(cleanliness)} TEMİZLENDİ</Text>
          </View>

          <View 
            ref={viewRef}
            onLayout={onLayout}
            style={styles.gameArea}
          >
             {/* Robot Background */}
             <Image 
                source={require('../../assets/robot_3d.png')} 
                style={[styles.robot, cleanliness >= 100 && styles.robotShiny]} 
                resizeMode="contain"
             />

             {/* Dirt Grid */}
             <View style={StyleSheet.absoluteFill} pointerEvents="none">
               {dirt.map(d => !d.cleaned && (
                 <View 
                  key={d.id} 
                  style={[styles.dirt, { left: `${d.x}%`, top: `${d.y}%` }]} 
                 />
               ))}
             </View>

             {/* Sponge Layer (Always on top for touches) */}
             <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers}>
               <Animated.View 
                  style={[
                    styles.sponge,
                    { transform: spongePos.getTranslateTransform() }
                  ]}
               >
                 <Text style={{fontSize: 70}}>🧽</Text>
                 {cleanliness > 0 && cleanliness < 100 && (
                   <View style={styles.bubbles}>
                      <Text style={{fontSize: 20}}>🫧</Text>
                      <Text style={{fontSize: 14}}>🫧</Text>
                   </View>
                 )}
               </Animated.View>
             </View>
          </View>

          {cleanliness >= 100 && (
            <View style={styles.winBar}>
               <Text style={styles.winLabel}>HARİKA TEMİZLİK! ✨</Text>
               <TouchableOpacity style={ClayStyles.clayButton} onPress={onClose}>
                  <Text style={{color: '#fff', fontWeight: '900'}}>TAMAM</Text>
               </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modal: { width: width * 0.9, height: height * 0.75, alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: '900', color: '#1E293B' },
  subtitle: { fontSize: 13, color: '#64748B', marginBottom: 20, textAlign: 'center' },
  closeX: { position: 'absolute', top: 20, right: 20, zIndex: 100 },
  closeXText: { fontSize: 24, color: '#94A3B8' },
  progressWrapper: { width: '100%', height: 30, backgroundColor: '#F1F5F9', borderRadius: 15, overflow: 'hidden', marginBottom: 20, justifyContent: 'center', alignItems: 'center' },
  progressFill: { position: 'absolute', left: 0, height: '100%', backgroundColor: '#06B6D4' },
  progressText: { fontSize: 12, fontWeight: '900', color: '#475569', zIndex: 1 },
  gameArea: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ECFEFF', borderRadius: 25, overflow: 'hidden', borderWidth: 1, borderColor: '#CFFAFE' },
  robot: { width: '80%', height: '80%', opacity: 0.5 },
  robotShiny: { opacity: 1 },
  dirt: { position: 'absolute', width: 30, height: 30, backgroundColor: 'rgba(90, 40, 0, 0.4)', borderRadius: 15, marginLeft: -15, marginTop: -15 },
  sponge: { width: 120, height: 120, justifyContent: 'center', alignItems: 'center' },
  bubbles: { position: 'absolute', top: -10, flexDirection: 'row' },
  winBar: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.95)', justifyContent: 'center', alignItems: 'center', zIndex: 200, borderRadius: 25 },
  winLabel: { fontSize: 28, fontWeight: '900', color: '#10B981', marginBottom: 20 }
});

export default SpongeBath;
