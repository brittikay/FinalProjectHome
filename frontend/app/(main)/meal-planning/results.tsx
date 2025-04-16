import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Mock data - this will come from your backend
const mockMealPlan = {
  days: [
    {
      date: 'Monday',
      meals: {
        breakfast: {
          name: 'Veggie Omelette',
          ingredients: ['Eggs', 'Bell Peppers', 'Onions', 'Cheese'],
        },
        lunch: {
          name: 'Stir-Fry Rice Bowl',
          ingredients: ['Rice', 'Bell Peppers', 'Onions', 'Chicken'],
        },
        dinner: {
          name: 'Fajitas',
          ingredients: ['Chicken', 'Bell Peppers', 'Onions', 'Tortillas'],
        },
      },
    },
    // Add more days...
  ],
  sharedIngredients: [
    {
      name: 'Bell Peppers',
      usedIn: ['Veggie Omelette', 'Stir-Fry Rice Bowl', 'Fajitas'],
    },
    {
      name: 'Onions',
      usedIn: ['Veggie Omelette', 'Stir-Fry Rice Bowl', 'Fajitas'],
    },
    // Add more shared ingredients...
  ],
};

export default function MealPlanResultsScreen() {
  const router = useRouter();
  const { planId } = useLocalSearchParams();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Your Meal Plan</Text>
        
        {/* Daily Meal Plans */}
        {mockMealPlan.days.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            <Text style={styles.dayTitle}>{day.date}</Text>
            
            {/* Breakfast */}
            {day.meals.breakfast && (
              <View style={styles.mealContainer}>
                <Text style={styles.mealType}>Breakfast</Text>
                <Text style={styles.mealName}>{day.meals.breakfast.name}</Text>
                <Text style={styles.ingredients}>
                  {day.meals.breakfast.ingredients.join(', ')}
                </Text>
              </View>
            )}
            
            {/* Lunch */}
            {day.meals.lunch && (
              <View style={styles.mealContainer}>
                <Text style={styles.mealType}>Lunch</Text>
                <Text style={styles.mealName}>{day.meals.lunch.name}</Text>
                <Text style={styles.ingredients}>
                  {day.meals.lunch.ingredients.join(', ')}
                </Text>
              </View>
            )}
            
            {/* Dinner */}
            {day.meals.dinner && (
              <View style={styles.mealContainer}>
                <Text style={styles.mealType}>Dinner</Text>
                <Text style={styles.mealName}>{day.meals.dinner.name}</Text>
                <Text style={styles.ingredients}>
                  {day.meals.dinner.ingredients.join(', ')}
                </Text>
              </View>
            )}
          </View>
        ))}

        {/* Shared Ingredients Section */}
        <View style={styles.sharedIngredientsContainer}>
          <Text style={styles.sectionTitle}>Smart Ingredient Usage</Text>
          {mockMealPlan.sharedIngredients.map((ingredient, index) => (
            <View key={index} style={styles.sharedIngredientItem}>
              <Text style={styles.ingredientName}>{ingredient.name}</Text>
              <Text style={styles.usedIn}>
                Used in: {ingredient.usedIn.join(', ')}
              </Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.button}
            onPress={() => router.push('/shopping-list')}
          >
            <Text style={styles.buttonText}>View Shopping List</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.back()}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Generate New Plan
            </Text>
          </Pressable>
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  dayContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  mealContainer: {
    marginBottom: 12,
  },
  mealType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  mealName: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 4,
  },
  ingredients: {
    fontSize: 14,
    color: '#666',
  },
  sharedIngredientsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  sharedIngredientItem: {
    marginBottom: 8,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  usedIn: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    backgroundColor: '#2c3e50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2c3e50',
  },
  secondaryButtonText: {
    color: '#2c3e50',
  },
}); 