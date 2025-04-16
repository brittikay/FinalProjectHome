import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Meal {
  name: string;
  ingredients: string[];
}

interface DayMeals {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
}

interface MealPlan {
  [key: string]: DayMeals;
}

// Mock data - In a real app, this would come from your backend
const mockMealPlan: MealPlan = {
  monday: {
    breakfast: { name: 'Oatmeal with Fruits', ingredients: ['oats', 'banana', 'honey'] },
    lunch: { name: 'Chicken Rice Bowl', ingredients: ['chicken breast', 'rice', 'vegetables'] },
    dinner: { name: 'Grilled Fish', ingredients: ['salmon', 'asparagus', 'lemon'] }
  },
  tuesday: {
    breakfast: { name: 'Yogurt Parfait', ingredients: ['yogurt', 'granola', 'berries'] },
    lunch: { name: 'Mediterranean Salad', ingredients: ['lettuce', 'tomatoes', 'feta cheese'] },
    dinner: { name: 'Stir-Fry Vegetables', ingredients: ['tofu', 'mixed vegetables', 'soy sauce'] }
  },
  wednesday: {
    breakfast: { name: 'Avocado Toast', ingredients: ['bread', 'avocado', 'eggs', 'tomatoes'] },
    lunch: { name: 'Quinoa Bowl', ingredients: ['quinoa', 'chickpeas', 'sweet potato', 'kale'] },
    dinner: { name: 'Pasta Primavera', ingredients: ['pasta', 'mixed vegetables', 'olive oil', 'parmesan'] }
  },
  thursday: {
    breakfast: { name: 'Smoothie Bowl', ingredients: ['frozen fruits', 'yogurt', 'honey', 'granola'] },
    lunch: { name: 'Turkey Wrap', ingredients: ['tortilla', 'turkey', 'lettuce', 'tomatoes'] },
    dinner: { name: 'Baked Chicken', ingredients: ['chicken breast', 'potatoes', 'broccoli'] }
  },
  friday: {
    breakfast: { name: 'Breakfast Burrito', ingredients: ['tortilla', 'eggs', 'cheese', 'salsa'] },
    lunch: { name: 'Tuna Salad', ingredients: ['tuna', 'lettuce', 'cucumber', 'olive oil'] },
    dinner: { name: 'Vegetable Curry', ingredients: ['rice', 'mixed vegetables', 'coconut milk', 'curry paste'] }
  }
};

export default function GenerateMealPlan() {
  const router = useRouter();
  const [preferences, setPreferences] = useState({
    calories: '2000',
    restrictions: '',
    servings: '4',
  });
  const [generatedPlan, setGeneratedPlan] = useState<MealPlan | null>(null);

  const handleGenerate = () => {
    // In a real app, this would call your backend API
    setGeneratedPlan(mockMealPlan);
  };

  const MealCard = ({ meal, time }: { meal: Meal; time: string }) => (
    <View style={styles.mealCard}>
      <View style={styles.mealHeader}>
        <Text style={styles.mealTime}>{time}</Text>
        <TouchableOpacity>
          <FontAwesome5 name="exchange-alt" size={16} color="#2ecc71" />
        </TouchableOpacity>
      </View>
      <Text style={styles.mealName}>{meal.name}</Text>
      <View style={styles.ingredientsList}>
        {meal.ingredients.map((ingredient: string, index: number) => (
          <View key={index} style={styles.ingredientChip}>
            <Text style={styles.ingredientText}>{ingredient}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {!generatedPlan ? (
        <View style={styles.preferencesContainer}>
          <Text style={styles.title}>Generate Meal Plan</Text>
          <Text style={styles.subtitle}>Set your preferences</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Daily Calories Target</Text>
            <TextInput
              style={styles.input}
              value={preferences.calories}
              onChangeText={(text) => setPreferences(prev => ({ ...prev, calories: text }))}
              keyboardType="numeric"
              placeholder="e.g., 2000"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Dietary Restrictions</Text>
            <TextInput
              style={styles.input}
              value={preferences.restrictions}
              onChangeText={(text) => setPreferences(prev => ({ ...prev, restrictions: text }))}
              placeholder="e.g., vegetarian, gluten-free"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Servings per Meal</Text>
            <TextInput
              style={styles.input}
              value={preferences.servings}
              onChangeText={(text) => setPreferences(prev => ({ ...prev, servings: text }))}
              keyboardType="numeric"
              placeholder="e.g., 4"
            />
          </View>

          <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
            <Text style={styles.generateButtonText}>Generate Plan</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.planContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Your Meal Plan</Text>
            <TouchableOpacity 
              style={styles.regenerateButton}
              onPress={() => setGeneratedPlan(null)}
            >
              <FontAwesome5 name="redo" size={16} color="#2ecc71" />
              <Text style={styles.regenerateText}>Adjust Preferences</Text>
            </TouchableOpacity>
          </View>

          {Object.entries(generatedPlan).map(([day, meals]) => (
            <View key={day} style={styles.dayContainer}>
              <Text style={styles.dayTitle}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
              <MealCard meal={meals.breakfast} time="Breakfast" />
              <MealCard meal={meals.lunch} time="Lunch" />
              <MealCard meal={meals.dinner} time="Dinner" />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  preferencesContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  generateButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  planContainer: {
    flex: 1,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  regenerateText: {
    color: '#2ecc71',
    marginLeft: 8,
    fontSize: 16,
  },
  dayContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f2f6',
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  mealCard: {
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
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mealTime: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  mealName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ingredientChip: {
    backgroundColor: '#f1f2f6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 14,
    color: '#2c3e50',
  },
}); 