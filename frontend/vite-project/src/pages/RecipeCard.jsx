import React, { useState, useEffect } from "react";
import { Heart, Users, Clock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { saveRecipe, removeSavedRecipe } from "../store_slices/savedRecipesSlice";
// import {
  
// } from "../"
const RecipeCard = ({ recipe, onClick }) => {
  const dispatch = useDispatch();
  const { items: savedRecipes, loading } = useSelector((state) => state.savedRecipes);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(savedRecipes.some((r) => r.id === recipe.id));
  }, [savedRecipes, recipe.id]);

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      if (isLiked) {
        const savedRecipe = savedRecipes.find((r) => r.id === recipe.id);
        if (savedRecipe && savedRecipe._id) {
          await dispatch(removeSavedRecipe(savedRecipe._id)).unwrap();
        }
      } else {
        await dispatch(saveRecipe(recipe)).unwrap();
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const pricePerServing = recipe.pricePerServing
    ? Number(recipe.pricePerServing).toFixed(2)
    : "N/A";

  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl relative cursor-pointer"
      onClick={() => onClick(recipe)}
    >
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-56 object-cover"
        />
        <button
          onClick={handleLike}
          disabled={loading}
          className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white transition disabled:opacity-50"
        >
          <Heart
            className={`w-6 h-6 ${
              isLiked ? "text-red-500 fill-current" : "text-gray-600"
            }`}
          />
        </button>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-xl mb-3 text-gray-800 truncate">
          {recipe.title}
        </h3>
        <div className="flex justify-between items-center text-gray-600">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-green-500" />
            <span>{recipe.servings || "N/A"} servings</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span>${pricePerServing}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;