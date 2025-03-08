const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    summary: { type: String, required: true },
    instructions: { type: String, required: true },
    nutrition: { type: Object, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  }, { timestamps: true, versionKey: false });
  
  module.exports = mongoose.model('Recipe', RecipeSchema)