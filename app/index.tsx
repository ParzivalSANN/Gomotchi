import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
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
        {/* Header - XP & Gold Info */}
        <View style={styles.header}>
          <View>
            <Text style={styles.unitName}>{unitName}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>LVL {level}</Text>
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

        <View style={styles.mainContent}>
          {/* Left Panel - Stats */}
          <View style={styles.leftPanel}>
            <StatPanel title="AÇLIK" value={stats.hunger} color="#FF5252" icon="🍖" />
            <StatPanel title="MUTLULUK" value={stats.happiness} color="#FF4081" icon="💖" />
            <StatPanel title="ENERJİ" value={stats.energy} color="#FFD700" icon="⚡" />
            <StatPanel title="HİJYEN" value={stats.hygiene} color="#00E5FF" icon="🧼" />
          </View>

          {/* Center - Robot Display */}
          <View style={styles.centerPanel}>
            <View style={styles.displayArea}>
              <FloatingRobot robotSource={require('../src/assets/robot_3d.png')} />
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
          </View>

          {/* Right Panel - Inventory */}
          <View style={styles.rightPanel}>
            <InventoryList />
          </View>
        </View>

        {/* HUD Elements */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>ANTIGRAVITY v2.1 PROTOCOL ACTIVE</Text>
        </View>
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
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  unitName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  levelBadge: {
    backgroundColor: '#3B82F6',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  levelText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  goldContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  goldText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 16,
  },
  xpBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginBottom: 20,
    overflow: 'hidden',
  },
  xpProgressBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  xpText: {
    position: 'absolute',
    right: 0,
    top: 6,
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPanel: {
    width: width * 0.25,
    justifyContent: 'center',
    paddingRight: 10,
  },
  centerPanel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayArea: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  rightPanel: {
    width: width * 0.25,
    paddingLeft: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 20,
  },
  actionButton: {
    width: 80,
    height: 80,
    borderRadius: 20,
    overflow: 'hidden',
  },
  actionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 10,
    letterSpacing: 2,
  },
});


