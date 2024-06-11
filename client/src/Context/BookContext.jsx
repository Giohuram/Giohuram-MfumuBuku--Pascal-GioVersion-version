import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUserContext } from './userContext';  // Import the user context to access user data

const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const { user } = useUserContext();  // Get the user data from user context
  const [myBooks, setMyBooks] = useState([]);

  const addBookToLibrary = (book) => {
    setMyBooks([...myBooks, book]);
  };

  const saveToFavorites = async (bookId) => {
    try {
      const userId = user.id;  // Get the user ID from user context
      if (!userId) {
        throw new Error('User ID is required');
      }

      await axios.post('/Book/favorites', { userId, bookId }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      // Optionally update UI here if necessary
    } catch (error) {
      console.error('Error saving to favorites:', error);
    }
  };

  const groupBooksByCategory = (books) => {
    const groupedBooks = {};
    books.forEach(book => {
      if (!groupedBooks[book.category]) {
        groupedBooks[book.category] = [];
      }
      groupedBooks[book.category].push(book);
    });
    return groupedBooks;
  };

  const downloadBook = async (bookId) => {
    try {
      const response = await axios.get(`/books/download/${bookId}`, {
        responseType: 'blob',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      // Handle the response, e.g., save the blob in IndexedDB
    } catch (error) {
      console.error('Error downloading book:', error);
    }
  };

  const [groupedBooks, setGroupedBooks] = useState(groupBooksByCategory([]));

  useEffect(() => {
    setGroupedBooks(groupBooksByCategory(myBooks));
  }, [myBooks]);

  return (
    <BookContext.Provider value={{ myBooks, addBookToLibrary, groupedBooks, saveToFavorites, downloadBook }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBookContext = () => useContext(BookContext);
