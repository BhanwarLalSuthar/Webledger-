const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    savedRecipes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "SavedRecipe" },
    ],
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model("User", UserSchema);
