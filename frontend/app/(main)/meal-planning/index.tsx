import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { generateMealPlan, setPreferences, swapMeal, toggleFavoriteRecipe } from '../../../store/slices/mealPlanningSlice';

interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  calories: number;
  isFavorite: boolean;
}

interface Meal {
  id: number;
  recipe: Recipe;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
}

interface DayPlan {
  date: string;
  meals: Meal[];
}

const CALORIE_OPTIONS = [
  '1500',
  '1800',
  '2000',
  '2200',
  '2500',
  '3000'
];

const DIETARY_RESTRICTIONS = [
  'None',
  'Vegetarian',
  'Vegan',
  'Gluten-free',
  'Dairy-free',
  'Keto',
  'Paleo',
  'Low-carb'
];

export default function MealPlanningScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentPlan, preferences, loading, error } = useAppSelector(state => state.mealPlanning);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showCaloriesDropdown, setShowCaloriesDropdown] = useState(false);
  const [showRestrictionsDropdown, setShowRestrictionsDropdown] = useState(false);

  const handleGeneratePlan = () => {
    dispatch(generateMealPlan(preferences));
    setShowGenerateModal(false);
  };

  const handleSwapMeal = (date: string, mealType: string, recipeId: number) => {
    dispatch(swapMeal({ date, mealType, recipeId }));
  };

  const handleToggleFavorite = (recipeId: number) => {
    dispatch(toggleFavoriteRecipe(recipeId));
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: string) => {
    dispatch(setPreferences({ [key]: value }));
  };

  return (
    <View style={styles.container}>
      {/* Header with Generate button */}
      <View style={styles.header}>
        <Text style={styles.title}>Meal Planning</Text>
        <TouchableOpacity 
          style={styles.generateButton}
          onPress={() => setShowGenerateModal(true)}
        >
          <FontAwesome5 name="magic" size={16} color="#fff" />
          <Text style={styles.generateButtonText}>Generate Plan</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar View */}
      <ScrollView style={styles.calendarContainer}>
        {/* Week Navigation */}
        <View style={styles.weekNavigation}>
          <TouchableOpacity>
            <FontAwesome5 name="chevron-left" size={20} color="#2c3e50" />
          </TouchableOpacity>
          <Text style={styles.weekText}>April 15 - April 21</Text>
          <TouchableOpacity>
            <FontAwesome5 name="chevron-right" size={20} color="#2c3e50" />
          </TouchableOpacity>
        </View>

        {/* Days */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <TouchableOpacity 
              key={day}
              style={[styles.dayButton, index === 0 && styles.selectedDay]}
            >
              <Text style={styles.dayText}>{day}</Text>
              <Text style={styles.dateText}>{15 + index}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Meals for selected day */}
        <View style={styles.mealsContainer}>
          {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((mealType) => (
            <View key={mealType} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealType}>{mealType}</Text>
                <View style={styles.mealActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <FontAwesome5 name="star" size={16} color="#f1c40f" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <FontAwesome5 name="exchange-alt" size={16} color="#2ecc71" />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.addMealButton}
                onPress={() => router.push('/meal-planning/add-meal')}
              >
                <FontAwesome5 name="plus" size={20} color="#2ecc71" />
                <Text style={styles.addMealText}>Add {mealType}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Generate Modal */}
      {showGenerateModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Generate Meal Plan</Text>
            
            {/* Calories Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Daily Calories Target</Text>
              <Pressable
                style={styles.dropdownButton}
                onPress={() => {
                  setShowCaloriesDropdown(!showCaloriesDropdown);
                  setShowRestrictionsDropdown(false);
                }}
              >
                <Text style={styles.dropdownButtonText}>
                  {preferences.calories || 'Select calories'}
                </Text>
                <FontAwesome5 
                  name={showCaloriesDropdown ? 'chevron-up' : 'chevron-down'} 
                  size={16} 
                  color="#7f8c8d" 
                />
              </Pressable>
              {showCaloriesDropdown && (
                <View style={styles.dropdownList}>
                  {CALORIE_OPTIONS.map((option) => (
                    <Pressable
                      key={option}
                      style={styles.dropdownItem}
                      onPress={() => {
                        handlePreferenceChange('calories', option);
                        setShowCaloriesDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{option} calories</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Dietary Restrictions Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Dietary Restrictions</Text>
              <Pressable
                style={styles.dropdownButton}
                onPress={() => {
                  setShowRestrictionsDropdown(!showRestrictionsDropdown);
                  setShowCaloriesDropdown(false);
                }}
              >
                <Text style={styles.dropdownButtonText}>
                  {preferences.restrictions || 'Select restrictions'}
                </Text>
                <FontAwesome5 
                  name={showRestrictionsDropdown ? 'chevron-up' : 'chevron-down'} 
                  size={16} 
                  color="#7f8c8d" 
                />
              </Pressable>
              {showRestrictionsDropdown && (
                <View style={styles.dropdownList}>
                  {DIETARY_RESTRICTIONS.map((option) => (
                    <Pressable
                      key={option}
                      style={styles.dropdownItem}
                      onPress={() => {
                        handlePreferenceChange('restrictions', option);
                        setShowRestrictionsDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{option}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Ingredients to Use */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Ingredients to Use</Text>
              <TextInput
                style={styles.input}
                value={preferences.pantryItems}
                onChangeText={(text) => handlePreferenceChange('pantryItems', text)}
                placeholder="Enter ingredients, separated by commas"
                multiline
              />
            </View>

            {/* Avoid Ingredients */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Ingredients to Avoid</Text>
              <TextInput
                style={styles.input}
                value={preferences.avoidIngredients}
                onChangeText={(text) => handlePreferenceChange('avoidIngredients', text)}
                placeholder="Enter ingredients to avoid, separated by commas"
                multiline
              />
            </View>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowGenerateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.generateButton]}
                disabled={loading}
                onPress={handleGeneratePlan}
              >
                {loading ? (
                  <Text style={styles.generateButtonText}>Generating...</Text>
                ) : (
                  <Text style={styles.generateButtonText}>Generate</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2ecc71',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  generateButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  calendarContainer: {
    flex: 1,
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  weekText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  dayButton: {
    width: 60,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  selectedDay: {
    backgroundColor: '#2ecc71',
  },
  dayText: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  mealsContainer: {
    padding: 20,
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
  mealType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  mealActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 15,
  },
  addMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#2ecc71',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  addMealText: {
    marginLeft: 8,
    color: '#2ecc71',
    fontSize: 16,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    zIndex: 1,
  },
  label: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 45,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#f1f2f6',
  },
  cancelButtonText: {
    color: '#2c3e50',
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 10,
    fontSize: 14,
  },
}); 