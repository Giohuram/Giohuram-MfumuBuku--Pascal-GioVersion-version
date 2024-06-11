import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBarsStaggered, FaXmark } from "react-icons/fa6";
import { UserContext } from '../Context/userContext'; 
import axios from 'axios';

const LibrairieNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:3005/auth/logout', {}, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        updateUser({
          username: '',
          email: '',
          schoolLevel: '',
          avatar: ''
        });
        navigate('/');
      } else {
        console.error('Erreur lors de la déconnexion');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  };

  return (
    <header>
      <nav className={`py-6 px-4 md:px-24 ${isSticky ? "fixed top-0 right-0 left-0 bg-[#DC7211]" : "bg-[#DC7211]"} w-full z-50 transition-all duration-300`}>
        <div className='flex justify-between items-center'>
          <Link to="/" className='text-white font-semibold flex items-center gap-1'>
            <img src="/Mfumu-logo.png" alt="Logo" className="h-8 w-8" />
            <span>MfumuBuku Kids</span>
          </Link>

          <div className='md:hidden'>
            <button onClick={toggleMenu}>
              {isMenuOpen ? <FaXmark className="h-5 w-5 text-white" /> : <FaBarsStaggered className="h-5 w-5 text-white" />}
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-12">
            <Link to="/Librairie" className="text-white hover:bg-black hover:text-[#DC7211] px-3 py-2 rounded-md text-sm font-medium">
              Bibliothèque
            </Link>
            <Link to="/MyBooks" className="text-white hover:bg-black hover:text-[#DC7211] px-3 py-2 rounded-md text-sm font-medium">
              Ma Collection
            </Link>
            <Link to="/UserProfilePage" className="text-white hover:bg-black hover:text-[#DC7211] px-3 py-2 rounded-md text-sm font-medium">
              Mon Compte
            </Link>
            <button onClick={handleLogout} className="text-white hover:bg-black hover:text-[#DC7211] px-3 py-2 rounded-md text-sm font-medium">
              Déconnexion
            </button>
            <div className="flex items-center">
              <img src={user.avatar} alt="Avatar" className="h-8 w-8 rounded-full" />
              <div className="ml-2">
                <div className="text-white">{user.username}</div>
                <div className="text-gray-300 text-sm">{user.schoolLevel}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu pour les appareils mobiles */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-[#DC7211] rounded-lg shadow-lg p-4">
            <ul className="flex flex-col text-white space-y-4">
              <li>
                <Link to="/Librairie" className="block py-2 px-4 hover:bg-black hover:text-[#DC7211] rounded-md" onClick={() => setIsMenuOpen(false)}>Bibliothèque</Link>
              </li>
              <li>
                <Link to="/MyBooks" className="block py-2 px-4 hover:bg-black hover:text-[#DC7211] rounded-md" onClick={() => setIsMenuOpen(false)}>Ma Collection</Link>
              </li>
              <li>
                <Link to="/MonCompte" className="block py-2 px-4 hover:bg-black hover:text-[#DC7211] rounded-md" onClick={() => setIsMenuOpen(false)}>Mon Compte</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="block py-2 px-4 hover:bg-black hover:text-[#DC7211] rounded-md">Déconnexion</button>
              </li>
              <li className="flex items-center">
                <img src={user.avatar} alt="Avatar" className="h-8 w-8 rounded-full" />
                <div className="ml-2">
                  <div className="text-white">{user.username}</div>
                  <div className="text-gray-300 text-sm">{user.schoolLevel}</div>
                </div>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default LibrairieNavBar;
