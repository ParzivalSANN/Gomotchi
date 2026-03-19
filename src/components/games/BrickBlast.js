import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Dimensions, Animated, PanResponder } from 'react-native';
import { ClayStyles, CLAY_COLORS } from '../../styles/ClayStyles';

const { width, height } = Dimensions.get('window');
const BALL_SIZE = 15;
const PADDLE_WIDTH = 80;
const BRICK_ROWS = 3;
const BRICK_COLS = 5;

const BrickBlast = ({ visible, onClose, onFinish }) => {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const paddleX = useRef(new Animated.Value(width / 2 - PADDLE_WIDTH / 2)).current;
  const ballPos = useRef(new Animated.ValueXY({ x: width / 2, y: height / 2 })).current;
  const ballVel = useRef({ x: 4, y: -4 }).current;
  const [bricks, setBricks] = useState([]);
  const requestRef = useRef();

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gs) => {
        let newX = gs.moveX - PADDLE_WIDTH / 2;
        if (newX < 0) newX = 0;
        if (newX > width - PADDLE_WIDTH) newX = width - PADDLE_WIDTH;
        paddleX.setValue(newX);
      },
    })
  ).current;

  const initBricks = () => {
    const newBricks = [];
    for(let i=0; i<BRICK_ROWS; i++) {
      for(let j=0; j<BRICK_COLS; j++) {
        newBricks.push({
          id: `${i}-${j}`,
          x: j * (width / BRICK_COLS) + 5,
          y: i * 40 + 100,
          width: (width / BRICK_COLS) - 10,
          height: 30,
          active: true,
          color: i === 0 ? '#F87171' : i === 1 ? '#FB923C' : '#FBBF24'
        });
      }
    }
    setBricks(newBricks);
  };

  const gameLoop = () => {
    if (!isPlaying) return;

    let nextX = ballPos.x._value + ballVel.x;
    let nextY = ballPos.y._value + ballVel.y;

    // Wall Collisions
    if (nextX <= 0 || nextX >= width - BALL_SIZE) ballVel.x *= -1;
    if (nextY <= 50) ballVel.y *= -1;

    // Paddle Collision
    if (nextY >= height - 120 && nextX >= paddleX._value && nextX <= paddleX._value + PADDLE_WIDTH) {
      ballVel.y *= -1;
      nextY = height - 121;
    }

    // Floor Collision (Game Over)
    if (nextY >= height) {
      setIsPlaying(false);
      onFinish(score);
      return;
    }

    ballPos.setValue({ x: nextX, y: nextY });
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    if (isPlaying) {
      initBricks();
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <Text style={styles.scoreText}>PUAN: {score}</Text>
        
        {!isPlaying ? (
          <View style={[ClayStyles.clayCard, styles.startCard]}>
            <TouchableOpacity style={styles.closeX} onPress={onClose}>
               <Text style={styles.closeXText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.title}>BRICK BLAST 🧱</Text>
            <TouchableOpacity style={ClayStyles.clayButton} onPress={() => setIsPlaying(true)}>
              <Text style={styles.btnText}>BAŞLA</Text>
            </TouchableOpacity>
          </View>

        ) : (
          <View style={styles.gameArea} {...panResponder.panHandlers}>
            {bricks.map(b => b.active && (
              <View key={b.id} style={[styles.brick, { left: b.x, top: b.y, width: b.width, height: b.height, backgroundColor: b.color }]} />
            ))}
            <Animated.View style={[styles.ball, { left: ballPos.x, top: ballPos.y }]} />
            <Animated.View style={[styles.paddle, { left: paddleX }]}>
              <Text style={{ fontSize: 30 }}>🧱</Text>
            </Animated.View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scoreText: { position: 'absolute', top: 50, width: '100%', textAlign: 'center', color: '#fff', fontSize: 24, fontWeight: '900', zIndex: 10 },
  startCard: { position: 'absolute', top: '30%', left: '10%', right: '10%', alignItems: 'center' },
  title: { fontSize: 24, color: '#334155', marginBottom: 20, fontWeight: '900' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  gameArea: { flex: 1 },
  brick: { position: 'absolute', borderRadius: 8, borderTopWidth: 2, borderLeftWidth: 2, borderBottomWidth: 4, borderBottomColor: 'rgba(0,0,0,0.2)' },
  ball: { position: 'absolute', width: BALL_SIZE, height: BALL_SIZE, backgroundColor: '#F8FAFC', borderRadius: BALL_SIZE/2, borderTopWidth: 2, borderLeftWidth: 2, borderTopColor: 'rgba(255,255,255,0.5)', borderLeftColor: 'rgba(255,255,255,0.5)' },
  closeX: { position: 'absolute', top: 15, right: 15, zIndex: 100 },
  closeXText: { color: '#94A3B8', fontSize: 20, fontWeight: 'bold' },
});


export default BrickBlast;
