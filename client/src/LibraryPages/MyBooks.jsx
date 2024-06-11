// import React, { useContext, useState, useEffect } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Pagination } from 'swiper/modules';
// import { useNavigate } from 'react-router-dom';
// import { useBookContext } from '../Context/BookContext';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import LibrairieNavBar from '../components/LibrairieNavBar';
// import { UserContext } from '../Context/userContext';
// import axios from 'axios'; // Importez axios ici

// const MyBooks = () => {
//   const { groupedBooks } = useBookContext();
//   const { user, removeFromMyBooks } = useContext(UserContext);
//   const navigate = useNavigate();
//   const [selectedBook, setSelectedBook] = useState(null);

//   const handleReadButtonClick = (book) => {
//     setSelectedBook(book);
//     navigate('/Lecture', { state: { book } });
//   };

//   const handleListenButtonClick = (book) => {
//     setSelectedBook(book);
//     navigate('/LectureAudio', { state: { book } });
//   };

//   // const handleReturnBook = async (bookId) => {
//   //   try {
//   //     // Récupération du token depuis le contexte utilisateur
//   //     const token = localStorage.getItem('token');
//   //     // Configuration du header avec le token JWT
//   //     const headers = {
//   //       Authorization: `Bearer ${token}`,
//   //     };

//   //     // Appel axios avec le header
//   //     await axios.delete(`/user/${user.id}/favorites/${bookId}`, { headers });
//   //     removeFromMyBooks(bookId);
//   //   } catch (error) {
//   //     console.error('Error removing book from favorites:', error);
//   //   }
//   // };

//   return (
//     <div>
//       <LibrairieNavBar />
//       <div className="mt-10 ml-2 mr-2">
//         {Object.keys(groupedBooks).map((category) => (
//           <div key={category}>
//             <h2 className='text-2xl font-semibold'>{category}</h2>
//             <Swiper
//               slidesPerView={1}
//               spaceBetween={10}
//               pagination={{ clickable: true }}
//               breakpoints={{
//                 640: { slidesPerView: 2, spaceBetween: 20 },
//                 768: { slidesPerView: 4, spaceBetween: 40 },
//                 1024: { slidesPerView: 5, spaceBetween: 50 },
//               }}
//               modules={[Pagination]}
//               className="mySwiper w-full h-full"
//             >
//               {groupedBooks[category].map((book, index) => (
//                 <SwiperSlide key={index}>
//                   <div className="flex flex-col items-center">
//                     <img src={book.bookCover} alt="bookCover" className="mb-2" />
//                     <div className="text-center">
//                       <button
//                         className="bg-[#DC7211] text-white py-2 px-4 rounded-lg mt-2 mr-2"
//                         onClick={() => handleReadButtonClick(book)}
//                       >
//                         Lire
//                       </button>
//                       <button
//                         className="bg-[#DC7211] text-white py-2 px-4 rounded-lg mt-2"
//                         onClick={() => handleListenButtonClick(book)}
//                       >
//                         Écouter
//                       </button>
//                       {/* <button
//                         className="mt-2 py-2 px-4 rounded-lg bg-red-500 text-white"
//                         onClick={() => handleReturnBook(book.id)}
//                       >
//                         Retourner ce livre
//                       </button> */}
//                     </div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MyBooks;

import React, { useContext, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/userContext';  // Adjust path as necessary
import LibrairieNavBar from '../components/LibrairieNavBar';
import { useBookContext } from '../Context/BookContext';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const MyBooks = () => {
  const { groupedBooks } = useBookContext();
  const { user, favorites, getFavorites } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.id) {
      getFavorites(user.id);
    }
  }, [user]);

  const handleReadButtonClick = (book) => {
    navigate('/Lecture', { state: { book } });
  };

  const handleListenButtonClick = (book) => {
    navigate('/LectureAudio', { state: { book } });
  };

  return (
    <div>
      <LibrairieNavBar />
      <div className="mt-10 ml-2 mr-2">
        <h1>My Favorite Books</h1>
        {favorites.length > 0 ? (
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
               768: { slidesPerView: 4, spaceBetween: 40 },
              1024: { slidesPerView: 5, spaceBetween: 50 },
            }}
            modules={[Pagination]}
            className="mySwiper w-full h-full"
          >
            {favorites.map((book, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col items-center">
                  <img src={book.bookCover} alt="bookCover" className="mb-2" />
                  <div className="text-center">
                    <button
                      className="bg-[#DC7211] text-white py-2 px-4 rounded-lg mt-2 mr-2"
                      onClick={() => handleReadButtonClick(book)}
                    >
                      Lire
                    </button>
                    <button
                      className="bg-[#DC7211] text-white py-2 px-4 rounded-lg mt-2"
                      onClick={() => handleListenButtonClick(book)}
                    >
                      Écouter
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p>No favorite books available.</p>
        )}
      </div>
    </div>
  );
};

export default MyBooks;