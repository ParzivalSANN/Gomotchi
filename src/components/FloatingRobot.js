import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, View, Image } from 'react-native';

const FloatingRobot = ({ robotSource }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(translateY, { toValue: -15, duration: 2000, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.05, duration: 2000, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 2000, useNativeDriver: true }),
        ])
      ])
    ).start();
  }, [translateY, scale]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.robotContainer, { transform: [{ translateY }, { scale }] }]}>
        <Image 
          source={robotSource} 
          style={styles.robotImage} 
          resizeMode="contain"
        />
        <View style={styles.shadow} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 350,
  },
  robotContainer: {
    alignItems: 'center',
  },
  robotImage: {
    width: 280,
    height: 280,
  },

  shadow: {
    width: 140,
    height: 12,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 50,
    marginTop: 10,
    transform: [{ scaleX: 1.2 }],
  },
});

export default FloatingRobot;
