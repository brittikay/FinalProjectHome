import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Recipe {
  id: number;
  title: string;
  matchPercentage: number;
  cookingTime: string;
  ingredients: string[];
  missingIngredients: string[];
}

// Mock data - In a real app, this would come from your backend
const mockGroceries: string[] = [
  'chicken breast',
  'rice',
  'tomatoes',
  'onions',
  'garlic',
  'olive oil',
  'bell peppers',
];

const mockRecipeSuggestions: Recipe[] = [
  {
    id: 1,
    title: 'Chicken Stir Fry',
    matchPercentage: 95,
    cookingTime: '30 mins',
    ingredients: ['chicken breast', 'rice', 'bell peppers', 'onions', 'garlic', 'olive oil'],
    missingIngredients: ['soy sauce'],
  },
  {
    id: 2,
    title: 'Chicken and Rice Bowl',
    matchPercentage: 90,
    cookingTime: '25 mins',
    ingredients: ['chicken breast', 'rice', 'tomatoes', 'onions', 'olive oil'],
    missingIngredients: ['cilantro'],
  },
  {
    id: 3,
    title: 'Mediterranean Chicken',
    matchPercentage: 85,
    cookingTime: '40 mins',
    ingredients: ['chicken breast', 'tomatoes', 'garlic', 'olive oil'],
    missingIngredients: ['oregano', 'lemon'],
  },
];

export default function RecipeSuggestions() {
  const router = useRouter();

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <TouchableOpacity 
      style={styles.recipeCard}
      onPress={() => router.push(`/recipe/${recipe.id}`)}
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

      <Text style={styles.recipeTitle}>{recipe.title}</Text>
      
      <View style={styles.ingredientsContainer}>
        <Text style={styles.sectionTitle}>You have:</Text>
        <View style={styles.ingredientsList}>
          {recipe.ingredients.map((ingredient: string, index: number) => (
            <View key={index} style={styles.ingredientItem}>
              <FontAwesome5 name="check" size={12} color="#2ecc71" />
              <Text style={styles.ingredientText}>{ingredient}</Text>
            </View>
          ))}
        </View>

        {recipe.missingIngredients.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Missing:</Text>
            <View style={styles.ingredientsList}>
              {recipe.missingIngredients.map((ingredient: string, index: number) => (
                <View key={index} style={styles.ingredientItem}>
                  <FontAwesome5 name="plus" size={12} color="#e74c3c" />
                  <Text style={[styles.ingredientText, styles.missingText]}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recipe Suggestions</Text>
        <Text style={styles.subtitle}>Based on your groceries</Text>
      </View>

      <ScrollView style={styles.recipesContainer}>
        {mockRecipeSuggestions.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
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
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  recipesContainer: {
    flex: 1,
    padding: 10,
  },
  recipeCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
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
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  ingredientsContainer: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 5,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  ingredientText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#2c3e50',
  },
  missingText: {
    color: '#e74c3c',
  },
}); 