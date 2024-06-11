// Affiche la page de lecture du livre sélectionné

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ReactReader } from 'react-reader';
import { useLocation } from 'react-router-dom';
import LibrairieNavBar from '../components/LibrairieNavBar';

const Lecture = () => {
  const location = useLocation();
  const [lastReadLocation, setLastReadLocation] = useState(null);
  const book = location.state?.book; // Accéder au livre depuis l'état, gérer l'absence potentielle

  // Fonction pour récupérer la dernière page lue
  const getLastPageRead = async (bookId) => {
    try {
      const response = await axios.get(`/reading-histories/last-page/${bookId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setLastReadLocation(response.data.lastPageRead);
    } catch (error) {
      console.error('Failed to fetch last page read:', error);
      setLastReadLocation(null); // En cas d'erreur, réinitialisez la dernière position lue
    }
  };

  // Appeler getLastPageRead lorsque le composant est monté
  useEffect(() => {
    if (book && book.id) {
      getLastPageRead(book.id);
    }
  }, [book]);

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ height: '100vh' }}>
      <LibrairieNavBar />
      <ReactReader
        url={book.content} // Assurez-vous que book.content contient l'URL du contenu du livre
        location={lastReadLocation || 0}
        locationChanged={(epubcfi) => console.log(epubcfi)}
      />
    </div>
  );
};

Lecture.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired, // Assurez-vous que cette propriété correspond à ce que vous utilisez dans le reader
  }).isRequired,
};

export default Lecture;
