import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGomotchiStore } from '../src/store/useGomotchiStore';
import FloatingRobot from '../src/components/FloatingRobot';
import StatPanel from '../src/components/StatPanel';
import InventoryList from '../src/components/InventoryList';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const { unitName, level, experience, maxExperience, gold, stats, play, sleep } = useGomotchiStore();

  const xpPercentage = (experience / maxExperience) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#0F172A']}
        style={styles.background}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header - XP & Gold Info */}
          <View style={styles.header}>
            <View>
              <Text style={styles.unitName}>{unitName}</Text>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>SEVİYE {level}</Text>
              </View>
            </View>
            <View style={styles.goldContainer}>
              <Text style={styles.goldText}>{gold.toLocaleString()} 💰</Text>
            </View>
          </View>

          {/* XP Bar */}
          <View style={styles.xpBarContainer}>
            <View style={[styles.xpProgressBar, { width: `${xpPercentage}%` }]} />
            <Text style={styles.xpText}>{experience} / {maxExperience} XP</Text>
          </View>

          {/* Hero Area - Pet Display */}
          <View style={styles.heroContainer}>
            <LinearGradient
              colors={['rgba(255,255,255,0.05)', 'transparent']}
              style={styles.heroCircle}
            />
            <FloatingRobot robotSource={require('../src/assets/robot_3d.png')} />
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatPanel title="AÇLIK" value={stats.hunger} color="#FF5252" icon="🍖" />
            <StatPanel title="MUTLULUK" value={stats.happiness} color="#FF4081" icon="💖" />
            <StatPanel title="ENERJİ" value={stats.energy} color="#FFD700" icon="⚡" />
            <StatPanel title="HİJYEN" value={stats.hygiene} color="#00E5FF" icon="🧼" />
          </View>

          {/* Quick Actions */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton} onPress={play}>
              <LinearGradient colors={['#7C3AED', '#4F46E5']} style={styles.actionGradient}>
                <Text style={styles.actionIcon}>🎮</Text>
                <Text style={styles.actionText}>OYNA</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={sleep}>
              <LinearGradient colors={['#059669', '#10B981']} style={styles.actionGradient}>
                <Text style={styles.actionIcon}>😴</Text>
                <Text style={styles.actionText}>UYU</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Market Section */}
          <InventoryList />

          {/* Footer Info */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>ANTIGRAVITY v2.2 PROTOCOL ACTIVE</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  unitName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  levelBadge: {
    backgroundColor: '#3B82F6',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  levelText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  goldContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  goldText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 16,
  },
  xpBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    marginBottom: 25,
    overflow: 'hidden',
  },
  xpProgressBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  xpText: {
    position: 'absolute',
    right: 0,
    top: 8,
    color: 'rgba(255,255,255,0.35)',
    fontSize: 9,
    fontWeight: '600',
  },
  heroContainer: {
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroCircle: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 25,
  },
  actionButton: {
    flex: 1,
    height: 70,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  actionGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  actionIcon: {
    fontSize: 22,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 9,
    letterSpacing: 3,
  },
});



