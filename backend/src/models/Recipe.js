const mongoose = require("mongoose");

const SavedRecipeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipeId: { type: Number, required: true, index: true },
    position: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model("SavedRecipe", SavedRecipeSchema);
