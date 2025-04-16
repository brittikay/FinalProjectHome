import { configureStore } from '@reduxjs/toolkit';
import mealPlanningReducer from './slices/mealPlanningSlice';

export const store = configureStore({
  reducer: {
    mealPlanning: mealPlanningReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 