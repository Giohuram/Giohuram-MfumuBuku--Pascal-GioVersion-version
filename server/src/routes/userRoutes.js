const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Assurez-vous que le chemin d'importation est correct

// Importez votre middleware d'authentification JWT si nécessaire
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware');

// Route pour créer un nouvel utilisateur
router.post('/', jwtAuthMiddleware, userController.createUser);

// Route pour récupérer tous les utilisateurs
router.get('/', jwtAuthMiddleware, userController.getUsers);

// Route pour récupérer un utilisateur par son ID
router.get('/user/:id', jwtAuthMiddleware, userController.getUserById);

// Route pour récupérer les informations du compte utilisateur
router.get('/user/account', jwtAuthMiddleware, userController.getUserAccount);

// Route pour récupérer le compte d'un utilisateur par son ID 
router.get('/user/:id/account', jwtAuthMiddleware, userController.getUserAccountById)

// Route pour le téléchargement d'un avatar
router.post('/upload-avatar', jwtAuthMiddleware, userController.uploadAvatar);

module.exports = router;
