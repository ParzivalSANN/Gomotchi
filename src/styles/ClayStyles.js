import { StyleSheet } from 'react-native';

export const CLAY_COLORS = {
  primary: '#3B82F6',   // Soft Blue
  secondary: '#EC4899', // Pink
  success: '#10B981',   // Mint/Green
  warning: '#F59E0B',   // Orange
  background: '#F0F9FF',// Light Blue Tint
  white: '#FFFFFF',
  shadowDark: 'rgba(0, 0, 0, 0.15)',
  shadowLight: 'rgba(255, 255, 255, 0.8)',
};

export const ClayStyles = StyleSheet.create({
  clayCard: {
    backgroundColor: CLAY_COLORS.white,
    borderRadius: 25,
    padding: 15,
    // Soft Double Shadow effect
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 5, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: 'rgba(255,255,255,0.8)',
    borderLeftColor: 'rgba(255,255,255,0.8)',
  },
  clayHUD: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  clayButton: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 30,
    backgroundColor: CLAY_COLORS.primary,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopColor: 'rgba(255,255,255,0.4)',
    borderLeftColor: 'rgba(255,255,255,0.4)',
  },
  clayText: {
    color: '#334155',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  claySmallTag: {
    backgroundColor: CLAY_COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.3)',
    borderLeftColor: 'rgba(255,255,255,0.3)',
  }
});

