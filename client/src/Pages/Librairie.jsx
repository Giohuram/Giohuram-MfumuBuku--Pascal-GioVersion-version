// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import LibrairieNavBar from '../components/LibrairieNavBar';
// import BookCard from '../SharedComponents/BookCard';
// import { useBookContext } from '../Context/BookContext';
// import Banner from '../SharedComponents/Banner';

// const Libraries = () => {
//   const { books, addBookToLibrary } = useBookContext();
//   const [booksByCategory, setBooksByCategory] = useState({});
//   const [filteredBooks, setFilteredBooks] = useState([]);
//   const [filteredCategories, setFilteredCategories] = useState({});

//   useEffect(() => {
//     fetchBooks();
//   }, []);

//   useEffect(() => {
//     setFilteredBooks(books);
//   }, [books]);

//   useEffect(() => {
//     filterCategories();
//   }, [filteredBooks]);

//   const fetchBooks = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get('http://localhost:3005/Book', {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       const groupedBooks = groupBooksByCategory(response.data);
//       setBooksByCategory(groupedBooks);
//       setFilteredBooks(response.data);
//     } catch (error) {
//       console.error('Error fetching books:', error);
//     }
//   };

//   const groupBooksByCategory = (books) => {
//     const groupedBooks = {};
//     books.forEach(book => {
//       if (!groupedBooks[book.category]) {
//         groupedBooks[book.category] = [];
//       }
//       groupedBooks[book.category].push(book);
//     });
//     return groupedBooks;
//   };

//   const handleAddToCollection = (book) => {
//     addBookToLibrary(book);
//   };

//   const filterCategories = () => {
//     const newFilteredCategories = {};
//     for (const category in booksByCategory) {
//       const filteredBooksInCategory = booksByCategory[category].filter(book =>
//         filteredBooks.some(filteredBook => filteredBook.id === book.id)
//       );
//       if (filteredBooksInCategory.length > 0) {
//         newFilteredCategories[category] = filteredBooksInCategory;
//       }
//     }
//     setFilteredCategories(newFilteredCategories);
//   };
  

//   return (
//     <div>
//       <LibrairieNavBar />
//       <Banner books={filteredBooks} setFilteredBooks={setFilteredBooks} />
      
//       <div>
//         {Object.keys(filteredCategories).length > 0 ? (
//           Object.keys(filteredCategories).map(category => (
//             <div key={category}>
//               <h2 className='mt-5 ml-20 text-2xl font-semibold'>{category}</h2>
//               <div className="ml-[-0px] mr-[-0px]">
//                 <BookCard books={filteredCategories[category]} onAddToCollection={handleAddToCollection} />
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className='mt-5 ml-20 text-2xl font-semibold'>No books available</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Libraries;

import { useState, useEffect } from 'react';
import axios from 'axios';
import LibrairieNavBar from '../components/LibrairieNavBar';
import BookCard from '../SharedComponents/BookCard';
import { useBookContext } from '../Context/BookContext';
import Banner from '../SharedComponents/Banner';

const Libraries = () => {
  const { books, addBookToLibrary } = useBookContext();
  const [booksByCategory, setBooksByCategory] = useState({});
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState({});

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    setFilteredBooks(books);
  }, [books]);

  useEffect(() => {
    filterCategories();
  }, [filteredBooks]);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3005/Book', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        const groupedBooks = groupBooksByCategory(response.data);
        setBooksByCategory(groupedBooks);
        setFilteredBooks(response.data);
      } else {
        console.error('Failed to fetch books:', response.status);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
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

  const handleAddToCollection = (book) => {
    addBookToLibrary(book);
  };

  const filterCategories = () => {
    const newFilteredCategories = {};
    for (const category in booksByCategory) {
      const filteredBooksInCategory = booksByCategory[category].filter(book =>
        filteredBooks.some(filteredBook => filteredBook.id === book.id)
      );
      if (filteredBooksInCategory.length > 0) {
        newFilteredCategories[category] = filteredBooksInCategory;
      }
    }
    setFilteredCategories(newFilteredCategories);
  };

  return (
    <div>
      <LibrairieNavBar />
      <Banner books={filteredBooks} setFilteredBooks={setFilteredBooks} />
      
      <div>
        {Object.keys(filteredCategories).length > 0 ? (
          Object.keys(filteredCategories).map(category => (
            <div key={category}>
              <h2 className='mt-5 ml-20 text-2xl font-semibold'>{category}</h2>
              <div className="ml-[-0px] mr-[-0px]">
                <BookCard books={filteredCategories[category]} onAddToCollection={handleAddToCollection} />
              </div>
            </div>
          ))
        ) : (
          <div className='mt-5 ml-20 text-2xl font-semibold'>No books available</div>
        )}
      </div>
    </div>
  );
};

export default Libraries;
