import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RecipeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  // Dummy data for recipes
  const recipes = [
    {
      id: 1,
      name: 'Chicken and Broccoli Stir Fry',
      description: 'A healthy and quick Asian-inspired dinner',
      prepTime: '15 mins',
      cookTime: '20 mins'
    },
    {
      id: 2,
      name: 'Spaghetti Carbonara',
      description: 'Classic Italian pasta dish with eggs and pancetta',
      prepTime: '10 mins',
      cookTime: '15 mins'
    },
    {
      id: 3,
      name: 'Vegetable Curry',
      description: 'Spicy and aromatic Indian curry with mixed vegetables',
      prepTime: '20 mins',
      cookTime: '30 mins'
    }
  ];

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <ScrollView style={styles.recipesContainer}>
        {filteredRecipes.map(recipe => (
          <Pressable
            key={recipe.id}
            style={styles.recipeCard}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}
          >
            <Text style={styles.recipeName}>{recipe.name}</Text>
            <Text style={styles.recipeDescription}>{recipe.description}</Text>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>Prep: {recipe.prepTime}</Text>
              <Text style={styles.timeText}>Cook: {recipe.cookTime}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate('AddRecipe')}
      >
        <Text style={styles.addButtonText}>+ Add Recipe</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  recipesContainer: {
    padding: 16,
  },
  recipeCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: '#888',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#2c3e50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 