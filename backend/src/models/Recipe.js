const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    recipeId : { type: Number, required: true, index: true},
    title: { type: String, required: true },
    image: { type: String, required: true },
    vegan: { type: Boolean, required: true },
    readyInMinutes: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  }, { timestamps: true, versionKey: false });
  
  module.exports = mongoose.model('Recipe', RecipeSchema)