const axios = require("axios");
const User = require("../models/User");

exports.getAllRecipes = async (req, res) => {
  const { limit = 50, type, cuisine } = req.query;
  try {
    const url = `https://api.spoonacular.com/recipes/random?apiKey=${
      process.env.SPOONACULAR_API_KEY
    }&number=${limit}`;
    const response = await axios.get(url);
    // console.log(response.data)
    res.json({ recipes: response.data });
  } catch (error) {
    console.error(
      "Spoonacular API Error:",
      error.response?.data || error.message,
    );
    res.status(500).json({ error: "Failed to fetch recipes from Spoonacular" });
  }
};

exports.fetchRecipeDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.SPOONACULAR_API_KEY}`,
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipe details" });
  }
};

exports.getSavedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedRecipes");
    res.json(user.savedRecipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch saved recipes" });
  }
};

exports.saveRecipe = async (req, res) => {
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
    res.status(500).json({ error: "Failed to save recipe" });
  }
};

exports.deleteSavedRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const user = await User.findById(req.user.id);
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
    res.status(500).json({ error: "Failed to remove recipe" });
  }
};

exports.updateSavedRecipesOrder = async (req, res) => {
  try {
    const { order } = req.body;
    const user = await User.findById(req.user.id);
    user.savedRecipes = order;
    await user.save();
    res.json({ message: "Order updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update order" });
  }
};

exports.searchRecipe = async (req, res) => {
  try {
    console.log("Received query:", req.query.query) ;
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }
    

    const data = await fetchFromSpoonacular(
      `${SPOONACULAR_API_BASE}/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY}&query=${
        encodeURIComponent(query)
      }`,
    );
    res.status(200).json(data);
  } catch (error) {
    console.error("Error searching recipes:", error.message);
    res
      .status(400)
      .json({ error: error.message || "Failed to search recipes" });
  }
};
