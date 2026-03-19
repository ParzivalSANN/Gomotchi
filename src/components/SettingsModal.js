import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Switch, Linking } from 'react-native';
import { ClayStyles, CLAY_COLORS } from '../styles/ClayStyles';
import { useGomotchiStore } from '../store/useGomotchiStore';

const SettingsModal = ({ visible, onClose }) => {
  const { settings, toggleSetting, unitName, age } = useGomotchiStore();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={[ClayStyles.clayCard, styles.card]}>
          <Text style={styles.title}>AYARLAR ⚙️</Text>
          
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>İsim: <Text style={{fontWeight: '900'}}>{unitName}</Text></Text>
            <Text style={styles.infoText}>Yaş: <Text style={{fontWeight: '900'}}>{age}</Text></Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Ses Efektleri</Text>
            <Switch 
              value={settings.soundEnabled} 
              onValueChange={() => toggleSetting('soundEnabled')}
              trackColor={{ false: '#CBD5E1', true: CLAY_COLORS.primary }}
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Titreşim</Text>
            <Switch 
              value={settings.vibrationEnabled} 
              onValueChange={() => toggleSetting('vibrationEnabled')}
              trackColor={{ false: '#CBD5E1', true: CLAY_COLORS.primary }}
            />
          </View>

          <TouchableOpacity 
            style={[ClayStyles.clayButton, styles.videoBtn]} 
            onPress={() => Linking.openURL('https://youtu.be/BSDqoXTDnI0')}
          >
            <Text style={styles.videoBtnText}>🎥 TANITIM VİDEOSU</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[ClayStyles.clayButton, styles.closeBtn]} onPress={onClose}>
            <Text style={styles.closeBtnText}>KAPAT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  card: { width: '85%', padding: 30 },
  title: { fontSize: 22, fontWeight: '900', color: '#1E293B', marginBottom: 20, textAlign: 'center' },
  infoBox: { backgroundColor: '#F8FAFC', padding: 15, borderRadius: 15, marginBottom: 20 },
  infoText: { color: '#64748B', fontSize: 14, marginBottom: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  label: { fontSize: 16, color: '#334155', fontWeight: 'bold' },
  videoBtn: { marginTop: 10, backgroundColor: '#EF4444' },
  videoBtnText: { color: '#fff', fontWeight: '900', textAlign: 'center' },
  closeBtn: { marginTop: 15, backgroundColor: '#94A3B8' },
  closeBtnText: { color: '#fff', fontWeight: '900', textAlign: 'center' },
});

export default SettingsModal;
