/**
 * @fileoverview Contrôleurs pour l'authentification.
 * Fournit les fonctions pour l'inscription et la connexion des utilisateurs.
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Inscrit un nouvel utilisateur.
 * @param {object} req - La requête Express.
 * @param {object} res - La réponse Express.
 */
const registerUser = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    // Vérifier que l'email et le mot de passe sont fournis.
    if (!email || !motDePasse) {
      return res
        .status(400)
        .json({ error: "Email et mot de passe sont requis" });
    }

    // Vérifier si l'utilisateur existe déjà.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Cet email est déjà utilisé" });
    }

    // Hachage du mot de passe avec bcrypt (10 rounds de salage).
    const hash = await bcrypt.hash(motDePasse, 10);

    // Création de l'utilisateur dans la base de données.
    const newUser = await User.create({ email, motDePasse: hash });

    res
      .status(201)
      .json({ message: "Utilisateur créé avec succès", user: newUser });
  } catch (error) {
    console.error("Erreur dans registerUser :", error);
    res.status(500).json({ error: "Erreur lors de l'inscription" });
  }
};

/**
 * Connecte un utilisateur et génère un token JWT.
 * @param {object} req - La requête Express.
 * @param {object} res - La réponse Express.
 */
const loginUser = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    // Vérifier que l'email et le mot de passe sont fournis.
    if (!email || !motDePasse) {
      return res
        .status(400)
        .json({ error: "Email et mot de passe sont requis" });
    }

    // Recherche de l'utilisateur par email.
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    // Comparer le mot de passe fourni avec le mot de passe haché.
    const match = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!match) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    // Génération du token JWT (valable 1 heure).
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "Connexion réussie", token });
  } catch (error) {
    console.error("Erreur dans loginUser:", error);
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
};

module.exports = { registerUser, loginUser };
