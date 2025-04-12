/**
 * @fileoverview Middleware d'authentification basé sur JWT.
 * Vérifie la présence et la validité du token dans l'en-tête Authorization.
 */

const jwt = require("jsonwebtoken");

/**
 * Vérifie le token JWT dans l'en-tête Authorization.
 * Si valide, attache les informations décodées à req.user et passe au middleware suivant.
 * Sinon, renvoie une erreur 401 (token manquant) ou 403 (token invalide).
 *
 * @param {object} req - La requête Express.
 * @param {object} res - La réponse Express.
 * @param {function} next - La fonction pour passer au middleware suivant.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // Le format attendu est : "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Accès refusé, token manquant" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token invalide" });
    }
    // Attache les informations du token décodé à l'objet de requête.
    req.user = decoded;
    next();
  });
};

module.exports = authenticateToken;
