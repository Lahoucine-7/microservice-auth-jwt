/**
 * @fileoverview Définition du modèle User pour MongoDB avec Mongoose.
 */

const mongoose = require("mongoose");

// Schéma de l'utilisateur
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
  },
  {
    timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
  }
);

module.exports = mongoose.model("User", UserSchema);
