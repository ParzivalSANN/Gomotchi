import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const StatPanel = ({ title, value, color, icon }) => {
  return (
    <View style={styles.panelShadow}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.panelGradient}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={styles.panelTitle}>{title}</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${value}%`, backgroundColor: color }]} />
        </View>
        <Text style={styles.valueText}>{value}%</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  panelShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderRadius: 15,
    marginBottom: 15,
    width: '100%',
  },
  panelGradient: {
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  panelTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  progressContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  valueText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'right',
  },
});

export default StatPanel;
