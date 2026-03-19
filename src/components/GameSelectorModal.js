import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { ClayStyles, CLAY_COLORS } from '../styles/ClayStyles';

const { width } = Dimensions.get('window');

const GameSelectorModal = ({ visible, onClose, onSelect }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[ClayStyles.clayCard, styles.modal]}>
          <Text style={[ClayStyles.clayText, styles.title]}>OYUN SEÇİN 🎮</Text>
          
          <TouchableOpacity 
            style={[ClayStyles.clayButton, { backgroundColor: '#FF80AB', marginBottom: 15 }]}
            onPress={() => onSelect('cake')}
          >
            <Text style={styles.btnText}>🍰 KEK KULESİ</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[ClayStyles.clayButton, { backgroundColor: '#FFD54F', marginBottom: 15 }]}
            onPress={() => onSelect('mouse')}
          >
            <Text style={styles.btnText}>🔨 FARE PATLATMA</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[ClayStyles.clayButton, { backgroundColor: '#B2FF59', marginBottom: 15 }]}
            onPress={() => onSelect('hop')}
          >
            <Text style={styles.btnText}>🚀 PLANET HOP</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[ClayStyles.clayButton, { backgroundColor: '#64B5F6', marginBottom: 15 }]}
            onPress={() => onSelect('brick')}
          >
            <Text style={styles.btnText}>🧱 BRICK BLAST</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>VAZGEÇ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modal: { width: width * 0.85, alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 25, color: '#334155' },
  btnText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  closeBtn: { marginTop: 10 },
  closeText: { color: '#94A3B8', fontWeight: 'bold' },
});

export default GameSelectorModal;
