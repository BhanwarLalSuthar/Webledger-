const mongoose = require("mongoose");

const SavedRecipeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipeId: { type: Number, required: true },
    position: { type: Number, required: true },
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model("SavedRecipe", SavedRecipeSchema);
