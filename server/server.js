const express = require('express');
const passport = require('passport');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');
const session = require('express-session');
const { PrismaClient } = require('@prisma/client');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const bookRoutes = require('./src/routes/bookRoutes');
const userRoutes = require('./src/routes/userRoutes');
const verificationRoutes = require('./src/routes/verificationRoutes');
const subscriptionRoutes = require('./src/routes/subscriptionRoutes');
const readingHistoryRoutes = require('./src/routes/readingHistoryRoutes');
const parentalControlRoutes = require('./src/routes/parentalControlRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const jwtAuthMiddleware = require('./src/middlewares/jwtAuthMiddleware');

const app = express();
const prisma = new PrismaClient();

// Middleware de journalisation
app.use(morgan('dev'));

// Middleware pour CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
}));

// Middleware pour parser les données JSON
app.use(express.json());

// Utilisation du middleware de session
app.use(session({
  secret: process.env.Session_Secret_Key, // Utiliser une variable d'environnement
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true, httpOnly: true } // Améliorer la sécurité des cookies
}));

// Initialisation de Passport
app.use(passport.initialize());

// Configuration de la stratégie locale pour Passport
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { username }
      });
      if (!user) {
        return done(null, false, { message: 'Username not found' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Routes
app.use('/auth', authRoutes);
app.use('/Book', jwtAuthMiddleware, bookRoutes);
app.use('/user', jwtAuthMiddleware, userRoutes);
app.use('/verification', verificationRoutes);
app.use('/subscriptions', subscriptionRoutes);
app.use('/reading-histories', readingHistoryRoutes);
app.use('/parental-controls', parentalControlRoutes);
app.use('/api', paymentRoutes);

// Gestionnaire d'erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Démarrage du serveur
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
