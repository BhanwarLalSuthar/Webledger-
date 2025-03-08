const axios = require("axios");
const dotenv = require('dotenv'); 

dotenv.config();

const fetchRecipe = async (req, res) => {
  const { search, type, cuisine, limit } = req.query; // Get filters from query params
  try {
    const API_URL = `https://api.spoonacular.com/recipes/complexSearch?query=${search || ""}&type=${type || ""}&cuisine=${cuisine || ""}&number=${limit || 10}&addRecipeInformation=true&apiKey=${process.env.SPOONACULAR_API_KEY}`;
    
    const response = await axios.get(API_URL);
    res.json(response.data.results);  // Send fetched recipes to frontend
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipe data" });
  }
};

// Fetch recipe details by ID
const fetchRecipeDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const API_URL = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=${process.env.SPOONACULAR_API_KEY}`;
    
    const response = await axios.get(API_URL);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipe details" });
  }
};

module.exports = { fetchRecipe, fetchRecipeDetail };