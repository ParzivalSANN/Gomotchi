import React, { useRef } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, PanResponder, Animated } from 'react-native';

const InteractionController = ({ children, onHeadPress, onBellyPress, onFeetPress, onSwipePet }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  // Swipe detection (Purr logic)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Simple threshold for swipe
        if (Math.abs(gestureState.dx) > 30 || Math.abs(gestureState.dy) > 30) {
          onSwipePet && onSwipePet();
        }
      },
      onPanResponderRelease: () => {
        // Reset or finish swipe action
      },
    })
  ).current;

  const handlePress = (event) => {
    const { locationY } = event.nativeEvent;
    const height = 300; // Expected height of the pet container

    if (locationY < height * 0.3) {
      onHeadPress && onHeadPress();
    } else if (locationY < height * 0.7) {
      onBellyPress && onBellyPress();
    } else {
      onFeetPress && onFeetPress();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.content} {...panResponder.panHandlers}>
          {children}
          {/* Debug Hitboxes (Transparent) */}
          <View style={[styles.hitbox, styles.head]} pointerEvents="none" />
          <View style={[styles.hitbox, styles.belly]} pointerEvents="none" />
          <View style={[styles.hitbox, styles.feet]} pointerEvents="none" />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hitbox: {
    position: 'absolute',
    left: 0,
    right: 0,
    // Optional: backgroundColor: 'rgba(255,0,0,0.1)' for debugging
  },
  head: {
    top: 0,
    height: '30%',
  },
  belly: {
    top: '30%',
    height: '40%',
  },
  feet: {
    top: '70%',
    height: '30%',
  },
});

export default InteractionController;
