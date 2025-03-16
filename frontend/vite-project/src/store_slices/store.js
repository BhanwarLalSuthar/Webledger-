// store_slices/store.js
import { configureStore } from '@reduxjs/toolkit';
import recipesReducer from './recipeSlice';
import savedRecipesReducer from './savedRecipesSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    recipes: recipesReducer,
    savedRecipes: savedRecipesReducer,
    auth: authReducer,
  },
});