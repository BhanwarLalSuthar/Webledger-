import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:3030/recipes");
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch recipes",
      );
    }
  },
);

export const searchRecipe = createAsyncThunk(
  "recipes/searchRecipe",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3030/recipes/search?query=${encodeURIComponent(
          query,
        )}`,
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to search recipes",
      );
    }
  },
);

export const filterRecipe = createAsyncThunk(
  "recipes/filterRecipe",
  async (params, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(
        `http://localhost:3030/recipes?${queryString}`,
      );
      return response.data.recipes;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to filter recipes",
      );
    }
  },
);

export const fetchRecipeById = createAsyncThunk(
  "recipes/fetchRecipeById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3030/recipes/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch recipe details",
      );
    }
  },
);

const recipeSlice = createSlice({
  name: "recipes",
  initialState: {
    data: [],
    searchResults: [],
    filteredResults: [],
    currentRecipe: null, // Add this to store the single recipe
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
