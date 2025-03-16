import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Search, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSavedRecipes } from "../store_slices/savedRecipesSlice";
import {
  fetchRecipes,
  filterRecipe,
  searchRecipe,
} from "../store_slices/recipeSlice";
import RecipeCard from "./RecipeCard";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated = false } = useSelector((state) => state.auth || {});
  const { data, searchResults, filteredResults, loading, error } = useSelector(
    (state) => state.recipes,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedLimit, setSelectedLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;
  const cuisines = [
    "All",
    "Italian",
    "Indian",
    "Mexican",
    "Chinese",
    "French",
    "Japanese",
  ];
  const categories = [
    "All",
    "Main Course",
    "Appetizer",
    "Bread",
    "Sauce",
    "Dessert",
    "Snack",
  ];
  const limits = [10, 20, 50];

  useEffect(() => {
    console.log("Fetching recipes...");
    dispatch(fetchRecipes()).then((response) => {
      console.log("Recipes fetched:", response.payload);
    });
    if (isAuthenticated) {
      dispatch(fetchSavedRecipes()).then((response) => {
        console.log("Saved recipes fetched:", response.payload);
      });
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        dispatch(searchRecipe(searchQuery)).then((response) => {
          console.log("Search results:", response.payload);
        });
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, dispatch]);

  const handleFilter = () => {
    const filterParams = {};
    if (selectedCuisine !== "All") filterParams.cuisine = selectedCuisine;
    if (selectedCategory !== "All") filterParams.type = selectedCategory; // Adjusted to match Spoonacular API
    if (selectedLimit) filterParams.limit = selectedLimit;

    dispatch(filterRecipe(filterParams)).then((response) => {
      console.log("Filtered results:", response.payload);
    });
  };

  const handleRecipeClick = (recipe) => {
    navigate(`/recipes/${recipe.id}`);
  };

  const recipesToDisplay = (
    Array.isArray(filteredResults) && filteredResults.length > 0
      ? filteredResults
      : Array.isArray(searchResults) && searchResults.length > 0
      ? searchResults
      : Array.isArray(data?.recipes)
      ? data.recipes
      : []
  ).filter((recipe) => recipe && recipe.id); // Filter out undefined or missing ID
  const totalRecipes = recipesToDisplay.length;
  const totalPages = Math.ceil(totalRecipes / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRecipes = recipesToDisplay.slice(startIndex, endIndex);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  console.log("Recipes to display:", recipesToDisplay);
  console.log("Paginated recipes:", paginatedRecipes);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#D7DBE0] text-black py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">Culinary Adventures Await</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Explore a world of flavors, from quick meals to gourmet experiences
        </p>
        <div className="flex max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search for recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-7 py-3 rounded-l-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#EEEEEE]"
          />
          <button className="bg-[#734060] text-white px-7 rounded-r-full hover:bg-[#865B75] transition">
            Search
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 flex flex-wrap justify-center gap-4">
        <select
          className="px-4 py-2 rounded-full border"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          className="px-4 py-2 rounded-full border"
          value={selectedCuisine}
          onChange={(e) => setSelectedCuisine(e.target.value)}
        >
          {cuisines.map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>
        <select
          className="px-4 py-2 rounded-full border"
          value={selectedLimit}
          onChange={(e) => setSelectedLimit(e.target.value)}
        >
          {limits.map((num) => (
            <option key={num} value={num}>
              {num} recipes
            </option>
          ))}
        </select>
        <button
          onClick={handleFilter}
          className="px-4 py-2 bg-blue-500 text-white rounded-full"
        >
          Apply Filters
        </button>
      </div>

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
          Featured Recipes
        </h2>
        {loading ? (
          <div className="flex justify-center items-center min-h-40">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">
            <p className="text-xl">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        ) : recipesToDisplay.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <Search className="w-16 h-16 mx-auto mb-4 text-blue-500" />
            <p className="text-xl">No recipes found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {paginatedRecipes.map((recipe, index) => (
                <RecipeCard
                  key={recipe.id || index}
                  recipe={recipe}
                  onClick={() => handleRecipeClick(recipe)}
                />
              ))}
            </div>

            <div className="flex justify-center items-center mt-8 space-x-4">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-full ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-full ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
