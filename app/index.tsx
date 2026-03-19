import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, TouchableOpacity, ScrollView, Alert, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGomotchiStore } from '../src/store/useGomotchiStore';
import FloatingRobot from '../src/components/FloatingRobot';
import InteractionController from '../src/components/InteractionController';
import VoiceEngine from '../src/components/VoiceEngine';
import StatPanel from '../src/components/StatPanel';
import InventoryList from '../src/components/InventoryList';
import CakeTower from '../src/components/games/CakeTower';
import WhackAMouse from '../src/components/games/WhackAMouse';
import DailyReward from '../src/components/DailyReward';
import GameSelectorModal from '../src/components/GameSelectorModal';
import OnboardingModal from '../src/components/OnboardingModal';
import SpongeBath from '../src/components/games/SpongeBath';

import SplashScreen from '../src/components/SplashScreen';
import SettingsModal from '../src/components/SettingsModal';
import PlanetHop from '../src/components/games/PlanetHop';
import BrickBlast from '../src/components/games/BrickBlast';
import { ClayStyles, CLAY_COLORS } from '../src/styles/ClayStyles';

const { width } = Dimensions.get('window');

const ROOMS: Record<string, { image: any; title: string; icon: string; overlay: string }> = {
  living: { 
    image: require('../src/assets/living_room.png'), 
    title: 'SALON', 
    icon: '🏠',
    overlay: 'rgba(15, 23, 42, 0.4)'
  },
  kitchen: { 
    image: require('../src/assets/kitchen.png'), 
    title: 'MUTFAK', 
    icon: '🍳',
    overlay: 'rgba(20, 20, 20, 0.4)'
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
  const { 
    unitName, level, lifeStage, experience, maxExperience, gold, diamonds, 
    stats, currentRoom, setRoom, addGold, wash, sleep, calculateDecay, onboardingComplete,
    day, lastWashDay 
  } = useGomotchiStore();
  const [showSplash, setShowSplash] = useState(true);
  const [isSettingsVisible, setSettingsVisible] = useState(false);

  React.useEffect(() => {
    calculateDecay();
    const interval = setInterval(() => calculateDecay(), 60000); // 1 minute auto-update
    return () => clearInterval(interval);
  }, []);

  const xpPercentage = (experience / maxExperience) * 100;
  const roomConfig = ROOMS[currentRoom];

  const [lipSyncValue, setLipSyncValue] = useState(0);

  const handleHead = () => {
    Alert.alert("NAKAVT!", "Kafasına dokundun, sersemledi! 😵");
    // Animation triggers will be added here
  };

  const handleBelly = () => {
    Alert.alert("GÜLÜMSÜYOR!", "Karnını gıdıkladın! 😊");
    addGold(5);
  };

  const handleFeet = () => {
    if (currentRoom === 'bathroom') {
      Alert.alert("ÇIĞLIK!", "Ayağına dokundun! 📢");
    }
  };

  const handleSwipe = () => {
    // Purr logic
  };

  const [cakeVisible, setCakeVisible] = useState(false);
  const [mouseVisible, setMouseVisible] = useState(false);
  const [hopVisible, setHopVisible] = useState(false);
  const [brickVisible, setBrickVisible] = useState(false);
  const [bathVisible, setBathVisible] = useState(false);

  const [dailyVisible, setDailyVisible] = useState(false);
  const [selectorVisible, setSelectorVisible] = useState(false);

  const handleFinishGame = (earnedGold: number) => {
    addGold(earnedGold);
    Alert.alert("OYUN BİTTİ!", `${earnedGold} 💰 kazandın! XP +${Math.floor(earnedGold/2)}`);
    setCakeVisible(false);
    setMouseVisible(false);
    setHopVisible(false);
    setBrickVisible(false);
  };

  const handleGameSelect = (gameType: string) => {
    setSelectorVisible(false);
    if (gameType === 'cake') setCakeVisible(true);
    if (gameType === 'mouse') setMouseVisible(true);
    if (gameType === 'hop') setHopVisible(true);
    if (gameType === 'brick') setBrickVisible(true);
  };

  const handleWashPress = () => {
    if (lastWashDay >= day) {
      Alert.alert("TEMİZ ROBOT!", "Bugün zaten yıkandın! Yarın (uyuduktan sonra) tekrar gelebilirsin. ✨");
      return;
    }
    setBathVisible(true);
  };

  const handleSleepPress = () => {
    Alert.alert(
      "İYİ UYKULAR", 
      "Uyuduğunda yeni bir güne uyanacaksın! Enerjin dolacak. Hazır mısın?",
      [
        { text: "VAZGEÇ", style: "cancel" },
        { text: "UYU 😴", onPress: () => {
          sleep();
          Alert.alert("GÜNAYDIN!", `${day + 1}. GÜN BAŞLADI! 🌅`);
        }}
      ]
    );
  };

  const handleFinishBath = () => {
    wash();
    setBathVisible(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Modals & Flow */}
      <OnboardingModal visible={!onboardingComplete} />
      <SettingsModal visible={isSettingsVisible} onClose={() => setSettingsVisible(false)} />

      <ImageBackground source={roomConfig.image} style={styles.background} resizeMode="cover">
        <View style={[styles.overlay, { backgroundColor: roomConfig.overlay }]} />
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header HUD */}
          <View style={styles.hudWrapper}>
            <View style={[ClayStyles.clayHUD, styles.hudRow]}>
              <TouchableOpacity onPress={() => setSettingsVisible(true)} style={styles.settingsBtn}>
                <Text style={{fontSize: 24}}>⚙️</Text>
              </TouchableOpacity>
              <View style={styles.unitInfo}>
                <Text style={styles.unitName}>{unitName || "YENİ ROBOT"}</Text>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                   <View style={[ClayStyles.claySmallTag, { paddingVertical: 2, marginRight: 5 }]}>
                    <Text style={styles.lifeStageText}>{lifeStage.toUpperCase()}</Text>
                  </View>
                  <View style={[ClayStyles.claySmallTag, { paddingVertical: 2, backgroundColor: '#E2E8F0' }]}>
                    <Text style={[styles.lifeStageText, {color: '#64748B'}]}>GÜN {day}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.hudRight}>
                <View style={styles.currencyPill}>
                  <Text style={styles.goldText}>{gold.toLocaleString()} 💰</Text>
                </View>
                <View style={[styles.currencyPill, { marginLeft: 6 }]}>
                  <Text style={styles.diamondText}>{diamonds.toLocaleString()} 💎</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Room Title Tag */}
          <View style={styles.roomTagWrapper}>
            <View style={[ClayStyles.clayCard, { paddingVertical: 5, paddingHorizontal: 15, borderRadius: 15 }]}>
              <Text style={styles.roomText}>{roomConfig.icon} {roomConfig.title}</Text>
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

          {/* Voice Engine Feedback */}
          <View style={styles.voiceWrapper}>
            <View style={[ClayStyles.clayCard, { padding: 10, borderRadius: 15, alignItems: 'center' }]}>
              <VoiceEngine isActive={currentRoom === 'living'} onLipSync={setLipSyncValue} />
            </View>
          </View>

          {/* Hero Area With Interactions */}
          <View style={styles.heroContainer}>
            <InteractionController 
              onHeadPress={handleHead}
              onBellyPress={handleBelly}
              onFeetPress={handleFeet}
              onSwipePet={handleSwipe}
            >
              <View style={{ transform: [{ scale: 1 + (lipSyncValue * 0.1) }] }}>
                <FloatingRobot robotSource={require('../src/assets/robot_3d.png')} />
              </View>
            </InteractionController>
          </View>

          {/* Room-Specific Actions */}
          <View style={styles.mainActionBar}>
            {currentRoom === 'living' && (
              <>
                <TouchableOpacity style={styles.clayBigButton} onPress={() => setSelectorVisible(true)}>
                  <Text style={styles.btnIcon}>🎮</Text>
                  <Text style={[styles.btnText, { color: '#fff' }]}>OYUN OYNA</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.clayBigButton, { backgroundColor: CLAY_COLORS.warning, marginTop: 15 }]} 
                  onPress={() => setDailyVisible(true)}
                >
                  <Text style={styles.btnIcon}>🎁</Text>
                  <Text style={[styles.btnText, { color: '#fff' }]}>GÜNLÜK HEDİYE</Text>
                </TouchableOpacity>
              </>
            )}
            {/* Same as before for other rooms */}
            {currentRoom === 'bedroom' && (
              <TouchableOpacity style={styles.clayBigButton} onPress={handleSleepPress}>
                <Text style={styles.btnIcon}>😴</Text>
                <Text style={[styles.btnText, { color: '#fff' }]}>UYU</Text>
              </TouchableOpacity>
            )}
            {currentRoom === 'bathroom' && (
              <TouchableOpacity style={styles.clayBigButton} onPress={handleWashPress}>
                <Text style={styles.btnIcon}>🧼</Text>
                <Text style={[styles.btnText, { color: '#fff' }]}>YIKAN</Text>
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

          {/* Market (Only in Kitchen) */}
          {currentRoom === 'kitchen' && (
            <View style={styles.marketSection}>
              <Text style={styles.sectionTitle}>MUTFAK MARKETİ</Text>
              <InventoryList />
            </View>
          )}

          {/* Spacer for Navbar */}
          <View style={{ height: 120 }} />
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
            style={[styles.navItem, currentRoom === 'kitchen' && styles.navActive]} 
            onPress={() => setRoom('kitchen')}
          >
            <Text style={styles.navIcon}>🍳</Text>
            <Text style={styles.navText}>MUTFAK</Text>
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

        <CakeTower 
          visible={cakeVisible} 
          onClose={() => setCakeVisible(false)} 
          onFinish={handleFinishGame} 
        />
        <WhackAMouse 
          visible={mouseVisible} 
          onClose={() => setMouseVisible(false)} 
          onFinish={handleFinishGame} 
        />
        <DailyReward 
          visible={dailyVisible} 
          onClose={() => setDailyVisible(false)} 
        />
        <GameSelectorModal 
          visible={selectorVisible} 
          onClose={() => setSelectorVisible(false)} 
          onSelect={handleGameSelect}
        />
        <PlanetHop 
          visible={hopVisible} 
          onClose={() => setHopVisible(false)} 
          onFinish={handleFinishGame}
        />
        <BrickBlast 
          visible={brickVisible} 
          onClose={() => setBrickVisible(false)} 
          onFinish={handleFinishGame}
        />
        <SpongeBath 
          visible={bathVisible} 
          onClose={() => setBathVisible(false)} 
          onFinish={handleFinishBath} 
        />
      </ImageBackground>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  background: { flex: 1, backgroundColor: CLAY_COLORS.background, width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  scrollContent: { padding: 20, paddingBottom: 150 },
  hudWrapper: { marginBottom: 15 },
  hudRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  settingsBtn: { marginRight: 10 },
  unitInfo: { flex: 1 },
  hudRight: { flexDirection: 'row', alignItems: 'center' },
  currencyPill: { 
    backgroundColor: '#F8FAFC', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  roomTagWrapper: { alignItems: 'center', marginBottom: 20 },
  unitName: { color: '#334155', fontSize: 18, fontWeight: '900', marginBottom: 2 },
  lifeStageText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  roomText: { color: '#64748B', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  goldText: { color: '#B45309', fontWeight: '900', fontSize: 13 },
  diamondText: { color: '#0369A1', fontWeight: '900', fontSize: 13 },
  levelInfo: { 
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 20,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
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
  heroContainer: { height: 300, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  mainActionBar: { marginBottom: 30, gap: 15 },
  clayBigButton: { 
    height: 70, 
    borderRadius: 25, 
    backgroundColor: CLAY_COLORS.primary,
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 12,
    // Clay Shadow
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: 'rgba(255,255,255,0.4)',
    borderLeftColor: 'rgba(255,255,255,0.4)',
  },
  btnIcon: { fontSize: 28 },
  btnText: { color: '#fff', fontWeight: '900', letterSpacing: 1.5, fontSize: 16 },
  voiceWrapper: { alignItems: 'center', marginBottom: 15 },
  statsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginBottom: 40,
    padding: 5,
  },
  marketSection: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 2,
    opacity: 0.7,
  },
  navbar: { 
    position: 'absolute', 
    bottom: 25, 
    left: 20, 
    right: 20, 
    height: 80, 
    backgroundColor: '#FFFFFF', 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center',
    borderRadius: 30,
    // Clay Shadow
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 10,
    borderTopWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.6)',
  },
  navItem: { alignItems: 'center', opacity: 0.3 },
  navActive: { opacity: 1 },
  navIcon: { fontSize: 24, marginBottom: 4 },
  navText: { color: '#475569', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
});





