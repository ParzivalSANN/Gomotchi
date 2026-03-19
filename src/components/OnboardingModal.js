import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ClayStyles, CLAY_COLORS } from '../styles/ClayStyles';
import { useGomotchiStore } from '../store/useGomotchiStore';

const OnboardingModal = ({ visible }) => {
  const completeOnboarding = useGomotchiStore((state) => state.completeOnboarding);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handleStart = () => {
    if (!name.trim() || !age.trim()) {
      Alert.alert("Eksik Bilgi", "Lütfen robotun ismini ve yaşını girin!");
      return;
    }
    completeOnboarding(name, age);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <View style={[ClayStyles.clayCard, styles.card]}>
          <Text style={styles.title}>YENİ BİR DOST 🤖</Text>
          <Text style={styles.subtitle}>Robotuna bir isim ver ve maceraya başla!</Text>

          <TextInput
            style={styles.input}
            placeholder="Robotun İsmi"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Senin Yaşın"
            placeholderTextColor="#94A3B8"
            value={age}
            keyboardType="numeric"
            onChangeText={setAge}
          />

          <TouchableOpacity style={[ClayStyles.clayButton, styles.btn]} onPress={handleStart}>
            <Text style={styles.btnText}>HAYDİ BAŞLAYALIM!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  card: { width: '85%', padding: 30, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: '#1E293B', marginBottom: 10 },
  subtitle: { textAlign: 'center', color: '#64748B', marginBottom: 25 },
  input: {
    width: '100%',
    backgroundColor: '#F1F5F9',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#334155',
    fontWeight: 'bold',
  },
  btn: { width: '100%', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: '900', textAlign: 'center', fontSize: 16 },
});

export default OnboardingModal;
