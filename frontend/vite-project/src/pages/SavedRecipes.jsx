import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSavedRecipes } from "../store_slices/savedRecipesSlice";
import RecipeCard from "./RecipeCard";

const SavedRecipes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    items: savedRecipes,
    loading,
    error,
  } = useSelector((state) => state.savedRecipes);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("SavedRecipes useEffect triggered");
    if (!isAuthenticated) {
      console.log("Not authenticated, redirecting to /login");
      navigate("/login");
      return;
    }
    console.log("Dispatching fetchSavedRecipes");
    dispatch(fetchSavedRecipes());
  }, [dispatch, isAuthenticated, navigate]);

  console.log("Current savedRecipes state:", savedRecipes);

  const handleRecipeClick = (recipe) => {
    console.log("Recipe clicked:", recipe);
    navigate(`/recipes/${recipe.recipeId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-pink-100 p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-purple-700 text-center mb-10">
        Your Saved Recipes
      </h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-40">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-pink-500 py-10">
          <p className="text-xl">{error}</p>
          <button
            onClick={() => dispatch(fetchSavedRecipes())}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
          >
            Retry
          </button>
        </div>
      ) : savedRecipes.length === 0 ? (
        <div className="text-center text-purple-800 py-10">
          <p className="text-xl">No saved recipes yet!</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
          >
            Explore Recipes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {savedRecipes.map((recipe, index) => {
            console.log(
              `Rendering RecipeCard for recipe at index ${index}:`,
              recipe,
            );
            return (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                onClick={() => handleRecipeClick(recipe)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;
