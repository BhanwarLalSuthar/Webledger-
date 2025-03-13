import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:3030/recipes/",
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch recipes");
    }
  },
);

export const fetchRecipeById = createAsyncThunk(
  "recipes/fetchRecipeById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3030/recipes/${id}`,
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch recipe details",
      );
    }
  },
);

export const searchRecipe = createAsyncThunk(
  'recipe/searchRecipe',
  async (query) => {
    const url = new URL("http://localhost:3030/recipes/search");
    url.searchParams.append("query", query);

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to search recipe');
    return response.json();
  }
);

export const filterRecipe = createAsyncThunk(
  'recipe/filterRecipe',
  async (filterParams) => {
    const query = new URLSearchParams(filterParams).toString();
    const response = await fetch(`http://localhost:3030/recipes/search?${query}`);
    if (!response.ok) throw new Error('Failed to filter recipe');
    return response.json();
  }
);


const recipesSlice = createSlice({
  name: "recipe",
  initialState: {
    data: [], // List of recipes
    status: "idle", // Status for fetchRecipes
    error: null, // Error for fetchRecipes
    recipeDetail: null, // Single recipe details
    detailStatus: "idle", // Status for fetchRecipeById
    filteredResults: [],
    searchResults: [], 
    detailError: null, // Error for fetchRecipeById
  },
  reducers: {
    resetRecipeDetail: (state) => {
      state.recipeDetail = null;
      state.detailStatus = "idle";
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
    // Handle searchRecipe
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
        state.error = action.error.message;
      })
    // Handle fetchRecipes
      .addCase(fetchRecipes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handle fetchRecipeById
      .addCase(fetchRecipeById.pending, (state) => {
        state.detailStatus = "loading";
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.recipeDetail = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload;
      })
      // Handle filterRecipe
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
        state.error = action.error.message;
      })
  },
});

export const { resetRecipeDetail } = recipesSlice.actions;
export default recipesSlice.reducer;