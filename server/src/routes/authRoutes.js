// authRoutes.js

const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const verifyEmailAlreadyExist = require('../middlewares/verifyEmailAlreadyExist');
const verifyUsernameAlreadyExist = require('../middlewares/verifyUsernameAlreadyExist');
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware');
const authenticateUser = require('../middlewares/authenticateUser');
const { generateResetToken, sendPasswordResetEmail } = require('../utils/passwordReset'); // Fonctions utilitaires pour la réinitialisation du mot de passe
const crypto = require('crypto');
const nodemailer = require('nodemailer');


// Route d'inscription 
router.post('/signup', verifyEmailAlreadyExist, verifyUsernameAlreadyExist, authController.signup);

// Route de connexion
router.post('/login', passport.authenticate('local', { session: false }), authenticateUser,authController.login);

// Route de déconnexion
router.post('/logout', (req, res, next) => {
  req.logout(function(err) {
      if (err) { 
          return next(err);  // Use next() to handle the error properly
      }
      res.status(200).json({ message: 'Déconnexion réussie' });  // Send the response once
  });
});

// Route de récupération des livres de l'utilisateur
router.get('/user/books', jwtAuthMiddleware, authController.getUserBooks);

router.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Aucun utilisateur trouvé avec cet e-mail." });
    }

    const resetToken = generateResetToken(user); // Générer le jeton de réinitialisation
    await user.save(); // Enregistrer le jeton dans la base de données

    // Envoyer l'e-mail de réinitialisation avec le lien contenant le jeton
    await sendPasswordResetEmail(user.email, resetToken);

    return res.status(200).json({ message: "Un e-mail de réinitialisation a été envoyé." });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Une erreur est survenue lors de la réinitialisation du mot de passe." });
  }
});


// Route pour la demande de réinitialisation de mot de passe
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Vérifiez si l'adresse e-mail existe dans la base de données
    const user = await user.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Adresse e-mail non trouvée." });
    }

    // Générez un jeton unique pour la réinitialisation du mot de passe
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 heure d'expiration
    await user.save();

    // Envoyer un e-mail à l'utilisateur avec le lien de réinitialisation
    const transporter = nodemailer.createTransport({
      // Configurer votre transporteur SMTP
    });

    const mailOptions = {
      from: 'votre-email@gmail.com',
      to: email,
      subject: 'Réinitialisation du mot de passe',
      text: `Vous avez demandé une réinitialisation de mot de passe. Veuillez cliquer sur ce lien pour réinitialiser votre mot de passe: http://localhost:3000/reset-password/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending forgot password email:', error);
        return res.status(500).json({ message: 'Une erreur est survenue lors de l\'envoi de l\'e-mail.' });
      }
      console.log('Forgot password email sent:', info.response);
      res.status(200).json({ message: 'Un e-mail de réinitialisation du mot de passe a été envoyé.' });
    });

  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la réinitialisation du mot de passe.' });
  }
});

// Route to get user data for logged-in user
router.get('/auth/:id', jwtAuthMiddleware, authController.getMe);


module.exports = router;
