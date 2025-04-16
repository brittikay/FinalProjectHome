import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

// Mock data - In a real app, this would come from your backend
const recipes = [
  {
    id: 1,
    title: 'Spaghetti Carbonara',
    cuisine: 'Italian',
  },
  {
    id: 2,
    title: 'Chicken Tikka Masala',
    cuisine: 'Indian',
  },
  {
    id: 3,
    title: 'Sushi Roll',
    cuisine: 'Japanese',
  },
];

export default function Recipes() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.recipeList}>
        {recipes.map((recipe) => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.recipeCard}
            onPress={() => router.push(`/recipe/${recipe.id}`)}
          >
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
            <Text style={styles.recipeCuisine}>{recipe.cuisine}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/recipe-suggestions')}
      >
        <Text style={styles.addButtonText}>Add New Recipe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  recipeList: {
    flex: 1,
  },
  recipeCard: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  recipeCuisine: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  addButton: {
    backgroundColor: '#2c3e50',
    padding: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 