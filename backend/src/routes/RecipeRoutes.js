const express = require("express");
const router = express.Router();
const {
  getAllRecipes,
  fetchRecipeDetail,
  searchRecipe,
  saveRecipe,
  getSavedRecipes,
  deleteSavedRecipe,
  updateRecipeOrder,
} = require("../controllers/recipeController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Specific routes first (to avoid being caught by /:id)
router.get("/saved", authMiddleware, getSavedRecipes); // Moved up
router.post("/save", authMiddleware, saveRecipe);
router.delete("/saved/:recipeId", authMiddleware, deleteSavedRecipe);
router.put("/order", authMiddleware, updateRecipeOrder);
router.get("/search", searchRecipe);

// More general routes last
router.get("/", getAllRecipes);
router.get("/:id", fetchRecipeDetail); // Must come after /saved

module.exports = router;
