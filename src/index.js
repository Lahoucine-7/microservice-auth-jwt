/**
 * @fileoverview Point d'entrée de l'application.
 * Configure Express, connecte la base de données et définit les routes.
 */

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Middleware pour parser le JSON entrant.
app.use(express.json());

// Connexion à MongoDB (uniquement en mode non-test).
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connecté à MongoDB"))
    .catch((err) =>
      console.error("Erreur lors de la connexion à MongoDB :", err)
    );
}

// Import des routes et du middleware d'authentification.
const authRoutes = require("./routes/auth.routes");
const authenticateToken = require("./middlewares/auth.middleware");

// Endpoint protégé d'exemple.
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "Accès autorisé", user: req.user });
});

// Montage des routes d'authentification sous le préfixe /api/auth.
app.use("/api/auth", authRoutes);

// Endpoint de base.
app.get("/", (req, res) => {
  res.send("Bonjour, le microservice d’authentification est en marche !");
});

// Démarrage du serveur si l'environnement n'est pas en mode test.
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}

module.exports = app;
