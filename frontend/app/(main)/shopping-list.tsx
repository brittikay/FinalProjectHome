import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Share,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// Mock data - will be replaced with API data
const mockItems = [
  {
    category: 'Produce',
    items: [
      { id: '1', name: 'Bell Peppers', amount: '2', price: 3.99, checked: false },
      { id: '2', name: 'Carrots', amount: '2', price: 1.99, checked: false },
      { id: '3', name: 'Broccoli', amount: '1 head', price: 2.49, checked: false },
    ],
  },
  {
    category: 'Grains',
    items: [
      { id: '4', name: 'Rice', amount: '2 cups', price: 4.99, checked: false },
    ],
  },
  {
    category: 'Condiments',
    items: [
      { id: '5', name: 'Soy Sauce', amount: '3 tbsp', price: 3.99, checked: false },
    ],
  },
];

export default function ShoppingListScreen() {
  const [items, setItems] = useState(mockItems);
  const [newItem, setNewItem] = useState('');

  const toggleItem = (categoryIndex: number, itemId: string) => {
    const newItems = [...items];
    const category = newItems[categoryIndex];
    const itemIndex = category.items.findIndex((item) => item.id === itemId);
    category.items[itemIndex].checked = !category.items[itemIndex].checked;
    setItems(newItems);
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    // In a real app, we would make an API call here
    // For now, we'll add it to the "Other" category
    const otherCategoryIndex = items.findIndex((cat) => cat.category === 'Other');
    const newItems = [...items];
    
    if (otherCategoryIndex === -1) {
      newItems.push({
        category: 'Other',
        items: [{
          id: Date.now().toString(),
          name: newItem,
          amount: '1',
          price: 0,
          checked: false,
        }],
      });
    } else {
      newItems[otherCategoryIndex].items.push({
        id: Date.now().toString(),
        name: newItem,
        amount: '1',
        price: 0,
        checked: false,
      });
    }
    
    setItems(newItems);
    setNewItem('');
  };

  const getTotalPrice = () => {
    return items
      .flatMap((category) => category.items)
      .reduce((total, item) => total + item.price, 0)
      .toFixed(2);
  };

  const shareList = async () => {
    try {
      const message = items
        .map((category) => {
          return `${category.category}:\n${category.items
            .map((item) => `- ${item.amount} ${item.name}`)
            .join('\n')}`;
        })
        .join('\n\n');

      await Share.share({
        message: `Shopping List:\n\n${message}\n\nTotal: $${getTotalPrice()}`,
      });
    } catch (error) {
      console.error('Error sharing list:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping List</Text>
        <Pressable onPress={shareList} style={styles.shareButton}>
          <FontAwesome name="share-alt" size={24} color="#2c3e50" />
        </Pressable>
      </View>

      <View style={styles.addItemContainer}>
        <TextInput
          style={styles.input}
          value={newItem}
          onChangeText={setNewItem}
          placeholder="Add new item..."
          onSubmitEditing={addItem}
        />
        <Pressable onPress={addItem} style={styles.addButton}>
          <FontAwesome name="plus" size={20} color="#fff" />
        </Pressable>
      </View>

      <ScrollView style={styles.list}>
        {items.map((category, categoryIndex) => (
          <View key={category.category} style={styles.category}>
            <Text style={styles.categoryTitle}>{category.category}</Text>
            {category.items.map((item) => (
              <Pressable
                key={item.id}
                style={[
                  styles.item,
                  item.checked && styles.checkedItem,
                ]}
                onPress={() => toggleItem(categoryIndex, item.id)}
              >
                <View style={styles.checkbox}>
                  {item.checked && (
                    <FontAwesome name="check" size={16} color="#2ecc71" />
                  )}
                </View>
                <View style={styles.itemInfo}>
                  <Text
                    style={[
                      styles.itemName,
                      item.checked && styles.checkedText,
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text style={styles.itemAmount}>{item.amount}</Text>
                </View>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.total}>Total: ${getTotalPrice()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  shareButton: {
    padding: 10,
  },
  addItemContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#2ecc71',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  category: {
    backgroundColor: '#fff',
    marginTop: 10,
    paddingVertical: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  checkedItem: {
    backgroundColor: '#f8f9fa',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#2ecc71',
    borderRadius: 12,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: '#2c3e50',
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: '#95a5a6',
  },
  itemAmount: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'right',
  },
}); 