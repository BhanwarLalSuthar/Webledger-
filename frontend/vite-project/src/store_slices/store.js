// store_slices/store.js
import { configureStore } from '@reduxjs/toolkit';
import recipeReducer from "./recipeSlice";
import savedRecipesReducer from './savedRecipesSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    recipes: recipeReducer,
    savedRecipes: savedRecipesReducer,
  },
});