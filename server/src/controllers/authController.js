// authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const validator = require('validator'); // Importer le module Validator

// Fonction d'inscription
const signup = async (req, res) => {
  const { username, password, email, parentName, childAge, schoolLevel, avatar } = req.body;

  try {
    // Vérifier si l'e-mail est valide
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Adresse e-mail invalide' });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: 'Le nom d\'utilisateur est déjà pris' });
    }

    // Hacher le mot de passe avant de le stocker
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur dans la base de données
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        parentName,
        childAge,
        schoolLevel,
        avatar,
      },
    });

    // Générer un token JWT
    const token = jwt.sign({ id: newUser.id }, 'rhksisnsws38jdd87DJS()$#435bjdsk');

    // Envoyer la réponse avec le token
    res.status(201).json({ message: 'Inscription réussie', token });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
};

// Fonction de connexion
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe dans la base de données
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }

    // Vérifier si le mot de passe est correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);

    // Envoyer la réponse avec le token
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
};

// Fonction pour récupérer les livres de l'utilisateur
const getUserBooks = async (req, res) => {
  const userId = req.user.id; // Récupérer l'ID de l'utilisateur à partir du token JWT

  try {
    // Récupérer les livres de l'utilisateur à partir de la base de données
    const userBooks = await prisma.bookUser.findMany({
      where: { userId },
      include: { book: true },
    });

    res.status(200).json({ userBooks });
  } catch (error) {
    console.error('Error fetching user books:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des livres de l\'utilisateur' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    // Assuming the user ID is stored in the JWT and decoded in the jwtAuthMiddleware
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        books: true, 
        readingHistory: true,
        userPreferences: true,
        parentalControl: true, 
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Error fetching user details' });
  }
};

const getMe = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];  // Extract the token from Authorization header
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);  // Replace 'your_jwt_secret' with your actual JWT secret

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id
      },
      include: {
        books: true, 
        readingHistory: true,
        userPreferences: true,
        parentalControl: true, 
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error retrieving user data:', error);
    res.status(500).json({ message: 'Error retrieving user data' });
  }
};

module.exports = { signup, login, getUserBooks, getCurrentUser, getMe };
