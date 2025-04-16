import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function EditRecipeScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { recipeId } = route.params;

  const [recipe, setRecipe] = useState({
    name: '',
    description: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    ingredients: [''],
    instructions: ['']
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecipe();
  }, []);

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/recipes/${recipeId}/`);
      const data = await response.json();
      setRecipe({
        ...data,
        ingredients: data.ingredients || [''],
        instructions: data.instructions || ['']
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch recipe details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/recipes/${recipeId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      });

      if (response.ok) {
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update recipe');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save changes');
    }
  };

  const addIngredient = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const addInstruction = () => {
    setRecipe(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const updateIngredient = (index, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const updateInstruction = (index, value) => {
    const newInstructions = [...recipe.instructions];
    newInstructions[index] = value;
    setRecipe(prev => ({ ...prev, instructions: newInstructions }));
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Recipe Name</Text>
        <TextInput
          style={styles.input}
          value={recipe.name}
          onChangeText={(text) => setRecipe(prev => ({ ...prev, name: text }))}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={recipe.description}
          onChangeText={(text) => setRecipe(prev => ({ ...prev, description: text }))}
          multiline
        />

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Prep Time</Text>
            <TextInput
              style={styles.input}
              value={recipe.prepTime}
              onChangeText={(text) => setRecipe(prev => ({ ...prev, prepTime: text }))}
            />
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Cook Time</Text>
            <TextInput
              style={styles.input}
              value={recipe.cookTime}
              onChangeText={(text) => setRecipe(prev => ({ ...prev, cookTime: text }))}
            />
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Servings</Text>
            <TextInput
              style={styles.input}
              value={recipe.servings}
              onChangeText={(text) => setRecipe(prev => ({ ...prev, servings: text }))}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {recipe.ingredients.map((ingredient, index) => (
          <TextInput
            key={index}
            style={styles.input}
            value={ingredient}
            onChangeText={(text) => updateIngredient(index, text)}
            placeholder={`Ingredient ${index + 1}`}
          />
        ))}
        <Pressable style={styles.addButton} onPress={addIngredient}>
          <Text style={styles.addButtonText}>+ Add Ingredient</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        {recipe.instructions.map((instruction, index) => (
          <TextInput
            key={index}
            style={[styles.input, styles.textArea]}
            value={instruction}
            onChangeText={(text) => updateInstruction(index, text)}
            placeholder={`Step ${index + 1}`}
            multiline
          />
        ))}
        <Pressable style={styles.addButton} onPress={addInstruction}>
          <Text style={styles.addButtonText}>+ Add Step</Text>
        </Pressable>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={[styles.button, styles.saveButton]} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
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
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    padding: 20,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#2c3e50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 