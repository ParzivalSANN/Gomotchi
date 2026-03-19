import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGomotchiStore } from '../store/useGomotchiStore';
import { foodItems } from '../assets/items';
import { CLAY_COLORS, ClayStyles } from '../styles/ClayStyles';

const InventoryList = () => {
  const feed = useGomotchiStore((state) => state.feed);
  const gold = useGomotchiStore((state) => state.gold);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.clayItemCard, gold < item.price && styles.disabledItem]}
      onPress={() => feed(item)}
      disabled={gold < item.price}
    >
      <View style={styles.iconCircle}>
        <Text style={styles.itemIcon}>{item.icon}</Text>
      </View>
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={[styles.priceTag, { backgroundColor: gold >= item.price ? '#FEF3C7' : '#F1F5F9' }]}>
        <Text style={[styles.priceText, { color: gold >= item.price ? '#D97706' : '#94A3B8' }]}>
          {item.price} 💰
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
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
  listContent: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingVertical: 10,
  },
  clayItemCard: {
    width: 110,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 25,
    marginRight: 15,
    // Clay Shadow
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 5,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.7)',
    borderLeftColor: 'rgba(255,255,255,0.7)',
  },
  disabledItem: {
    opacity: 0.5,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemIcon: {
    fontSize: 28,
  },
  itemName: {
    color: '#334155',
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    height: 25,
  },
  priceTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceText: {
    fontSize: 10,
    fontWeight: '900',
  },
});

export default InventoryList;
