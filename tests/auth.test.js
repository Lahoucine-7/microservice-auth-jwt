/**
 * @fileoverview Tests des endpoints d'authentification et du middleware.
 * Utilise Jest et Supertest pour vérifier le bon fonctionnement de l'API.
 */

const request = require("supertest");
const app = require("../src/index");
const mongoose = require("mongoose");
const User = require("../src/models/User");

// Connexion à la base de test avant l'exécution des tests.
beforeAll(async () => {
  const uri =
    process.env.MONGODB_URI_TEST || "mongodb://localhost:27017/ma_base_test";
  await mongoose.connect(uri);
});

// Nettoyage de la collection User avant chaque test afin de partir d'une base vide.
beforeEach(async () => {
  await User.deleteMany({});
});

// Fermeture de la connexion Mongoose après l'exécution de tous les tests.
afterAll(async () => {
  await mongoose.connection.close();
});

describe("Tests de l'inscription (/api/auth/register)", () => {
  it("devrait créer un nouvel utilisateur et retourner un statut 201", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", motDePasse: "password123" });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "Utilisateur créé avec succès");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", "test@example.com");
  });

  it("devrait retourner une erreur 400 si email ou motDePasse est manquant", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "" });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
});

describe("Tests de la connexion (/api/auth/login)", () => {
  // Inscrire un utilisateur avant chaque test de connexion.
  beforeEach(async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ email: "login@example.com", motDePasse: "password123" });
  });

  it("devrait connecter un utilisateur et retourner un token JWT (status 200)", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "login@example.com", motDePasse: "password123" });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Connexion réussie");
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
    expect(res.body.token.length).toBeGreaterThan(0);
  });

  it("devrait retourner une erreur 401 pour identifiants incorrects ou utilisateur inexistant", async () => {
    // Mauvais mot de passe
    let res = await request(app)
      .post("/api/auth/login")
      .send({ email: "login@example.com", motDePasse: "wrongpassword" });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error");

    // Email inexistant
    res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nonexistent@example.com", motDePasse: "password123" });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error");
  });

  it("devrait retourner une erreur 400 si email ou motDePasse est manquant", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "login@example.com" });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
});

describe("Tests du middleware de vérification du token", () => {
  it("devrait renvoyer 401 si aucun token n'est fourni", async () => {
    const res = await request(app).get("/api/protected");
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Accès refusé, token manquant");
  });

  it("devrait renvoyer 403 si un token invalide est fourni", async () => {
    const res = await request(app)
      .get("/api/protected")
      .set("Authorization", "Bearer tokenInvalide");
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty("error", "Token invalide");
  });

  it("devrait renvoyer 200 avec les infos de l'utilisateur pour un token valide", async () => {
    // Création et connexion d'un utilisateur
    await request(app)
      .post("/api/auth/register")
      .send({ email: "middleware@example.com", motDePasse: "password123" });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "middleware@example.com", motDePasse: "password123" });

    const token = loginRes.body.token;
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);

    // Accès à l'endpoint protégé avec le token
    const res = await request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Accès autorisé");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", "middleware@example.com");
  });
});
