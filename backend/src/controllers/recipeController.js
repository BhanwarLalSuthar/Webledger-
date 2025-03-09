const axios = require("axios");
const dotenv = require('dotenv'); 
const User = require("../models/User");

dotenv.config();
const SPOONACULAR_API_BASE = "https://api.spoonacular.com/recipes";

const API_KEYS = [
  process.env.SPOONACULAR_API_KEY_1,
  process.env.SPOONACULAR_API_KEY_2,
  process.env.SPOONACULAR_API_KEY_3,
].filter(Boolean);


const fetchFromSpoonacular = async (url) => {
  for (const apiKey of API_KEYS){
    try {
      const separator = url.includes("?") ? "&" : "?";
      const completeURL = `${url}${separator}apiKey=${apiKey}`;

      const res = await axios.get(completeURL)

      return res.data
    } catch (error) {
      console.error(`API key ${apiKey} failed:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (error.response?.status === 402 || error.response?.status === 429) {
        continue;
      }
      throw error;
    }
  }
  throw new Error("All API keys exhausted or failed");
  const { search, type, cuisine, limit } = req.query; // Get filters from query params
  // try {
  //   const API_URL = `https://api.spoonacular.com/recipes/complexSearch?query=${search || ""}&type=${type || ""}&cuisine=${cuisine || ""}&number=${limit || 10}&addRecipeInformation=true&apiKey=${process.env.SPOONACULAR_API_KEY}`;
    
  //   const response = await axios.get(API_URL);
  //   res.json(response.data.results);  // Send fetched recipes to frontend
  // } catch (error) {
  //   res.status(500).json({ message: "Error fetching recipe data" });
  // }
};

// Fetch recipe details by ID
const getAllRecipes = async (req, res) => {
  try {
    const data = await fetchFromSpoonacular(
      `${SPOONACULAR_API_BASE}/random?number=${limit || 10}`,
    );
    console.log(
      "Random recipe IDs:",
      data.recipes.map((r) => r.id),
    );
    res.status(200).json(data.recipes);
  } catch (error) {
    console.error("Error fetching random recipes:", error.message);
    res.status(500).json({ error: "Failed to fetch recipes from Spoonacular" });
  }
};

const fetchRecipeDetail = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      console.log("Invalid ID received:", id);
      return res.status(400).json({ error: "Valid recipe ID is required" });
    }
    const API_URL = `${SPOONACULAR_API_BASE}/${id}/information`;
    const data = await fetchRecipe(API_URL);
  
    res.json(data);
  } catch (error) {
    console.error("Error in getRecipeById:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    if (error.response?.status === 404) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(500).json({ error: "Failed to fetch recipe details" });
  }
};

const getSavedRecipes = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const user = await User.findById(userId).populate("savedRecipes");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.savedRecipes || []);
  } catch (error) {
    console.error("Error in getSavedRecipes:", error.stack);
    res
      .status(500)
      .json({ error: "Failed to fetch saved recipes", details: error.message });
  }
};

const updateSavedRecipesOrder = async (req, res) => {
  try {
    const { recipeIds } = req.body;
    if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
      return res.status(400).json({ error: "Invalid recipe IDs" });
    }

    const userId = req.user.id || req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const user = await User.findById(userId).populate("savedRecipes");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentRecipeIds = user.savedRecipes.map((recipe) =>
      recipe._id.toString(),
    );
    if (!recipeIds.every((id) => currentRecipeIds.includes(id))) {
      return res.status(400).json({
        error: "One or more recipe IDs are invalid or not owned by user",
      });
    }

    user.savedRecipes = recipeIds.map((id) => new mongoose.Types.ObjectId(id));
    await user.save();

    const updatedUser = await User.findById(userId).populate("savedRecipes");
    res.status(200).json(updatedUser.savedRecipes);
  } catch (error) {
    console.error("Error updating recipe order:", error.stack);
    res
      .status(500)
      .json({ error: "Failed to update recipe order", details: error.message });
  }
};

const saveRecipe = async (req, res) => {
  try {
    const { recipeId, title, image, vegan, readyInMinutes } = req.body;
    if (
      !recipeId ||
      !title ||
      !image ||
      typeof vegan !== "boolean" ||
      !readyInMinutes
    ) {
      return res.status(400).json({ error: "All recipe fields are required" });
    }

    const user = await User.findById(req.user?.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const existingRecipe = await Recipe.findOne({
      recipeId,
      user: req.user.id,
    });
    if (existingRecipe) {
      return res.status(400).json({ error: "Recipe already saved" });
    }

    const newRecipe = new Recipe({
      recipeId,
      title,
      image,
      vegan,
      readyInMinutes,
      user: req.user.id,
    });
    await newRecipe.save();

    user.savedRecipes.push(newRecipe._id);
    await user.save();

    res.status(201).json({ message: "Recipe saved!", recipe: newRecipe });
  } catch (error) {
    console.error("Error saving recipe:", error.stack);
    res.status(400).json({ error: error.message || "Failed to save recipe" });
  }
};

const deleteSavedRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ error: "Invalid recipe ID format" });
    }

    const userId = req.user.id || req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const recipeIndex = user.savedRecipes.findIndex(
      (id) => id.toString() === recipeId,
    );
    if (recipeIndex === -1) {
      return res
        .status(404)
        .json({ error: "Recipe not found in user's saved recipes" });
    }

    user.savedRecipes.splice(recipeIndex, 1);
    await user.save();

    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
    if (!deletedRecipe) {
      return res.status(404).json({ error: "Recipe not found in database" });
    }

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting saved recipe:", error.stack);
    res
      .status(500)
      .json({ error: "Failed to delete recipe", details: error.message });
  }
};
module.exports = {
  getAllRecipes, 
  getSavedRecipes, 
  updateSavedRecipesOrder,
  saveRecipe, 
  deleteSavedRecipe,
  fetchRecipeDetail
}