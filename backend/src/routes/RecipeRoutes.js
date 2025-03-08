const express = require("express");
const { fetchRecipe, fetchRecipeDetail } = require("../controllers/recipeController");
const { saveRecipe, getSavedRecipes, updateRecipeOrder } = require("../controllers/savedrecipeController");
const { authMiddleware, roleMiddleware} = require("../middleware/authMiddleware")
const router = express.Router();

router.get("/", fetchRecipe);  // Fetch recipes from Spoonacular API
router.get("/:id", fetchRecipeDetail);  // Fetch specific recipe details
router.post("/savedRecipes",authMiddleware ,saveRecipe);  // Save a recipe
router.get("/savedRecipes",authMiddleware ,getSavedRecipes);  // Get saved recipes
router.post("/savedRecipes/order", authMiddleware, updateRecipeOrder);  

module.exports = router;
