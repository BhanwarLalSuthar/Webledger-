import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { fetchRecipeById } from "../store_slices/recipeSlice";

const RecipeDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentRecipe, loading, error } = useSelector((state) => state.recipes);
  const [servings, setServings] = useState(null);
  const [checkedIngredients, setCheckedIngredients] = useState({});

  useEffect(() => {
    console.log("Fetching recipe for ID:", id);
    dispatch(fetchRecipeById(id));
  }, [dispatch, id, location.pathname]);

  useEffect(() => {
    if (currentRecipe) {
      console.log("Recipe loaded:", currentRecipe);
      setServings(currentRecipe.servings);
      const initialChecked = {};
      (currentRecipe.extendedIngredients || []).forEach((ingredient) => {
        initialChecked[ingredient.id] = false;
      });
      setCheckedIngredients(initialChecked);
    }
  }, [currentRecipe]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: currentRecipe.title,
          text: `Check out this recipe: ${currentRecipe.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Recipe URL copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
      alert("Failed to share recipe");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleIngredientToggle = (ingredientId) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [ingredientId]: !prev[ingredientId],
    }));
  };

  if (loading) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <div className="h-12 w-3/5 bg-gray-300 rounded mb-2"></div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
        </div>
        <div className="w-full h-60 sm:h-80 md:h-96 bg-gray-300 rounded"></div>
        <div className="flex gap-2 mt-2 flex-wrap">
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
        </div>
        <div className="mt-3 h-10 w-2/5 bg-gray-300 rounded"></div>
        <div className="mt-1 h-24 w-4/5 bg-gray-300 rounded"></div>
        <div className="mt-3 h-10 w-2/5 bg-gray-300 rounded"></div>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center gap-2 mt-1">
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
            <div className="h-5 w-full bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 px-4">
        <p className="text-pink-500 text-base sm:text-lg">⚠️ {error}</p>
        <button
          onClick={() => dispatch(fetchRecipeById(id))}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded uppercase hover:bg-red-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!currentRecipe) {
    console.log("No currentRecipe available");
    return (
      <div className="text-center mt-10 text-purple-600">
        No recipe data available
      </div>
    );
  }

  const proteinMatch = currentRecipe.summary?.match(/(\d+)g of protein/) || [];
  const fatMatch = currentRecipe.summary?.match(/(\d+)g of fat/) || [];
  const caloriesMatch = currentRecipe.summary?.match(/(\d+) calories/) || [];

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto bg-gradient-to-r from-purple-100 to-pink-100 min-h-screen">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-700 mb-2">
        {currentRecipe.title}
      </h1>
      <div className="flex items-center gap-4 mb-4 flex-wrap justify-center sm:justify-start text-purple-800">
        <div className="flex items-center">
          <img
            src="https://via.placeholder.com/40"
            alt="Author"
            className="w-10 h-10 rounded-full border-2 border-pink-500"
          />
          <p className="ml-2 text-sm">
            {currentRecipe.creditsText || "Unknown Author"}
          </p>
        </div>
        <p className="text-sm">{new Date().toLocaleDateString()}</p>
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            title="Share Recipe"
            className="text-purple-600 hover:text-pink-500 transition"
          >
            <span role="img" aria-label="share">
              🔗
            </span>
          </button>
          <button
            onClick={handlePrint}
            title="Print Recipe"
            className="text-purple-600 hover:text-pink-500 transition"
          >
            <span role="img" aria-label="print">
              🖨️
            </span>
          </button>
        </div>
      </div>
      <div className="rounded-lg shadow-lg overflow-hidden border-4 border-purple-300">
        <img
          src={currentRecipe.image}
          alt={currentRecipe.title}
          className="w-full h-60 sm:h-80 md:h-96 object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x400?text=Image+Not+Found";
          }}
        />
      </div>
      <div className="flex items-center gap-4 mt-4 flex-wrap text-purple-700">
        <div className="flex items-center gap-1">
          <span>⏱️</span>
          <p className="text-sm">{currentRecipe.readyInMinutes} MINUTES</p>
        </div>
        <div className="flex items-center gap-1">
          <span>👥</span>
          <p className="text-sm">{servings} SERVINGS</p>
        </div>
        <div className="flex items-center gap-1">
          <span>🍽️</span>
          <p className="text-sm">
            {currentRecipe.vegetarian ? "VEGETARIAN" : "NON-VEGETARIAN"}
          </p>
        </div>
      </div>
      <div
        className="mt-4 text-purple-800 leading-relaxed text-sm sm:text-base"
        dangerouslySetInnerHTML={{
          __html: currentRecipe.summary || "No summary available",
        }}
      />
      <div className="flex items-center mt-4">
        <p className="mr-2 text-purple-700 text-sm">
          Rating ({currentRecipe.aggregateLikes || 0})
        </p>
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`${
              index < Math.round((currentRecipe.spoonacularScore || 0) / 20)
                ? "text-pink-500"
                : "text-purple-300"
            } text-lg`}
          >
            ★
          </span>
        ))}
      </div>
      <hr className="my-6 border-purple-300" />
      <h2 className="text-xl sm:text-2xl font-bold text-purple-700 mb-4">
        Ingredients:
      </h2>
      <div className="flex items-center mb-4 flex-wrap gap-4 text-purple-800">
        <p className="text-sm">Adjust Servings</p>
        <div className="border border-pink-400 rounded px-2 py-1 w-16 text-center bg-white">
          {servings}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {(currentRecipe.extendedIngredients || []).map((ingredient) => (
          <div
            key={ingredient.id}
            className={`flex items-center p-2 border rounded transition-colors ${
              checkedIngredients[ingredient.id]
                ? "bg-pink-100"
                : "bg-white hover:bg-purple-50"
            } border-purple-300`}
          >
            <input
              type="checkbox"
              checked={checkedIngredients[ingredient.id] || false}
              onChange={() => handleIngredientToggle(ingredient.id)}
              className="mr-2 text-pink-500"
            />
            <p
              className={`flex-grow text-purple-800 text-sm ${
                checkedIngredients[ingredient.id] ? "line-through" : ""
              }`}
            >
              {ingredient.measures?.us?.amount && ingredient.measures?.us?.unitShort
                ? `${ingredient.measures.us.amount} ${ingredient.measures.us.unitShort} ${ingredient.nameClean}`
                : ingredient.original}
            </p>
          </div>
        ))}
      </div>
      <hr className="my-6 border-purple-300" />
      <h2 className="text-xl sm:text-2xl font-bold text-purple-700 mb-4">
        Nutritional Information
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-purple-800">
        <div className="text-center">
          <p className="text-sm">{fatMatch[1] ? `${fatMatch[1]}g` : "N/A"}</p>
          <p className="font-bold">Fat</p>
        </div>
        <div className="text-center">
          <p className="text-sm">{proteinMatch[1] ? `${proteinMatch[1]}g` : "N/A"}</p>
          <p className="font-bold">Protein</p>
        </div>
        <div className="text-center">
          <p className="text-sm">
            {currentRecipe.pricePerServing
              ? `$${currentRecipe.pricePerServing.toFixed(2)}`
              : "N/A"}
          </p>
          <p className="font-bold">Price/Serving</p>
        </div>
        <div className="text-center">
          <p className="text-sm">{caloriesMatch[1] || "N/A"}</p>
          <p className="font-bold">Calories</p>
        </div>
        <div className="text-center">
          <p className="text-sm">{currentRecipe.healthScore || "N/A"}</p>
          <p className="font-bold">Health Score</p>
        </div>
      </div>
      <hr className="my-6 border-purple-300" />
      <h2 className="text-xl sm:text-2xl font-bold text-purple-700 mb-4">
        Directions
      </h2>
      {(currentRecipe.analyzedInstructions?.[0]?.steps || []).map((step, index) => (
        <div key={index} className="mb-6">
          <div className="flex items-start gap-4">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              {step.number}
            </div>
            <p className="text-purple-800 text-sm sm:text-base">{step.step}</p>
          </div>
          {step.equipment?.length > 0 && (
            <div className="mt-2">
              <p className="text-purple-700 text-sm mb-1">Equipment Needed:</p>
              <div className="flex gap-4 flex-wrap">
                {step.equipment.map((equip, equipIndex) => (
                  <div key={equipIndex} className="text-center max-w-[100px]">
                    <img
                      src={
                        equip.image ||
                        "https://via.placeholder.com/100x100?text=Image+Not+Found"
                      }
                      alt={equip.name}
                      className="w-full h-auto object-cover rounded border-2 border-purple-300"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/100x100?text=Image+Not+Found";
                      }}
                    />
                    <p className="text-purple-800 text-xs mt-1 block">{equip.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
      <hr className="my-6 border-purple-300" />
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-purple-700 mb-1">
          Dietary Information
        </h3>
        <p className="text-purple-800 text-xs sm:text-sm">
          {currentRecipe.diets?.length > 0
            ? currentRecipe.diets.join(", ")
            : "No specific diet information available"}
        </p>
        <p className="text-purple-800 text-xs sm:text-sm mt-1">
          Vegetarian: {currentRecipe.vegetarian ? "Yes" : "No"}
          <br />
          Vegan: {currentRecipe.vegan ? "Yes" : "No"}
          <br />
          Gluten Free: {currentRecipe.glutenFree ? "Yes" : "No"}
          <br />
          Dairy Free: {currentRecipe.dairyFree ? "Yes" : "No"}
        </p>
      </div>
      <div className="flex gap-4 mt-6 justify-center sm:justify-start">
        <button
          onClick={handlePrint}
          className="bg-red-500 text-white px-4 py-2 rounded uppercase hover:bg-red-600 transition"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default RecipeDetail;