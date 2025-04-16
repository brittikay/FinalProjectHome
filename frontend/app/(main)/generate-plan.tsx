import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

const dietaryRestrictions = [
  { label: 'None', value: 'none' },
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Gluten-Free', value: 'gluten-free' },
  { label: 'Dairy-Free', value: 'dairy-free' },
  { label: 'Keto', value: 'keto' },
  { label: 'Paleo', value: 'paleo' },
];

export default function GeneratePlanScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    numberOfDays: '5',
    mealsPerDay: {
      breakfast: true,
      lunch: true,
      dinner: true,
    },
    dietaryRestriction: 'none',
    budget: '',
    additionalNotes: '',
  });

  const handleGeneratePlan = async () => {
    try {
      // TODO: Call your backend API to generate the meal plan
      const response = await fetch('http://your-backend-url/api/generate-meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      // Navigate to the meal plan results screen with the generated plan
      router.push({
        pathname: '/meal-plan-results',
        params: { planId: data.planId }
      });
    } catch (error) {
      console.error('Error generating meal plan:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Generate Meal Plan</Text>
        
        {/* Number of Days */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of Days</Text>
          <Picker
            selectedValue={formData.numberOfDays}
            onValueChange={(value) =>
              setFormData({ ...formData, numberOfDays: value })
            }
            style={styles.picker}
          >
            {[3, 5, 7, 14].map((days) => (
              <Picker.Item key={days} label={`${days} days`} value={days.toString()} />
            ))}
          </Picker>
        </View>

        {/* Meals per Day */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Meals to Include</Text>
          <View style={styles.mealsToggle}>
            <View style={styles.mealOption}>
              <Text>Breakfast</Text>
              <Switch
                value={formData.mealsPerDay.breakfast}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    mealsPerDay: { ...formData.mealsPerDay, breakfast: value },
                  })
                }
              />
            </View>
            <View style={styles.mealOption}>
              <Text>Lunch</Text>
              <Switch
                value={formData.mealsPerDay.lunch}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    mealsPerDay: { ...formData.mealsPerDay, lunch: value },
                  })
                }
              />
            </View>
            <View style={styles.mealOption}>
              <Text>Dinner</Text>
              <Switch
                value={formData.mealsPerDay.dinner}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    mealsPerDay: { ...formData.mealsPerDay, dinner: value },
                  })
                }
              />
            </View>
          </View>
        </View>

        {/* Dietary Restrictions */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dietary Restrictions</Text>
          <Picker
            selectedValue={formData.dietaryRestriction}
            onValueChange={(value) =>
              setFormData({ ...formData, dietaryRestriction: value })
            }
            style={styles.picker}
          >
            {dietaryRestrictions.map((diet) => (
              <Picker.Item key={diet.value} label={diet.label} value={diet.value} />
            ))}
          </Picker>
        </View>

        {/* Budget */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Weekly Budget (optional)</Text>
          <TextInput
            style={styles.textInput}
            value={formData.budget}
            onChangeText={(value) => setFormData({ ...formData, budget: value })}
            placeholder="Enter your budget"
            keyboardType="numeric"
          />
        </View>

        {/* Additional Notes */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Additional Notes (optional)</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={formData.additionalNotes}
            onChangeText={(value) =>
              setFormData({ ...formData, additionalNotes: value })
            }
            placeholder="Any allergies, preferences, or ingredients to avoid?"
            multiline
            numberOfLines={4}
          />
        </View>

        <Pressable style={styles.generateButton} onPress={handleGeneratePlan}>
          <Text style={styles.generateButtonText}>Generate Meal Plan</Text>
        </Pressable>
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  mealsToggle: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  mealOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  generateButton: {
    backgroundColor: '#2c3e50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 