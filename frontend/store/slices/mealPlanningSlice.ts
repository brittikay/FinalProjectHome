import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

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

interface MealPlanPreferences {
  calories: string;
  restrictions: string;
  pantryItems: string;
  avoidIngredients: string;
}

interface MealPlanningState {
  currentPlan: DayPlan[];
  loading: boolean;
  error: string | null;
  preferences: MealPlanPreferences;
}

const initialState: MealPlanningState = {
  currentPlan: [],
  loading: false,
  error: null,
  preferences: {
    calories: '2000',
    restrictions: '',
    pantryItems: '',
    avoidIngredients: '',
  },
};

// Thunks
export const generateMealPlan = createAsyncThunk(
  'mealPlanning/generate',
  async (preferences: MealPlanPreferences) => {
    const response = await axios.post('/api/meal-plan/generate', preferences);
    return response.data;
  }
);

export const swapMeal = createAsyncThunk(
  'mealPlanning/swapMeal',
  async ({ date, mealType, recipeId }: { date: string; mealType: string; recipeId: number }) => {
    const response = await axios.post('/api/meal-plan/swap', {
      date,
      mealType,
      recipeId,
    });
    return response.data;
  }
);

export const toggleFavoriteRecipe = createAsyncThunk(
  'mealPlanning/toggleFavorite',
  async (recipeId: number) => {
    const response = await axios.post(`/api/recipes/${recipeId}/toggle-favorite`);
    return response.data;
  }
);

export const fetchAlternativeRecipes = createAsyncThunk(
  'mealPlanning/fetchAlternatives',
  async ({ mealType, currentRecipeId }: { mealType: string; currentRecipeId: number }) => {
    const response = await axios.get('/api/recipes/alternatives', {
      params: { mealType, currentRecipeId },
    });
    return response.data;
  }
);

const mealPlanningSlice = createSlice({
  name: 'mealPlanning',
  initialState,
  reducers: {
    setPreferences: (state, action: PayloadAction<Partial<MealPlanPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Generate Meal Plan
    builder
      .addCase(generateMealPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateMealPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlan = action.payload;
      })
      .addCase(generateMealPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate meal plan';
      })

    // Swap Meal
    builder
      .addCase(swapMeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(swapMeal.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlan = action.payload;
      })
      .addCase(swapMeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to swap meal';
      })

    // Toggle Favorite
    builder
      .addCase(toggleFavoriteRecipe.fulfilled, (state, action) => {
        const { recipeId, isFavorite } = action.payload;
        state.currentPlan = state.currentPlan.map(day => ({
          ...day,
          meals: day.meals.map(meal => {
            if (meal.recipe.id === recipeId) {
              return {
                ...meal,
                recipe: {
                  ...meal.recipe,
                  isFavorite,
                },
              };
            }
            return meal;
          }),
        }));
      });
  },
});

export const { setPreferences, clearError } = mealPlanningSlice.actions;
export default mealPlanningSlice.reducer; 