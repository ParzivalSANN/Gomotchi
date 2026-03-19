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
        <View style={styles.textContainer}>
          <Text style={styles.title}>GOMOTCHI</Text>
          <Text style={styles.subtitle}>ANTIGRAVITY EDITION</Text>
        </View>
        
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
    bottom: 60, // Lowered
    alignItems: 'center',
    width: '100%',
  },
  textContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  title: { 
    fontSize: 42, 
    fontWeight: '900', 
    color: '#fff', 
    letterSpacing: 4, // Tighter
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  subtitle: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: 'rgba(255,255,255,0.9)', 
    letterSpacing: 2, 
    marginTop: 2,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  loaderOuter: { 
    width: '50%', 
    height: 6, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    borderRadius: 3, 
    marginTop: 20, 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  loaderInner: { 
    height: '100%', 
    backgroundColor: '#fff', 
    borderRadius: 3,
  },
});



export default SplashScreen;
