import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

// Mock data - will be replaced with API data
const mockRecipe = {
  id: '1',
  title: 'Veggie Stir-Fry with Rice',
  image: 'https://example.com/image.jpg',
  prepTime: '15 mins',
  cookTime: '20 mins',
  servings: 4,
  difficulty: 'Medium',
  calories: 450,
  ingredients: [
    { name: 'Rice', amount: '2 cups', category: 'Grains' },
    { name: 'Bell Peppers', amount: '2', category: 'Produce' },
    { name: 'Carrots', amount: '2', category: 'Produce' },
    { name: 'Broccoli', amount: '1 head', category: 'Produce' },
    { name: 'Soy Sauce', amount: '3 tbsp', category: 'Condiments' },
  ],
  instructions: [
    'Cook rice according to package instructions',
    'Chop all vegetables into bite-sized pieces',
    'Heat oil in a large wok or skillet',
    'Add vegetables and stir-fry for 5-7 minutes',
    'Add soy sauce and continue cooking for 2-3 minutes',
    'Serve vegetables over rice',
  ],
  nutrition: {
    protein: '10g',
    carbs: '65g',
    fat: '12g',
    fiber: '8g',
  },
};

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement backend integration for favorites
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{mockRecipe.title}</Text>
        <Pressable onPress={toggleFavorite} style={styles.favoriteButton}>
          <FontAwesome
            name={isFavorite ? 'heart' : 'heart-o'}
            size={24}
            color={isFavorite ? '#e74c3c' : '#2c3e50'}
          />
        </Pressable>
      </View>

      {/* Recipe Quick Info */}
      <View style={styles.quickInfo}>
        <View style={styles.infoItem}>
          <FontAwesome name="clock-o" size={20} color="#2c3e50" />
          <Text style={styles.infoText}>Prep: {mockRecipe.prepTime}</Text>
        </View>
        <View style={styles.infoItem}>
          <FontAwesome name="fire" size={20} color="#2c3e50" />
          <Text style={styles.infoText}>{mockRecipe.calories} cal</Text>
        </View>
        <View style={styles.infoItem}>
          <FontAwesome name="users" size={20} color="#2c3e50" />
          <Text style={styles.infoText}>Serves {mockRecipe.servings}</Text>
        </View>
      </View>

      {/* Ingredients */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {mockRecipe.ingredients.map((ingredient, index) => (
          <View key={index} style={styles.ingredientItem}>
            <Text style={styles.ingredientAmount}>{ingredient.amount}</Text>
            <Text style={styles.ingredientName}>{ingredient.name}</Text>
          </View>
        ))}
      </View>

      {/* Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        {mockRecipe.instructions.map((step, index) => (
          <View key={index} style={styles.instructionItem}>
            <Text style={styles.stepNumber}>{index + 1}</Text>
            <Text style={styles.instructionText}>{step}</Text>
          </View>
        ))}
      </View>

      {/* Nutrition Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nutrition Facts</Text>
        <View style={styles.nutritionGrid}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Protein</Text>
            <Text style={styles.nutritionValue}>{mockRecipe.nutrition.protein}</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Carbs</Text>
            <Text style={styles.nutritionValue}>{mockRecipe.nutrition.carbs}</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Fat</Text>
            <Text style={styles.nutritionValue}>{mockRecipe.nutrition.fat}</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Fiber</Text>
            <Text style={styles.nutritionValue}>{mockRecipe.nutrition.fiber}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  favoriteButton: {
    padding: 10,
  },
  quickInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  infoItem: {
    alignItems: 'center',
    gap: 5,
  },
  infoText: {
    color: '#2c3e50',
    fontSize: 14,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  ingredientItem: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  ingredientAmount: {
    width: 80,
    color: '#666',
  },
  ingredientName: {
    flex: 1,
    color: '#2c3e50',
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  stepNumber: {
    width: 25,
    height: 25,
    backgroundColor: '#2c3e50',
    color: '#fff',
    borderRadius: 12.5,
    textAlign: 'center',
    lineHeight: 25,
    marginRight: 10,
  },
  instructionText: {
    flex: 1,
    color: '#2c3e50',
    lineHeight: 20,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  nutritionLabel: {
    color: '#666',
    fontSize: 14,
  },
  nutritionValue: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
}); 