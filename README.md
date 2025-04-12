# Microservice d’Authentification avec JWT

## Description du Projet
Ce projet a pour objectif de développer un microservice d’authentification sécurisé basé sur le standard JWT (JSON Web Tokens). L’API permet aux utilisateurs de s’inscrire et de se connecter afin d’obtenir un token d’authentification, qui pourra ensuite être utilisé pour accéder à d’autres services de manière sécurisée. Ce projet est réalisé dans un but d’apprentissage et n’est pas destiné à un usage en production.

## Contexte d’Utilisation
Le client est une startup qui développe une application mobile innovante. L’API d’authentification est essentielle pour :
- Gérer la création et la connexion des utilisateurs.
- Fournir des tokens JWT pour sécuriser les échanges avec d’autres microservices.
- Garantir la confidentialité des mots de passe grâce au hachage (bcrypt).

## Cahier des Charges
- **Endpoints Clés :**
  - **POST /api/auth/register** : Créer un nouvel utilisateur en validant les données fournies et en hachant le mot de passe.
  - **POST /api/auth/login** : Authentifier un utilisateur et générer un token JWT avec une durée d’expiration (ex. 1 heure).
  - **GET /api/protected** : Endpoint protégé accessible uniquement avec un token JWT valide.

- **Sécurité & Performance :**
  - Utilisation de bcrypt pour le hachage sécurisé des mots de passe.
  - Token signé avec une clé secrète robuste et une durée d’expiration prédéfinie.
  - Réponses rapides aux requêtes.

- **Tests :**
  - Couverture complète avec Jest et Supertest.
  - Vérification des opérations d'inscription, connexion et accès aux endpoints protégés.

## Stack Technologique
- **Langage & Environnement :** Node.js (≥ 14) et npm
- **Framework :** Express.js
- **Base de Données :** MongoDB avec Mongoose
- **Gestion des Tokens :** jsonwebtoken
- **Tests :** Jest et Supertest
- **Outils de Développement :** nodemon pour le rechargement en développement, Git pour le versionnement

## Installation et Configuration

### Prérequis
- Node.js installé (version ≥ 14)
- MongoDB installé et en fonctionnement (localement ou via un service)

### Cloner le Dépôt
```bash
git clone <URL_DU_DEPOT>
cd microservice-auth-jwt
```

### Installer les Dépendances
```bash
npm install
```

### Configurer les Variables d'Environnement
Crée un fichier `.env` à la racine du projet avec le contenu suivant :
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ma_base
MONGODB_URI_TEST=mongodb://localhost:27017/ma_base_test
JWT_SECRET=TaCléSecrèteSuperSûre
```

## Utilisation de l'API

### Démarrage du Serveur
```bash
npm start
```
L’API sera disponible par défaut à l’adresse : `http://localhost:3000`

### Endpoints Principaux

- **Inscription d'un Utilisateur :**
  - **Méthode :** POST  
  - **URL :** `/api/auth/register`
  - **Payload Exemple :**
    ```json
    {
      "email": "user@example.com",
      "motDePasse": "password123"
    }
    ```
  - **Réponse Attendue (201) :**
    ```json
    {
      "message": "Utilisateur créé avec succès",
      "user": {
        "_id": "...",
        "email": "user@example.com",
        "motDePasse": "..."
      }
    }
    ```

- **Connexion d'un Utilisateur :**
  - **Méthode :** POST  
  - **URL :** `/api/auth/login`
  - **Payload Exemple :**
    ```json
    {
      "email": "user@example.com",
      "motDePasse": "password123"
    }
    ```
  - **Réponse Attendue (200) :**
    ```json
    {
      "message": "Connexion réussie",
      "token": "eyJhbGciOiJIUzI1NiIsInR5..."
    }
    ```

- **Endpoint Protégé (Exemple) :**
  - **Méthode :** GET  
  - **URL :** `/api/protected`
  - **Header à Inclure :**
    ```
    Authorization: Bearer <token>
    ```
  - **Réponse Attendue (200) :**
    ```json
    {
      "message": "Accès autorisé",
      "user": {
        "id": "...",
        "email": "user@example.com",
        "iat": 1681331140,
        "exp": 1681334740
      }
    }
    ```

## Exécution des Tests
Les tests automatisés couvrent l’inscription, la connexion ainsi que la vérification du middleware de token.
Pour lancer les tests, exécutez :
```bash
npm test
```

## Remarques et Évolutions Futures
- **Validation des Données :** Intégrer une librairie comme express-validator pour une validation plus robuste.
- **Gestion des Erreurs :** Mettre en place un middleware global pour centraliser et standardiser la gestion des erreurs.
- **Sécurisation :** Ajouter des fonctionnalités comme le refresh token, le rate limiting et le chiffrement via HTTPS pour un déploiement en production.
- **Documentation Interactive :** Intégrer Swagger ou OpenAPI pour une documentation interactive de l'API.
- **Containerisation :** Envisager Docker pour simplifier le déploiement.

## Licence et Avertissement
Ce projet est un projet personnel réalisé dans un but d’apprentissage. Il est fictif et n’est pas destiné à un usage en production.
