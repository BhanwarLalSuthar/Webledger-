const mongoose = require('mongoose');



const SavedRecipeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    position: { type: Number, default: 0 }  // Track recipe order
  }, { timestamps: true, versionKey: false });
  
  module.exports = mongoose.model('SavedRecipe', SavedRecipeSchema);