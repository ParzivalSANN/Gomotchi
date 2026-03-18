import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGomotchiStore } from '../store/useGomotchiStore';
import { foodItems } from '../assets/items';

const InventoryList = () => {
  const feed = useGomotchiStore((state) => state.feed);
  const gold = useGomotchiStore((state) => state.gold);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.itemCard, gold < item.price && styles.disabledItem]}
      onPress={() => feed(item)}
      disabled={gold < item.price}
    >
      <Text style={styles.itemIcon}>{item.icon}</Text>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemEffect}>+{item.hungerValue} Açlık</Text>
      </View>
      <View style={styles.priceTag}>
        <Text style={styles.priceText}>{item.price} 💰</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ENVANTER & MARKET</Text>
      <FlatList
        data={foodItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  title: {
    color: '#00E5FF',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 15,
    letterSpacing: 2,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  disabledItem: {
    opacity: 0.4,
  },
  itemIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  itemEffect: {
    color: '#4CAF50',
    fontSize: 11,
    marginTop: 2,
  },
  priceTag: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priceText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default InventoryList;
