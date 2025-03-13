import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Search,
  Users,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  saveRecipe,
  

 } from "../store_slices/savedRecipesSlice";
 import {
  fetchRecipes,
  filterRecipe,
  searchRecipe,

 } from "../store_slices/recipeSlice"
import RecipeCard from "./RecipeCard";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated = false } = useSelector((state) => state.auth || {});
  // Local state for the dynamic search query
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedlimit, setSelectedLimit] = useState(10);
  
  const {
    randomRecipe,
    searchResults,
    filteredResults,
    savedRecipes,
    loading,
    error
  } = useSelector((state) => state.recipe);

  
  const [recipes, setRecipes] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);
  
  const [selectedRecipe, setSelectedRecipe] = useState(null);

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

  useEffect(() =>{
    dispatch(fetchRecipes())
    // console.log(filteredResults)
  }, [dispatch])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() !== '') {
        dispatch(searchRecipe(searchQuery));
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, dispatch]);

  const handleFilter = () => {
    const filterParams = {};
    if (selectedCuisine !== 'All') filterParams.cuisine = selectedCuisine;
    if (selectedCategory !== 'All') filterParams.category = selectedCategory;
    if (selectedlimit) filterParams.limit = selectedlimit;

    dispatch(filterRecipe(filterParams));
  };

  const handleSave = (recipe) => {
    if (!isAuthenticated) {
      alert('Please login to bookmark recipes.');
      navigate('/login');
      return;
    }
    dispatch(saveRecipe(recipe));
  };

 
  // useEffect(() => {
  //   dispatch(fetchSavedRecipes());

  //   const fetchRecipes = async () => {
  //     try {
  //       setIsLoading(true);
  //       let url = `http://localhost:3030/recipes?limit=${limit}`;
  //       if (selectedCategory !== "All")
  //         url += `&type=${selectedCategory.toLowerCase()}`;
  //       if (selectedCuisine !== "All")
  //         url += `&cuisine=${selectedCuisine.toLowerCase()}`;

  //       const response = await fetch(url);
  //       const data = await response.json();

  //       if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  //       if (!data.recipes || !Array.isArray(data.recipes)) {
  //         throw new Error("Invalid data format received");
  //       }
  //       setRecipes(data.recipes);
  //     } catch (err) {
  //       console.error("Fetching error:", err);
  //       setError("Failed to fetch recipes. Please try again later.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchRecipes();
  // }, [dispatch, limit, selectedCategory, selectedCuisine]);

  // const filteredRecipes = (recipes || []).filter((recipe) =>
  //   (recipe.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  // );

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
{/* filter */}
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
          value={selectedlimit}
          onChange={(e) => setSelectedLimit(e.target.value)}
        >
          {limits.map((num) => (
            <option key={num} value={num}>
              {num} recipes
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleFilter}>Apply Filters</button>
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredResults && filteredResults.length > 0 ? (
             
              filteredResults.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={setSelectedRecipe}
                />
              ))
            ) : (
              <div className="text-center text-gray-500 py-10 col-span-3">
                <Search className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                <p className="text-xl">No recipes found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
            <button
              onClick={() => setSelectedRecipe(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedRecipe.title}</h2>
            <img
              src={selectedRecipe.image}
              alt={selectedRecipe.title}
              className="w-full h-56 object-cover mb-4"
            />
            <p className="text-gray-700">
              <strong>Servings:</strong> {selectedRecipe.servings || "N/A"}
            </p>
            <p className="text-gray-700">
              <strong>Price per serving:</strong> $
              {selectedRecipe.pricePerServing
                ? Number(selectedRecipe.pricePerServing).toFixed(2)
                : "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;