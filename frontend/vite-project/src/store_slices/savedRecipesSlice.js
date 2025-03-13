import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:3030/recipes";

// Fetch saved recipes
export const fetchSavedRecipes = createAsyncThunk(
  "savedRecipes/fetchSavedRecipes",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(
        `${BASE_URL}/saved`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    }catch(error){
      return rejectWithValue(error.response?.data?.error || error.message)
    }
  }
);

// Save favorite recipe
export const saveRecipe = createAsyncThunk(
  "savedRecipes/saveRecipe",
  async (recipe, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.post(`${BASE_URL}/save`, recipe);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Remove saved recipe
export const removeSavedRecipe = createAsyncThunk(
  "savedRecipes/removeSavedRecipe",
  async (id, { rejectWithValue }) => {
    try {

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await axios.delete(`${BASE_URL}/${id}`,
        {
          headers: { Authorization: `Bearer ${token}`}
      }
    );
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Reorder saved recipes
export const reorderSavedRecipes = createAsyncThunk(
  "savedRecipes/reorderSavedRecipes",
  async (reorderedList, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/saved/order`, { recipes: reorderedList });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const savedRecipesSlice = createSlice({
  name: "savedRecipes",
  initialState: {
    savedRecipes: [],
    loading: false,
    items:[],
    error: null,
  },
  reducers: {
    // Optional: Local reorder before API call
    reorderRecipes: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Saved Recipes
      .addCase(fetchSavedRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.savedRecipes = action.payload ;
      })
      .addCase(fetchSavedRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Save Recipe
      .addCase(saveRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.savedRecipes.push(action.payload);
      })
      .addCase(saveRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove Recipe
      .addCase(removeSavedRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeSavedRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((r) => r._id !== action.payload);
      })
      .addCase(removeSavedRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reorder Recipes
      .addCase(reorderSavedRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reorderSavedRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(reorderSavedRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
  },
});

export const { reorderRecipes } = savedRecipesSlice.actions;
export default savedRecipesSlice.reducer;