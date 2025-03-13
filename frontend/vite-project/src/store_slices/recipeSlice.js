import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async (_, { rejectWithValue, getState }) => {
    const { auth } = getState();
    try {
      const response = await axios.get("https://recipe-explorer-p9cp.onrender.com/recipes/", {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch recipes");
    }
  }
);

export const fetchRecipeById = createAsyncThunk(
  "recipes/fetchRecipeById",
  async (id, { rejectWithValue, getState }) => {
    const { auth } = getState();
    try {
      const response = await axios.get(`https://recipe-explorer-p9cp.onrender.com/recipes/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch recipe details");
    }
  }
);

export const searchRecipe = createAsyncThunk(
  "recipes/searchRecipe",
  async (query, { rejectWithValue, getState }) => {
    const { auth } = getState();
    try {
      const url = new URL("https://recipe-explorer-p9cp.onrender.com/recipes/search");
      url.searchParams.append("query", query);
      const response = await axios.get(url.toString(), {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to search recipe");
    }
  }
);

export const filterRecipe = createAsyncThunk(
  "recipes/filterRecipe",
  async (filterParams, { rejectWithValue, getState }) => {
    const { auth } = getState();
    try {
      const query = new URLSearchParams(filterParams).toString();
      const response = await axios.get(`https://recipe-explorer-p9cp.onrender.com/recipes/search?${query}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to filter recipe");
    }
  }
);

const recipesSlice = createSlice({
  name: "recipes",
  initialState: {
    data: [],
    status: "idle",
    error: null,
    recipeDetail: null,
    detailStatus: "idle",
    filteredResults: [],
    searchResults: [],
    detailError: null,
    loading: false,
  },
  reducers: {
    resetRecipeDetail: (state) => {
      state.recipeDetail = null;
      state.detailStatus = "idle";
      state.detailError = null;
    },
    toggleFavorite: (state, action) => {
      const { id, isFavorite } = action.payload;
      const recipe = state.data.find((r) => r.id === id);
      if (recipe) {
        recipe.isFavorite = !isFavorite;
      }
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(fetchRecipes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchRecipeById.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.recipeDetail = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload;
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
      });
  },
});

export const { resetRecipeDetail, toggleFavorite } = recipesSlice.actions;
export default recipesSlice.reducer;