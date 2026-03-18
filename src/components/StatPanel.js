import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const StatPanel = ({ title, value, color, icon }) => {
  return (
    <View style={styles.panelShadow}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.05)']}
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    borderRadius: 12,
    marginBottom: 10,
    width: '48%', // For a 2-column grid
  },
  panelGradient: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    fontSize: 14,
    marginRight: 6,
  },
  panelTitle: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  progressContainer: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  valueText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
});


export default StatPanel;
