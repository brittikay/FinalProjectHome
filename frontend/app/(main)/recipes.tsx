import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

// Temporary mock data
const mockRecipes = [
  { id: '1', title: 'Spaghetti Carbonara', cuisine: 'Italian' },
  { id: '2', title: 'Chicken Tikka Masala', cuisine: 'Indian' },
  { id: '3', title: 'Sushi Roll', cuisine: 'Japanese' },
];

export default function RecipesScreen() {
  const router = useRouter();

  const renderRecipeItem = ({ item }) => (
    <Pressable
      style={styles.recipeCard}
      onPress={() => router.push(`/recipe/${item.id}`)}
    >
      <Text style={styles.recipeTitle}>{item.title}</Text>
      <Text style={styles.recipeCuisine}>{item.cuisine}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockRecipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <Pressable
        style={styles.addButton}
        onPress={() => router.push('/recipe/new')}
      >
        <Text style={styles.addButtonText}>Add New Recipe</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  recipeCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  recipeCuisine: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#2c3e50',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 