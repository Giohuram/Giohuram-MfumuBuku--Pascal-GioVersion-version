const express = require('express');
const router = express.Router();
const { createBook, getAllBooks, getBooksByCategory, getBookById, addFavorite, getFavorites, downloadBook } = require('../controllers/bookController');
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware');

// Route pour créer un livre
router.post('/', jwtAuthMiddleware, createBook);

// Route pour récupérer tous les livres
router.get('/', jwtAuthMiddleware, getAllBooks);

// Route pour récupérer les livres par catégorie
router.get('/category/:category', jwtAuthMiddleware, getBooksByCategory);

// Route pour récupérer un livre par son ID
router.get('/:id', jwtAuthMiddleware, getBookById);

// Route pour ajouter un livre aux favoris
// router.post('Book/favorites', jwtAuthMiddleware, addFavorite);
router.post('/favorites', jwtAuthMiddleware, addFavorite, async (req, res) => {
    const { userId, bookId } = req.body;
  
    if (!userId || !bookId) {
      return res.status(400).json({ error: 'User ID and Book ID are required.' });
    }
  
    try {
      const favorite = await prisma.bookUser.create({
        data: {
          userId: parseInt(userId, 10), // Ensure userId is an integer
          bookId: parseInt(bookId, 10)  // Ensure bookId is an integer
        }
      });
      res.status(201).json({ book: favorite });
    } catch (error) {
      console.error('Error adding favorite:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log("Route /Book/favorites accessed");
    console.log("Request body:", req.body);
    addFavorite(req, res);
  });
  

// Route pour récupérer les favoris d'un utilisateur
router.get('/favorites/:userId', jwtAuthMiddleware, getFavorites);

// Route pour télécharger un livre
router.get('/download/:bookId', jwtAuthMiddleware, downloadBook);

module.exports = router;

