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
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={styles.priceTag}>
        <Text style={styles.priceText}>{item.price} 💰</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MARKET & ENVANTER</Text>
      <FlatList
        data={foodItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  title: {
    color: '#00E5FF',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 10,
    letterSpacing: 1.5,
    paddingLeft: 20,
  },
  listContent: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  itemCard: {
    width: 100,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: 12,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  disabledItem: {
    opacity: 0.3,
  },
  itemIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  itemName: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
  },
  priceTag: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  priceText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: 'bold',
  },
});


export default InventoryList;
