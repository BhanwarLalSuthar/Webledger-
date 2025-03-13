import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipeDetail, toggleFavorite, fetchRecipes } from "../store_slices/recipeSlice";
// import { saveRecipe } from "../store_slices/savedRecipesSlice";
import { useEffect } from "react";
import {
    Heart,
    Clock,
    ChefHat,
    Search,
    Flame,
    Star,
    Users,
    BookOpen,
    ChevronDown,
  } from "lucide-react";
const RecipeList = () => {
    const dispatch = useDispatch();
    const { items } = useSelector(state => state.recipes);

    useEffect(() => {
        dispatch(fetchRecipes());
    }, [dispatch]);

    const handleFavorite = (id, isFavorite) => {
            dispatch(toggleFavorite({ id, isFavorite }));
        };
    return (
        <div className="grid grid-cols-3 gap-4">
        {items.map((recipe) => (
            <div key={recipe._id} className="p-4 border rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{recipe.name}</h3>
            <h3>{recipe.title}</h3>
            <p className="text-gray-600">{recipe.description}</p>
            <button
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
                onClick={() => dispatch(fetchRecipeDetail(recipe.id))}
            >
                View Details
            </button>
            <Heart 
                onClick={() => handleFavorite(recipe._id, recipe.isFavorite)}
                className={`cursor-pointer ${recipe.isFavorite ? 'text-red-500' : 'text-gray-400'}`}
            />
            </div>
        ))}
        </div>
    );
};

export default RecipeList;
