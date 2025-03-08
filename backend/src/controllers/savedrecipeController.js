const SavedRecipe = require("../models/SavedRecipe");

const saveRecipe = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user._id

    // Find the max position for the user’s saved recipes
    const lastRecipe = await SavedRecipe.findOne({ userId }).sort("-position");
    const newPosition = lastRecipe ? lastRecipe.position + 1 : 0;

    // Check if recipe is already saved by this user
    const existingRecipe = await SavedRecipe.findOne({ userId, recipeId });

    if (existingRecipe) {
        return res.status(400).json({ message: "Recipe already saved" });
    }

    // Save the new recipe under the authenticated user
    const newRecipe = new SavedRecipe({
        userId,
        recipeId,
        position: newPosition
    });

    await newRecipe.save();
    res.status(201).json({ message: "Recipe saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving recipe" });
  }
};

const getSavedRecipes = async (req, res) => {
  const { userId } = req.user._id;
  try {
    const userId = req.user_id
    const savedRecipes = await SavedRecipe.find({ userId });
    res.json(savedRecipes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching saved recipes" });
  }
};

const updateRecipeOrder = async (req, res) => {
  try {
    const { orderedRecipes } = req.body; // Array of { recipeId, position }
    const userId = req.user._id;

    // Bulk update positions using `updateMany`
    const bulkUpdates = orderedRecipes.map(({ recipeId, position }) => ({
      updateOne: {
        filter: { userId, recipeId },
        update: { position },
      }
    }));

    await SavedRecipe.bulkWrite(bulkUpdates);

      res.json({ message: "Order updated successfully" });
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = { saveRecipe, getSavedRecipes, updateRecipeOrder };
