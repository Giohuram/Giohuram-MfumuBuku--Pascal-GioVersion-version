import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3005',
});

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    username: '',
    email: '',
    schoolLevel: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const fetchUserData = async (userId, token) => {
    console.log('Fetching user data for userId:', userId);
    try {
      const response = await axiosInstance.get(`/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      console.log('Server response:', response.data); // Log the server response
      if (response.data) {
        updateUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      handleAxiosError(error);
      setIsAuthenticated(false);
    }
  };

  const handleAxiosError = (error) => {
    if (error.response) {
      console.error('Server responded with a status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up the request:', error.message);
    }
    console.error('Axios error config:', error.config);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token); // Decode token to extract user ID
      console.log('Decoded token:', decoded);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      if (decoded && decoded.id) {
        fetchUserData(decoded.id, token); // Use decoded user ID
      } else {
        console.error('Decoded token does not contain user ID');
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const updateUser = (userData) => {
    console.log('Updating user data:', userData);
    setUser({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      schoolLevel: userData.schoolLevel,
      avatar: userData.avatar,
    });
    setIsAuthenticated(!!userData.id);
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const decoded = jwtDecode(token); // Decode token to get user ID
        console.log('Decoded token:', decoded);
        if (decoded && decoded.id) {
          fetchUserData(decoded.id, token); // Fetch user data with the decoded ID
        } else {
          console.error('Decoded token does not contain user ID');
        }
        setIsAuthenticated(true);
      } else {
        console.error('Token not received. Please try again.');
      }
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    axiosInstance.defaults.headers.common['Authorization'] = null;
    updateUser({
      id: null,
      username: '',
      email: '',
      schoolLevel: '',
      avatar: '',
    });
    setIsAuthenticated(false);
  };

  const addFavorite = async (bookId) => {
    try {
      const userId = user.id;
      console.log('Adding favorite with userId:', userId, 'and bookId:', bookId);

      if (!userId || !bookId) {
        throw new Error('User ID and Book ID are required.');
      }

      const response = await axiosInstance.post('http://localhost:3005/Book/favorites', { userId, bookId });
      if (response.status === 201) {
        const updatedFavorites = [...favorites, response.data.book];
        setFavorites(updatedFavorites);
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      console.log('Error details:', error.response ? error.response.data : error.message);
    }
  };

  const getFavorites = async (userId) => {
    try {
      const response = await axiosInstance.get(`http://localhost:3005/Book/favorites/${userId}`);
      if (response.status === 200) {
        setFavorites(response.data);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  return (
    <UserContext.Provider value={{
      user, setUser, loading, isAuthenticated, login, logout, favorites, addFavorite, getFavorites, updateUser, fetchUserData
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);

export { UserContext, UserContextProvider };
