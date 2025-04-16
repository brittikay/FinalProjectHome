import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock data - will be replaced with API data
const mockRecipes = [
  {
    id: '1',
    title: 'Veggie Stir-Fry',
    image: 'https://example.com/image1.jpg',
    prepTime: '15 mins',
    cookTime: '10 mins',
    difficulty: 'Easy',
    rating: 4.5,
    tags: ['Vegetarian', 'Quick', 'Asian'],
  },
  {
    id: '2',
    title: 'Pasta Primavera',
    image: 'https://example.com/image2.jpg',
    prepTime: '20 mins',
    cookTime: '15 mins',
    difficulty: 'Medium',
    rating: 4.2,
    tags: ['Vegetarian', 'Italian'],
  },
  {
    id: '3',
    title: 'Quinoa Bowl',
    image: 'https://example.com/image3.jpg',
    prepTime: '10 mins',
    cookTime: '20 mins',
    difficulty: 'Easy',
    rating: 4.8,
    tags: ['Vegan', 'Healthy', 'Gluten-Free'],
  },
];

const cuisines = ['Italian', 'Mexican', 'Japanese', 'Indian', 'Thai', 'Mediterranean'];
const dietaryRestrictions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'];
const difficultyLevels = ['Easy', 'Medium', 'Hard'];
const sortOptions = ['Relevance', 'Rating', 'Prep Time', 'Cook Time'];

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('Relevance');

  const toggleFilter = (
    filter: string,
    selectedFilters: string[],
    setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const clearFilters = () => {
    setSelectedCuisines([]);
    setSelectedDietary([]);
    setSelectedDifficulty([]);
    setSortBy('Relevance');
  };

  const filteredRecipes = mockRecipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = selectedCuisines.length === 0 || 
      recipe.tags.some((tag) => selectedCuisines.includes(tag));
    const matchesDietary = selectedDietary.length === 0 || 
      recipe.tags.some((tag) => selectedDietary.includes(tag));
    const matchesDifficulty = selectedDifficulty.length === 0 || 
      selectedDifficulty.includes(recipe.difficulty);
    
    return matchesSearch && matchesCuisine && matchesDietary && matchesDifficulty;
  });

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (sortBy) {
      case 'Rating':
        return b.rating - a.rating;
      case 'Prep Time':
        return parseInt(a.prepTime) - parseInt(b.prepTime);
      case 'Cook Time':
        return parseInt(a.cookTime) - parseInt(b.cookTime);
      default:
        return 0;
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search recipes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Pressable
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <FontAwesome name="filter" size={20} color="#2c3e50" />
        </Pressable>
      </View>

      <ScrollView style={styles.results}>
        {sortedRecipes.map((recipe) => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.recipeCard}
            onPress={() => router.push(`/recipe/${recipe.id}`)}
          >
            <Image
              source={{ uri: recipe.image }}
              style={styles.recipeImage}
            />
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              <View style={styles.recipeMeta}>
                <Text style={styles.metaText}>{recipe.prepTime} prep</Text>
                <Text style={styles.metaText}>{recipe.cookTime} cook</Text>
                <Text style={styles.metaText}>{recipe.difficulty}</Text>
              </View>
              <View style={styles.rating}>
                <FontAwesome name="star" size={16} color="#f1c40f" />
                <Text style={styles.ratingText}>{recipe.rating}</Text>
              </View>
              <View style={styles.tags}>
                {recipe.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <Pressable onPress={() => setShowFilters(false)}>
                <FontAwesome name="times" size={24} color="#2c3e50" />
              </Pressable>
            </View>

            <ScrollView style={styles.filters}>
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Sort By</Text>
                <View style={styles.sortOptions}>
                  {sortOptions.map((option) => (
                    <Pressable
                      key={option}
                      style={[
                        styles.sortOption,
                        sortBy === option && styles.selectedSort,
                      ]}
                      onPress={() => setSortBy(option)}
                    >
                      <Text
                        style={[
                          styles.sortOptionText,
                          sortBy === option && styles.selectedSortText,
                        ]}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Cuisine</Text>
                <View style={styles.filterOptions}>
                  {cuisines.map((cuisine) => (
                    <Pressable
                      key={cuisine}
                      style={[
                        styles.filterOption,
                        selectedCuisines.includes(cuisine) && styles.selectedFilter,
                      ]}
                      onPress={() => toggleFilter(cuisine, selectedCuisines, setSelectedCuisines)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          selectedCuisines.includes(cuisine) && styles.selectedFilterText,
                        ]}
                      >
                        {cuisine}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Dietary Restrictions</Text>
                <View style={styles.filterOptions}>
                  {dietaryRestrictions.map((restriction) => (
                    <Pressable
                      key={restriction}
                      style={[
                        styles.filterOption,
                        selectedDietary.includes(restriction) && styles.selectedFilter,
                      ]}
                      onPress={() => toggleFilter(restriction, selectedDietary, setSelectedDietary)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          selectedDietary.includes(restriction) && styles.selectedFilterText,
                        ]}
                      >
                        {restriction}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Difficulty</Text>
                <View style={styles.filterOptions}>
                  {difficultyLevels.map((level) => (
                    <Pressable
                      key={level}
                      style={[
                        styles.filterOption,
                        selectedDifficulty.includes(level) && styles.selectedFilter,
                      ]}
                      onPress={() => toggleFilter(level, selectedDifficulty, setSelectedDifficulty)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          selectedDifficulty.includes(level) && styles.selectedFilterText,
                        ]}
                      >
                        {level}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Pressable style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </Pressable>
              <Pressable
                style={styles.applyButton}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  results: {
    flex: 1,
  },
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  recipeImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  recipeInfo: {
    flex: 1,
    padding: 10,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  recipeMeta: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  metaText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginRight: 10,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingText: {
    fontSize: 14,
    color: '#f1c40f',
    marginLeft: 5,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  tag: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#2ecc71',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  filters: {
    maxHeight: 400,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 10,
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
  },
  selectedSort: {
    backgroundColor: '#2ecc71',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  selectedSortText: {
    color: '#fff',
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
  },
  selectedFilter: {
    backgroundColor: '#2ecc71',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  selectedFilterText: {
    color: '#fff',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  clearButton: {
    padding: 10,
  },
  clearButtonText: {
    color: '#e74c3c',
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 