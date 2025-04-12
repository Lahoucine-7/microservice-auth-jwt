require("dotenv").config();
const express = require("express");
const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Route basique
app.get("/", (req, res) => {
  res.send("Bonjour, le microservice d’authentification est en marche !");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
