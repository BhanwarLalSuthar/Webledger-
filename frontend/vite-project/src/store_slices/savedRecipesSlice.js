import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://recipe-explorer-p9cp.onrender.com/recipes";

// Fetch saved recipes
export const fetchSavedRecipes = createAsyncThunk(
  "savedRecipes/fetchSavedRecipes",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(`${BASE_URL}/saved`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

// Save favorite recipe
export const saveRecipe = createAsyncThunk(
  "savedRecipes/saveRecipe",
  async (recipe, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No authentication token found");

      if (!recipe.id || isNaN(recipe.id)) {
        throw new Error("Invalid recipe ID");
      }

      const payload = { recipeId: Number(recipe.id) };
      console.log("Saving recipe with payload:", payload);
      console.log("Token:", token);

      const response = await axios.post(`${BASE_URL}/save`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Save response:", response.data);

      return { ...recipe, _id: response.data._id };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error("Save error details:", {
        status: error.response?.status,
        message: errorMsg,
        data: error.response?.data,
      });
      if (errorMsg === "Recipe already saved") {
        return rejectWithValue("This recipe is already saved!");
      }
      return rejectWithValue(errorMsg);
    }
  },
);
// Remove saved recipe
export const removeSavedRecipe = createAsyncThunk(
  "savedRecipes/removeSavedRecipe",
  async (recipeId, { rejectWithValue }) => {
    // Changed `id` to `recipeId`
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No authentication token found");

      await axios.delete(`${BASE_URL}/saved/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return recipeId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Reorder saved recipes
export const reorderSavedRecipes = createAsyncThunk(
  "savedRecipes/reorderSavedRecipes",
  async (reorderedList, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.put(
        `${BASE_URL}/saved/order`,
        { orderedRecipes: reorderedList }, // Match backend key
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
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
  reducers: {
    reorderRecipes: (state, action) => {
      state.items = action.payload;
    },
  },
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
        state.items = state.items.filter((r) => r._id !== action.payload);
      })
      .addCase(removeSavedRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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
      });
  },
});

export const { reorderRecipes } = savedRecipesSlice.actions;
export default savedRecipesSlice.reducer;
