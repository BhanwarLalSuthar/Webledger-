import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { fetchRecipeById } from "../features/recipesSlice";

const RecipeDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const { recipeDetail, detailStatus, detailError } = useSelector(
    (state) => state.recipes
  );
  const [servings, setServings] = useState(null);
  const [checkedIngredients, setCheckedIngredients] = useState({});

  useEffect(() => {
    dispatch(fetchRecipeById(id));
  }, [dispatch, id, location.pathname]);

  useEffect(() => {
    if (recipeDetail) {
      setServings(recipeDetail.servings);
      const initialChecked = {};
      recipeDetail.extendedIngredients.forEach((ingredient) => {
        initialChecked[ingredient.id] = false;
      });
      setCheckedIngredients(initialChecked);
    }
  }, [recipeDetail]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: recipeDetail.title,
          text: `Check out this recipe: ${recipeDetail.title}`,
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

  if (detailStatus === "loading") {
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

  if (detailStatus === "failed") {
    return (
      <div className="text-center mt-10 px-4">
        <p className="text-red-500 text-base sm:text-lg">
          ⚠️ {detailError}
        </p>
        <button
          onClick={() => dispatch(fetchRecipeById(id))}
          className="mt-4 bg-red-400 text-white px-4 py-2 rounded uppercase"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!recipeDetail) return null;

  const proteinMatch = recipeDetail.summary.match(/(\d+)g of protein/);
  const fatMatch = recipeDetail.summary.match(/(\d+)g of fat/);
  const caloriesMatch = recipeDetail.summary.match(/(\d+) calories/);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
        {recipeDetail.title}
      </h1>

      {/* Author, Date, Share & Print */}
      <div className="flex items-center gap-4 mb-4 flex-wrap justify-center sm:justify-start">
        <div className="flex items-center">
          <img
            src="https://via.placeholder.com/40"
            alt="Author"
            className="w-10 h-10 rounded-full"
          />
          <p className="ml-2 text-gray-600 text-sm">
            {recipeDetail.creditsText || "Unknown Author"}
          </p>
        </div>
        <p className="text-gray-600 text-sm">
          {new Date().toLocaleDateString()}
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            title="Share Recipe"
            className="text-gray-600 hover:text-red-400"
          >
            {/* Using emoji as icon replacement */}
            <span role="img" aria-label="share">
              🔗
            </span>
          </button>
          <button
            onClick={handlePrint}
            title="Print Recipe"
            className="text-gray-600 hover:text-red-400"
          >
            <span role="img" aria-label="print">
              🖨️
            </span>
          </button>
        </div>
      </div>

      {/* Recipe Image */}
      <div className="rounded shadow-lg overflow-hidden">
        <img
          src={recipeDetail.image}
          alt={recipeDetail.title}
          className="w-full h-60 sm:h-80 md:h-96 object-cover"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x400?text=Image+Not+Found";
          }}
        />
      </div>

      {/* Info Row */}
      <div className="flex items-center gap-4 mt-4 flex-wrap">
        <div className="flex items-center gap-1">
          <span className="text-gray-600">⏱️</span>
          <p className="text-gray-600 text-sm">
            {recipeDetail.readyInMinutes} MINUTES
          </p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-600">👥</span>
          <p className="text-gray-600 text-sm">
            {servings} SERVINGS
          </p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-600">🍽️</span>
          <p className="text-gray-600 text-sm">
            {recipeDetail.vegetarian ? "VEGETARIAN" : "NON-VEGETARIAN"}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div
        className="mt-4 text-gray-600 leading-relaxed text-sm sm:text-base"
        dangerouslySetInnerHTML={{ __html: recipeDetail.summary }}
      />

      {/* Rating */}
      <div className="flex items-center mt-4">
        <p className="mr-2 text-gray-600 text-sm">
          Rating ({recipeDetail.aggregateLikes || 0})
        </p>
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`${
              index < Math.round(recipeDetail.spoonacularScore / 20)
                ? "text-red-400"
                : "text-gray-300"
            } text-lg`}
          >
            ★
          </span>
        ))}
      </div>

      <hr className="my-6" />

      {/* Ingredients */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
        Ingredients:
      </h2>
      <div className="flex items-center mb-4 flex-wrap gap-4">
        <p className="text-sm text-gray-600">Adjust Servings</p>
        <div className="border border-gray-300 rounded px-2 py-1 w-16 text-center">
          {servings}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recipeDetail.extendedIngredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className={`flex items-center p-2 border rounded transition-colors ${
              checkedIngredients[ingredient.id]
                ? "bg-gray-100"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              checked={checkedIngredients[ingredient.id] || false}
              onChange={() => handleIngredientToggle(ingredient.id)}
              className="mr-2 text-red-400"
            />
            <p
              className={`flex-grow text-gray-800 text-sm ${
                checkedIngredients[ingredient.id] ? "line-through" : ""
              }`}
            >
              {ingredient.measures.us.amount &&
              ingredient.measures.us.unitShort
                ? `${ingredient.measures.us.amount} ${ingredient.measures.us.unitShort} ${ingredient.nameClean}`
                : ingredient.original}
            </p>
          </div>
        ))}
      </div>

      <hr className="my-6" />

      {/* Nutritional Information */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
        Nutritional Information
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            {fatMatch ? fatMatch[1] + "g" : "N/A"}
          </p>
          <p className="font-bold">Fat</p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            {proteinMatch ? proteinMatch[1] + "g" : "N/A"}
          </p>
          <p className="font-bold">Protein</p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            {recipeDetail.pricePerServing
              ? `$${recipeDetail.pricePerServing.toFixed(2)}`
              : "N/A"}
          </p>
          <p className="font-bold">Price/Serving</p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            {caloriesMatch ? caloriesMatch[1] : "N/A"}
          </p>
          <p className="font-bold">Calories</p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            {recipeDetail.healthScore || "N/A"}
          </p>
          <p className="font-bold">Health Score</p>
        </div>
      </div>

      <hr className="my-6" />

      {/* Directions */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
        Directions
      </h2>
      {recipeDetail.analyzedInstructions[0]?.steps.map((step, index) => (
        <div key={index} className="mb-6">
          <div className="flex items-start gap-4">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-400 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              {step.number}
            </div>
            <p className="text-gray-800 text-sm sm:text-base">
              {step.step}
            </p>
          </div>
          {step.equipment && step.equipment.length > 0 && (
            <div className="mt-2">
              <p className="text-gray-600 text-sm mb-1">Equipment Needed:</p>
              <div className="flex gap-4 flex-wrap">
                {step.equipment.map((equip, equipIndex) => (
                  <div
                    key={equipIndex}
                    className="text-center max-w-[100px]"
                  >
                    <img
                      src={equip.image}
                      alt={equip.name}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/100x100?text=Image+Not+Found";
                      }}
                      className="w-full h-auto object-cover rounded"
                    />
                    <p className="text-gray-600 text-xs mt-1 block">
                      {equip.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <hr className="my-6" />

      {/* Dietary Information */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
          Dietary Information
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm">
          {recipeDetail.diets.length > 0
            ? recipeDetail.diets.join(", ")
            : "No specific diet information available"}
        </p>
        <p className="text-gray-600 text-xs sm:text-sm mt-1">
          Vegetarian: {recipeDetail.vegetarian ? "Yes" : "No"}
          <br />
          Vegan: {recipeDetail.vegan ? "Yes" : "No"}
          <br />
          Gluten Free: {recipeDetail.glutenFree ? "Yes" : "No"}
          <br />
          Dairy Free: {recipeDetail.dairyFree ? "Yes" : "No"}
        </p>
      </div>

      {/* Print Button */}
      <div className="flex gap-4 mt-6 justify-center sm:justify-start">
        <button
          onClick={handlePrint}
          className="bg-red-400 text-white px-4 py-2 rounded uppercase"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default RecipeDetail;
