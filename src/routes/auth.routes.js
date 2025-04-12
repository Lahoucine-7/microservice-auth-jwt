/**
 * @fileoverview Définition des routes d'authentification.
 * Les routes incluent l'inscription et la connexion des utilisateurs.
 */

const express = require("express");
const router = express.Router();

// Importer les fonctions de contrôleur pour l'inscription et la connexion.
const { registerUser, loginUser } = require("../controllers/auth.controller");

// Route pour l'inscription d'un nouvel utilisateur.
router.post("/register", registerUser);

// Route pour la connexion d'un utilisateur existant.
router.post("/login", loginUser);

module.exports = router;
