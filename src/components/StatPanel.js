import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CLAY_COLORS } from '../styles/ClayStyles';

const StatPanel = ({ title, value, color, icon }) => {
  return (
    <View style={styles.clayCard}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <Text style={styles.panelTitle}>{title}</Text>
      </View>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${value}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.valueText}>{Math.floor(value)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  clayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    width: '48%',
    marginBottom: 15,
    // Clay Shadow
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.6)',
    borderLeftColor: 'rgba(255,255,255,0.6)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    backgroundColor: '#F1F5F9',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  icon: {
    fontSize: 12,
  },
  panelTitle: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  progressContainer: {
    height: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    overflow: 'hidden',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
    // Inner shadow on bar
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
  },
  valueText: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 6,
    textAlign: 'right',
  },
});

export default StatPanel;
