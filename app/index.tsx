import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGomotchiStore } from '../src/store/useGomotchiStore';
import FloatingRobot from '../src/components/FloatingRobot';
import StatPanel from '../src/components/StatPanel';
import InventoryList from '../src/components/InventoryList';
import MiniGame from '../src/components/MiniGame';

const { width } = Dimensions.get('window');

const ROOMS: Record<string, { colors: [string, string, string]; title: string; icon: string }> = {
  living: { colors: ['#0F172A', '#1E293B', '#0F172A'], title: 'SALON', icon: '🏠' },
  bedroom: { colors: ['#1E1B4B', '#312E81', '#1E1B4B'], title: 'YATAK ODASI', icon: '😴' },
  bathroom: { colors: ['#065F46', '#064E3B', '#065F46'], title: 'BANYO', icon: '🧼' },
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
      <LinearGradient colors={roomConfig.colors} style={styles.background}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
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
            <Text style={styles.levelLabel}>SEVİYE {level}</Text>
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

          {/* Market (Only in Living/Kitchen area style) */}
          {currentRoom === 'living' && <InventoryList />}
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
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  background: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  unitName: { color: '#fff', fontSize: 20, fontWeight: '900' },
  roomStatus: { marginTop: 4 },
  roomText: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 'bold' },
  goldContainer: { backgroundColor: 'rgba(255,215,0,0.1)', padding: 10, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,215,0,0.4)' },
  goldText: { color: '#FFD700', fontWeight: 'bold' },
  levelInfo: { marginBottom: 20 },
  levelLabel: { color: '#3B82F6', fontSize: 10, fontWeight: 'bold', marginBottom: 5 },
  xpTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 },
  xpFill: { height: '100%', backgroundColor: '#3B82F6', borderRadius: 2 },
  heroContainer: { height: 280, justifyContent: 'center' },
  mainActionBar: { marginBottom: 25 },
  bigButton: { height: 60, borderRadius: 15, overflow: 'hidden' },
  btnGradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  btnIcon: { fontSize: 24 },
  btnText: { color: '#fff', fontWeight: 'bold', letterSpacing: 1 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  navbar: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    height: 80, 
    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 20,
  },
  navItem: { alignItems: 'center', opacity: 0.4 },
  navActive: { opacity: 1 },
  navIcon: { fontSize: 20, marginBottom: 4 },
  navText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});




