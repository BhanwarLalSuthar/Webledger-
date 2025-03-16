import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSavedRecipes = createAsyncThunk(
  "savedRecipes/fetchSavedRecipes",
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.token) {
      return rejectWithValue("No authentication token available");
    }
    try {
      console.log("Fetching saved recipes with token:", auth.token);
      const response = await axios.get("http://localhost:3030/recipes/saved", {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      console.log("Saved recipes response:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching saved recipes:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch saved recipes",
      );
    }
  },
);

export const saveRecipe = createAsyncThunk(
  "savedRecipes/saveRecipe",
  async (recipe, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      console.log("Saving recipe with payload:", recipe);
      console.log("Token:", auth.token);

      const payload = {
        recipeId: recipe.id,
        title: recipe.title,
        image: recipe.image,
        vegan: recipe.vegan || false,
        readyInMinutes: recipe.readyInMinutes,
      };

      const response = await axios.post(
        "http://localhost:3030/recipes/save",
        payload,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        },
      );
      return response.data;
    } catch (error) {
      console.log("Save error details:", {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const removeSavedRecipe = createAsyncThunk(
  "savedRecipes/removeSavedRecipe",
  async (recipeId, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const response = await axios.delete(
        `http://localhost:3030/recipes/saved/${recipeId}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        },
      );
      return { _id: recipeId, message: response.data.message };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove saved recipe",
      );
    }
  },
);

const savedRecipesSlice = createSlice({
  name: "savedRecipes",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSavedRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(saveRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeSavedRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeSavedRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (recipe) => recipe._id !== action.payload._id,
        );
      })
      .addCase(removeSavedRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default savedRecipesSlice.reducer;
