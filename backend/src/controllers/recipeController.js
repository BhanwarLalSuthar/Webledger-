const axios = require("axios");
const SavedRecipe = require("../models/SavedRecipe");
require("dotenv").config();

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

if (!SPOONACULAR_API_KEY) {
  console.error("SPOONACULAR_API_KEY is not defined in environment variables");
  process.exit(1);
}

const getAllRecipes = async (req, res) => {
  const { limit = 50 } = req.query;
  try {
    const url = `https://api.spoonacular.com/recipes/random?apiKey=${SPOONACULAR_API_KEY}&number=${limit}`;
    const response = await axios.get(url);
    res.json({ recipes: response.data.recipes });
  } catch (error) {
    console.error(
      "Spoonacular API Error in getAllRecipes:",
      error.response?.data || error.message,
    );
    res.status(500).json({ error: "Failed to fetch recipes from Spoonacular" });
  }
};

const fetchRecipeDetail = async (req, res) => {
  const { id } = req.params;
  try {
    console.log(`Fetching details for recipe ID: ${id}`);
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`,
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching recipe details:",
      error.message,
      error.response?.data,
    );
    res.status(500).json({ error: "Failed to fetch recipe details" });
  }
};

const searchRecipe = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&query=${encodeURIComponent(
        query,
      )}`,
    );
    res.status(200).json(response.data.results);
  } catch (error) {
    console.error("Error searching recipes:", error.message);
    res
      .status(400)
      .json({ error: error.message || "Failed to search recipes" });
  }
};

const saveRecipe = async (req, res) => {
  try {
    const { recipeId, title, image, vegan, readyInMinutes } = req.body;
    const userId = req.user.id;

    if (
      !recipeId ||
      !title ||
      !image ||
      typeof vegan !== "boolean" ||
      !readyInMinutes
    ) {
      return res
        .status(400)
        .json({ message: "All recipe fields are required" });
    }

    const lastRecipe = await SavedRecipe.findOne({ userId }).sort("-position");
    const newPosition = lastRecipe ? lastRecipe.position + 1 : 0;

    const existingRecipe = await SavedRecipe.findOne({ userId, recipeId });
    if (existingRecipe) {
      return res.status(400).json({ message: "Recipe already saved" });
    }

    const newRecipe = new SavedRecipe({
      userId,
      recipeId,
      position: newPosition,
    });
    await newRecipe.save();

    res.status(201).json({
      _id: newRecipe._id,
      recipeId,
      title,
      image,
      vegan,
      readyInMinutes,
      position: newRecipe.position,
    });
  } catch (error) {
    console.error("Error in saveRecipe:", error.message, error.stack);
    res
      .status(500)
      .json({ message: "Error saving recipe", details: error.message });
  }
};

const getSavedRecipes = async (req, res) => {
  console.log("Entering getSavedRecipes");
  try {
    if (!req.user || !req.user.id) {
      console.error("No user ID found in request. Authentication failed.");
      return res.status(401).json({ message: "Unauthorized: No user ID" });
    }

    const userId = req.user.id;
    console.log(`Fetching saved recipes for user: ${userId}`);

    const savedRecipes = await SavedRecipe.find({ userId }).sort("position");
    console.log(
      `Found ${savedRecipes.length} saved recipes for user: ${userId}`,
    );

    if (!savedRecipes.length) {
      console.log("No saved recipes found for user:", userId);
      return res.json([]);
    }

    console.log(
      "Saved recipe IDs:",
      savedRecipes.map((r) => r.recipeId),
    );

    const recipePromises = savedRecipes.map(async (saved) => {
      console.log(`Fetching Spoonacular data for recipe ID: ${saved.recipeId}`);
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/${saved.recipeId}/information?apiKey=${SPOONACULAR_API_KEY}`,
        );
        console.log(
          `Successfully fetched data for recipe ID: ${saved.recipeId}`,
        );
        return {
          _id: saved._id,
          recipeId: saved.recipeId,
          title: response.data.title,
          image: response.data.image,
          vegan: response.data.vegan,
          readyInMinutes: response.data.readyInMinutes,
          position: saved.position,
        };
      } catch (error) {
        console.error(
          `Failed to fetch details for recipe ID ${saved.recipeId}:`,
          error.message,
          error.response?.status,
          error.response?.data,
        );
        return {
          _id: saved._id,
          recipeId: saved.recipeId,
          title: "Recipe Details Unavailable",
          image: null,
          vegan: false,
          readyInMinutes: 0,
          position: saved.position,
          error:
            error.response?.status === 404
              ? "Recipe not found in Spoonacular"
              : `Error fetching details: ${error.message}`,
        };
      }
    });

    console.log("Awaiting all recipe promises...");
    const fullRecipes = await Promise.all(recipePromises);
    console.log("Returning saved recipes:", fullRecipes);
    res.json(fullRecipes);
  } catch (error) {
    console.error(
      "Critical error in getSavedRecipes:",
      error.message,
      error.stack,
    );
    res.status(500).json({
      message: "Error fetching saved recipes",
      details: error.message,
    });
  }
};

const deleteSavedRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.user.id;

    const deleted = await SavedRecipe.findOneAndDelete({
      userId,
      _id: recipeId,
    });
    if (!deleted) {
      return res.status(404).json({ message: "Saved recipe not found" });
    }

    res.json({ message: "Recipe removed successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error.message);
    res.status(500).json({ message: "Error deleting saved recipe" });
  }
};

const updateRecipeOrder = async (req, res) => {
  try {
    const { orderedRecipes } = req.body;
    const userId = req.user.id;

    const bulkUpdates = orderedRecipes.map(({ recipeId, position }) => ({
      updateOne: {
        filter: { userId, recipeId },
        update: { position },
      },
    }));

    await SavedRecipe.bulkWrite(bulkUpdates);
    res.json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Error updating recipe order:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllRecipes,
  fetchRecipeDetail,
  searchRecipe,
  saveRecipe,
  getSavedRecipes,
  deleteSavedRecipe,
  updateRecipeOrder,
};
