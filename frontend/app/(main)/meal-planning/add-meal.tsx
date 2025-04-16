import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Recipe {
  id: number;
  name: string;
  calories: number;
  cookingTime: string;
  ingredients: string[];
  matchPercentage: number;
}

const mockSuggestions: Recipe[] = [
  {
    id: 1,
    name: 'Grilled Chicken Salad',
    calories: 450,
    cookingTime: '25 mins',
    ingredients: ['chicken breast', 'lettuce', 'tomatoes', 'cucumber', 'olive oil'],
    matchPercentage: 95,
  },
  {
    id: 2,
    name: 'Quinoa Buddha Bowl',
    calories: 380,
    cookingTime: '20 mins',
    ingredients: ['quinoa', 'chickpeas', 'sweet potato', 'kale', 'tahini'],
    matchPercentage: 85,
  },
  {
    id: 3,
    name: 'Mediterranean Pasta',
    calories: 520,
    cookingTime: '30 mins',
    ingredients: ['pasta', 'tomatoes', 'olives', 'feta', 'olive oil'],
    matchPercentage: 80,
  },
];

export default function AddMealScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState(mockSuggestions);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = mockSuggestions.filter(recipe =>
      recipe.name.toLowerCase().includes(text.toLowerCase()) ||
      recipe.ingredients.some(ing => ing.toLowerCase().includes(text.toLowerCase()))
    );
    setFilteredRecipes(filtered);
  };

  const handleAddMeal = (recipe: Recipe) => {
    // This would update the meal plan in your backend
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={20} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Meal</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome5 name="search" size={16} color="#7f8c8d" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes or ingredients..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>
          Suggested recipes based on your preferences
        </Text>

        {filteredRecipes.map((recipe) => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.recipeCard}
            onPress={() => handleAddMeal(recipe)}
          >
            <View style={styles.recipeHeader}>
              <View style={styles.matchBadge}>
                <Text style={styles.matchText}>{recipe.matchPercentage}% Match</Text>
              </View>
              <View style={styles.timeContainer}>
                <FontAwesome5 name="clock" size={12} color="#666" />
                <Text style={styles.timeText}>{recipe.cookingTime}</Text>
              </View>
            </View>

            <Text style={styles.recipeName}>{recipe.name}</Text>

            <View style={styles.recipeDetails}>
              <View style={styles.detailItem}>
                <FontAwesome5 name="fire" size={12} color="#e74c3c" />
                <Text style={styles.detailText}>{recipe.calories} cal</Text>
              </View>
              <View style={styles.ingredientsList}>
                {recipe.ingredients.map((ingredient, index) => (
                  <View key={index} style={styles.ingredientChip}>
                    <Text style={styles.ingredientText}>{ingredient}</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => handleAddMeal(recipe)}
            >
              <FontAwesome5 name="plus" size={16} color="#fff" />
              <Text style={styles.addButtonText}>Add to meal plan</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    margin: 20,
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  recipeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  matchBadge: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  matchText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 12,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  recipeDetails: {
    marginTop: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  ingredientChip: {
    backgroundColor: '#f5f6fa',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 12,
    color: '#2c3e50',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2ecc71',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
}); 