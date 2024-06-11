const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');


// Middleware for handling async requests with centralized error handling
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch((error) => {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  };
}

// Controller for creating a book
const createBook = asyncHandler(async (req, res) => {
  const { title, author, content, category, datePublished, bookCover, audioContent, age, description } = req.body;

  if (!title || !author || !content) {  // Basic validation
    return res.status(400).json({ error: 'Title, author, and content are required fields.' });
  }

  const newBook = await prisma.book.create({
    data: { title, author, content, category, datePublished, bookCover, audioContent, age, description },
  });

  res.status(201).json(newBook);
});

// Controller for retrieving all books
const getAllBooks = asyncHandler(async (req, res) => {
  const allBooks = await prisma.book.findMany();
  res.json(allBooks);
});

// Controller for retrieving books by category
const getBooksByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;

  if (!category) {
    return res.status(400).json({ error: 'Category is required.' });
  }

  const booksByCategory = await prisma.book.findMany({ where: { category } });
  res.json(booksByCategory);
});

// Controller for retrieving a book by its ID
const getBookById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const book = await prisma.book.findUnique({
    where: { id: parseInt(id) }
  });

  if (!book) {
    return res.status(404).json({ error: 'Book not found.' });
  }

  res.json(book);
});

// Add a book to favorites
const addFavorite = asyncHandler(async (req, res) => {
  const { userId, bookId } = req.body;

  if (!userId || !bookId) {
    return res.status(400).json({ error: 'User ID and Book ID are required.' });
  }

  const favorite = await prisma.bookUser.create({
    data: {
      userId: parseInt(userId, 10),
      bookId: parseInt(bookId, 10)
    }
  });

  res.status(201).json(favorite);
});

// Retrieve favorite books for a user
// Controller pour récupérer les livres favoris d'un utilisateur
const getFavorites = async (req, res) => {
  const { userId } = req.params; // Assurez-vous que le userId est passé correctement, peut-être via JWT ou paramètre
  try {
    const favorites = await prisma.bookUser.findMany({
      where: { userId: parseInt(userId) },
      include: { book: true } // Assurez-vous d'inclure les détails du livre
    });
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Unable to retrieve favorites', error });
  }
};

// Télécharger un livre pour lecture hors ligne
async function downloadBook(req, res) {
  const { bookId } = req.params;
  
  try {
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    });

    if (book) {
      const filePath = path.join(__dirname, '../books/', `${book.title}.epub`);
      fs.writeFileSync(filePath, book.content); // assuming book.content is in EPUB format
      res.download(filePath);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Unable to download book' });
  }
}

module.exports = {
  createBook,
  getAllBooks,
  getBooksByCategory,
  getBookById,
  addFavorite,
  getFavorites,
  downloadBook
};
