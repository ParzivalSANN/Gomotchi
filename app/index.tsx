import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, TouchableOpacity, ScrollView, Alert, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGomotchiStore } from '../src/store/useGomotchiStore';
import FloatingRobot from '../src/components/FloatingRobot';
import StatPanel from '../src/components/StatPanel';
import InventoryList from '../src/components/InventoryList';
import MiniGame from '../src/components/MiniGame';

const { width } = Dimensions.get('window');

const ROOMS: Record<string, { image: any; title: string; icon: string; overlay: string }> = {
  living: { 
    image: require('../src/assets/living_room.png'), 
    title: 'SALON', 
    icon: '🏠',
    overlay: 'rgba(15, 23, 42, 0.4)'
  },
  bedroom: { 
    image: require('../src/assets/bedroom.png'), 
    title: 'YATAK ODASI', 
    icon: '😴',
    overlay: 'rgba(30, 27, 75, 0.4)'
  },
  bathroom: { 
    image: require('../src/assets/bathroom.png'), 
    title: 'BANYO', 
    icon: '🧼',
    overlay: 'rgba(6, 78, 59, 0.4)'
  },
};

export default function Dashboard() {
  const { unitName, level, experience, maxExperience, gold, stats, currentRoom, setRoom, addGold, wash, sleep } = useGomotchiStore();
  const [gameVisible, setGameVisible] = useState(false);

  const xpPercentage = (experience / maxExperience) * 100;
  const roomConfig = ROOMS[currentRoom];

  const handleFinishGame = (earnedGold: number) => {
    addGold(earnedGold);
    Alert.alert("OYUN BİTTİ!", `${earnedGold} 💰 kazandın!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={roomConfig.image} style={styles.background} resizeMode="cover">
        {/* Glassmorphism Overlay */}
        <View style={[styles.overlay, { backgroundColor: roomConfig.overlay }]} />
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.glassHeader}>
              <Text style={styles.unitName}>{unitName}</Text>
              <View style={styles.roomStatus}>
                <Text style={styles.roomText}>{roomConfig.icon} {roomConfig.title}</Text>
              </View>
            </View>
            <View style={styles.goldContainer}>
              <Text style={styles.goldText}>{gold.toLocaleString()} 💰</Text>
            </View>
          </View>

          {/* Level Info */}
          <View style={styles.levelInfo}>
            <View style={styles.levelHeader}>
              <Text style={styles.levelLabel}>SEVİYE {level}</Text>
              <Text style={styles.xpValue}>{experience}/{maxExperience} XP</Text>
            </View>
            <View style={styles.xpTrack}>
              <View style={[styles.xpFill, { width: `${xpPercentage}%` }]} />
            </View>
          </View>

          {/* Hero Area */}
          <View style={styles.heroContainer}>
            <FloatingRobot robotSource={require('../src/assets/robot_3d.png')} />
          </View>

          {/* Room-Specific Actions */}
          <View style={styles.mainActionBar}>
            {currentRoom === 'living' && (
              <TouchableOpacity style={styles.bigButton} onPress={() => setGameVisible(true)}>
                <LinearGradient colors={['#7C3AED', '#4F46E5']} style={styles.btnGradient}>
                  <Text style={styles.btnIcon}>🎮</Text>
                  <Text style={styles.btnText}>OYUN OYNA</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            {currentRoom === 'bedroom' && (
              <TouchableOpacity style={styles.bigButton} onPress={sleep}>
                <LinearGradient colors={['#1E40AF', '#1E3A8A']} style={styles.btnGradient}>
                  <Text style={styles.btnIcon}>😴</Text>
                  <Text style={styles.btnText}>UYU</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            {currentRoom === 'bathroom' && (
              <TouchableOpacity style={styles.bigButton} onPress={wash}>
                <LinearGradient colors={['#059669', '#10B981']} style={styles.btnGradient}>
                  <Text style={styles.btnIcon}>🧼</Text>
                  <Text style={styles.btnText}>YIKAN</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatPanel title="AÇLIK" value={stats.hunger} color="#FF5252" icon="🍖" />
            <StatPanel title="MUTLULUK" value={stats.happiness} color="#FF4081" icon="💖" />
            <StatPanel title="ENERJİ" value={stats.energy} color="#FFD700" icon="⚡" />
            <StatPanel title="HİJYEN" value={stats.hygiene} color="#00E5FF" icon="🧼" />
          </View>

          {/* Market (Only in Living) */}
          {currentRoom === 'living' && (
            <View style={styles.marketSection}>
              <InventoryList />
            </View>
          )}
        </ScrollView>

        {/* Bottom Navigator */}
        <View style={styles.navbar}>
          <TouchableOpacity 
            style={[styles.navItem, currentRoom === 'living' && styles.navActive]} 
            onPress={() => setRoom('living')}
          >
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.navText}>SALON</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.navItem, currentRoom === 'bedroom' && styles.navActive]} 
            onPress={() => setRoom('bedroom')}
          >
            <Text style={styles.navIcon}>🛏️</Text>
            <Text style={styles.navText}>ODA</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.navItem, currentRoom === 'bathroom' && styles.navActive]} 
            onPress={() => setRoom('bathroom')}
          >
            <Text style={styles.navIcon}>🚿</Text>
            <Text style={styles.navText}>BANYO</Text>
          </TouchableOpacity>
        </View>

        <MiniGame 
          visible={gameVisible} 
          onClose={() => setGameVisible(false)} 
          onFinish={handleFinishGame} 
        />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  background: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContent: { padding: 20, paddingBottom: 120 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 25,
    alignItems: 'center'
  },
  glassHeader: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  unitName: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  roomStatus: { marginTop: 2 },
  roomText: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  goldContainer: { 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  goldText: { color: '#FFD700', fontWeight: 'bold', fontSize: 16 },
  levelInfo: { 
    marginBottom: 25,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 12,
    borderRadius: 12,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelLabel: { color: '#3B82F6', fontSize: 12, fontWeight: 'bold' },
  xpValue: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 'bold' },
  xpTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  xpFill: { height: '100%', backgroundColor: '#3B82F6', borderRadius: 3 },
  heroContainer: { height: 300, justifyContent: 'center', alignItems: 'center' },
  mainActionBar: { marginBottom: 30 },
  bigButton: { 
    height: 70, 
    borderRadius: 20, 
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  btnGradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
  btnIcon: { fontSize: 28 },
  btnText: { color: '#fff', fontWeight: '900', letterSpacing: 2, fontSize: 16 },
  statsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginBottom: 25,
    padding: 5,
  },
  marketSection: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  navbar: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    height: 90, 
    backgroundColor: 'rgba(0, 0, 0, 0.85)', 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 25,
  },
  navItem: { alignItems: 'center', opacity: 0.3 },
  navActive: { opacity: 1 },
  navIcon: { fontSize: 24, marginBottom: 4 },
  navText: { color: '#fff', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
});





