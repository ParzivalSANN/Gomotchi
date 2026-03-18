import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, View, Image } from 'react-native';

const FloatingRobot = ({ robotSource }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -20,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [translateY]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.robotContainer, { transform: [{ translateY }] }]}>
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
    height: 300,
  },
  robotContainer: {
    alignItems: 'center',
  },
  robotImage: {
    width: 200,
    height: 200,
  },
  shadow: {
    width: 100,
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 50,
    marginTop: 20,
    transform: [{ scaleX: 1.5 }],
  },
});

export default FloatingRobot;
