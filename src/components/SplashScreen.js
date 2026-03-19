import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ClayStyles, CLAY_COLORS } from '../styles/ClayStyles';

const { width } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 800, useNativeDriver: true }).start(onFinish);
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onFinish]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F0F9FF', '#E0F2FE']} style={StyleSheet.absoluteFill} />
      
      <Animated.Image 
        source={require('../assets/splash.png')}
        style={[styles.splashImg, { opacity: fadeAnim, transform: [{ scale: scaleAnim }, { translateY: fadeAnim.interpolate({inputRange: [0, 1], outputRange: [20, 0]}) }] }]}
        resizeMode="cover"
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>GOMOTCHI</Text>
        <Text style={styles.subtitle}>ANTIGRAVITY EDITION</Text>
        
        <View style={styles.loaderOuter}>
          <Animated.View style={[styles.loaderInner, { width: fadeAnim.interpolate({inputRange: [0, 1], outputRange: ['0%', '100%']}) }]} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F9FF' },
  splashImg: { 
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  content: { 
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    width: '100%',
  },
  title: { 
    fontSize: 42, 
    fontWeight: '900', 
    color: '#fff', 
    letterSpacing: 6,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 2, height: 4 },
    textShadowRadius: 10,
  },
  subtitle: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: 'rgba(255,255,255,0.8)', 
    letterSpacing: 3, 
    marginTop: 5,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 5,
  },
  loaderOuter: { 
    width: '60%', 
    height: 8, 
    backgroundColor: 'rgba(255,255,255,0.3)', 
    borderRadius: 4, 
    marginTop: 30, 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  loaderInner: { 
    height: '100%', 
    backgroundColor: '#fff', 
    borderRadius: 4,
  },
});


export default SplashScreen;
