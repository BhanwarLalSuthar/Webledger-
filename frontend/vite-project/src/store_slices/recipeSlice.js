import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all recipes
export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://recipe-explorer-p9cp.onrender.com/recipes");
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch recipes"
      );
    }
  }
);

// Search recipes by query
export const searchRecipe = createAsyncThunk(
  "recipes/searchRecipe",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://recipe-explorer-p9cp.onrender.com/recipes/search?query=${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to search recipes"
      );
    }
  }
);

// Filter recipes by parameters
export const filterRecipe = createAsyncThunk(
  "recipes/filterRecipe",
  async (params, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(
        `https://recipe-explorer-p9cp.onrender.com/recipes?${queryString}`
      );
      return response.data.recipes;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to filter recipes"
      );
    }
  }
);

// Fetch a single recipe by ID
export const fetchRecipeById = createAsyncThunk(
  "recipes/fetchRecipeById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://recipe-explorer-p9cp.onrender.com/recipes/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch recipe details"
      );
    }
  }
);

const recipeSlice = createSlice({
  name: "recipes",
  initialState: {
    data: [], // All recipes
    searchResults: [], // Search results
    filteredResults: [], // Filtered results
    currentRecipe: null, // Single recipe for detail page
    loading: false, // Loading state
    error: null, // Error state
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all recipes
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search recipes
      .addCase(searchRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Filter recipes
      .addCase(filterRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredResults = action.payload;
      })
      .addCase(filterRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch recipe by ID
      .addCase(fetchRecipeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecipe = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default recipeSlice.reducer;