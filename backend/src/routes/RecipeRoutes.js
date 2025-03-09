const express = require("express");
const {
    getAllRecipes, 
    getSavedRecipes, 
    updateSavedRecipesOrder,
    saveRecipe, 
    deleteSavedRecipe,
    fetchRecipeDetail
  } = require("../controllers/recipeController");
// const { saveRecipe, getSavedRecipes, updateRecipeOrder } = require("../controllers/savedrecipeController");
const { authMiddleware } = require("../middleware/authMiddleware")
const router = express.Router();

router.get("/", getAllRecipes);  // Fetch recipes from Spoonacular API
router.get("/:id", fetchRecipeDetail);  // Fetch specific recipe details
router.get("/saved", authMiddleware, getSavedRecipes);
router.delete("/saved/:recipeId", authMiddleware, deleteSavedRecipe);
router.put("/saved/order", authMiddleware, updateSavedRecipesOrder);

router.post("/save", authMiddleware, saveRecipe);

module.exports = router;
