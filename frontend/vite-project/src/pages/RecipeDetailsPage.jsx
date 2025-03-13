import React from "react";
import Navbar from "../components/Navbar";
import RecipeDetail from "../components/RecipeDetail";


const ReceipeDetail = () => {
  return (
    <>
      {/* <Navbar /> */}
      <div className="flex justify-center">
        <div className="w-3/4">
          <RecipeDetail />
        </div>
      </div>

    </>
  );
};

export default ReceipeDetail;
