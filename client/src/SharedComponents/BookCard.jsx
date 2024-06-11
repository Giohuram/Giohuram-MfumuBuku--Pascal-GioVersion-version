import React, { useContext, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { useBookContext } from '../Context/BookContext';
import { UserContext } from '../Context/userContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const BookCard = ({ headline, books, onAddToCollection }) => {
  const { user, isAuthenticated, favorites, addFavorite } = useContext(UserContext);
  console.log('User in BookCard:', user); // Log the entire user object
  console.log('User ID in BookCard:', user.id); // Log the user ID

  const [isAdding, setIsAdding] = useState(false);

  const isFavorite = (bookId) => {
    return favorites.some(favoriteBook => favoriteBook.id === bookId);
  };

  const handleAddToFavorites = async (book) => {
    console.log('Attempting to add to favorites with user ID:', user.id);  // Log user ID
    if (isAuthenticated && !isFavorite(book.id)) {
      setIsAdding(true);
      try {
        await addFavorite(book.id);
        favorites(book);
      } catch (error) {
        console.error('Error adding book to favorites:', error);
      } finally {
        setIsAdding(false);
      }
    }
  };  

  if (!books || books.length === 0) {
    return <div>No books available</div>;
  }

  return (
    <>
      <div className='px-4 lg:px-24 mb-2 mt-4'>
        <h2 className='text-2xl font-bold text-[#DC7211] mt-5 mb-2'>{headline}</h2>
      </div>

      <div className='px-4 lg:px-24 pb-10'>
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 10,
            },
          }}
          modules={[Pagination]}
          className="mySwiper w-full h-full"
        >
          {books.map(book => (
            <SwiperSlide key={book.id}>
              <div className="flex flex-col items-center">
                  <img src={book.bookCover} alt="bookCover" className="mb-2 w-full max-w-[200px] h-auto" />
                  <p className="text-center font-semibold">{book.title}</p>
                <div className="text-center">
                  <button
                    className={`bg-[#DC7211] text-white py-2 px-4 rounded-lg mt-2 mr-2 ${isFavorite(book.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handleAddToFavorites(book)}
                    disabled={isFavorite(book.id) || isAdding}
                  >
                    {isFavorite(book.id) ? 'Livre déjà ajouté' : isAdding ? 'Ajout...' : 'Ajouter à ma collection'}
                  </button>
                </div>      
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default BookCard;
