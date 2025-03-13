const SavedRecipe = require("../models/SavedRecipe");
const axios = require("axios"); // For fetching recipe details from Spoonacular

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY; // Add to .env

const saveRecipe = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user._id;

    if (!recipeId) {
      return res.status(400).json({ message: "recipeId is required" });
    }

    // Find the max position for the user’s saved recipes
    const lastRecipe = await SavedRecipe.findOne({ userId }).sort("-position");
    const newPosition = lastRecipe ? lastRecipe.position + 1 : 0;

    // Check if recipe is already saved by this user
    const existingRecipe = await SavedRecipe.findOne({ userId, recipeId });
    if (existingRecipe) {
      return res.status(400).json({ message: "Recipe already saved" });
    }

    // Save the new recipe
    const newRecipe = new SavedRecipe({
      userId,
      recipeId,
      position: newPosition,
    });
    await newRecipe.save();

    // Fetch recipe details from Spoonacular (or your recipe source)
    const recipeResponse = await axios.get(
      `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}`,
    );
    const recipeDetails = recipeResponse.data;

    res.status(201).json({
      _id: newRecipe._id,
      recipeId,
      ...recipeDetails, // Include full recipe details
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving recipe" });
  }
};

const getSavedRecipes = async (req, res) => {
  try {
    const userId = req.user._id; // Fixed syntax: req.user._id, not req.user_id
    const savedRecipes = await SavedRecipe.find({ userId }).sort("position");

    // Fetch full recipe details for each saved recipe
    const recipePromises = savedRecipes.map(async (saved) => {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${saved.recipeId}/information?apiKey=${SPOONACULAR_API_KEY}`,
      );
      return {
        _id: saved._id,
        recipeId: saved.recipeId,
        position: saved.position,
        ...response.data,
      };
    });

    const fullRecipes = await Promise.all(recipePromises);
    res.json(fullRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching saved recipes" });
  }
};

const deleteSavedRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.user._id;

    const deleted = await SavedRecipe.findOneAndDelete({ userId, recipeId });
    if (!deleted) {
      return res.status(404).json({ message: "Saved recipe not found" });
    }

    res.json({ message: "Recipe removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting saved recipe" });
  }
};

const updateRecipeOrder = async (req, res) => {
  try {
    const { orderedRecipes } = req.body; // Array of { recipeId, position }
    const userId = req.user._id;

    // Bulk update positions
    const bulkUpdates = orderedRecipes.map(({ recipeId, position }) => ({
      updateOne: {
        filter: { userId, recipeId },
        update: { position },
      },
    }));

    await SavedRecipe.bulkWrite(bulkUpdates);
    res.json({ message: "Order updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Export missing controllers (placeholders if not implemented)
const getAllRecipes = async (req, res) => {
  // Fetch from Spoonacular or your source
  res.send({ recipes: { recipes: [] } }); // Placeholder
};

const fetchRecipeDetail = async (req, res) => {
  // Fetch from Spoonacular or your source
  res.send({}); // Placeholder
};

const searchRecipe = async (req, res) => {
  // Implement search logic
  res.send([]); // Placeholder
};

module.exports = {
  saveRecipe,
  getSavedRecipes,
  updateRecipeOrder: updateRecipeOrder,
  deleteSavedRecipe,
  getAllRecipes,
  fetchRecipeDetail,
  searchRecipe,
};
