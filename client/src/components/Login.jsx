import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebook, FaApple, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useUserContext } from '../Context/useUserContext';

const Login = ({ setIsLoggedIn, setUserData }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useUserContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3005/auth/login', form);
      // console.log('Login response:', response.data);
      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        updateUser({ username: form.username });
        navigate('/librairie');
      } else {
        setError('Token non reçu. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          setError('Email ou mot de passe incorrect.');
        } else if (status === 400) {
          setError('Requête incorrecte. Veuillez vérifier vos informations.');
        } else {
          setError('Une erreur est survenue. Veuillez réessayer.');
        }
      } else {
        setError('Une erreur est survenue lors de la connexion.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="bg-[#DC7211] py-16 px-4 md:px-0 max-h-full">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Bienvenue chez Mfumu buku kids</h1>
          <div className="text-sm md:text-xl text-white mb-6">
            <p>Mfumu Buku Kids, votre destination préférée pour l'éducation littéraire de vos enfants ! Chez Mfumu Buku Kids, nous croyons fermement au pouvoir transformateur des livres pour enrichir l'esprit des enfants et stimuler leur imagination.</p>
            <p className='text-white'>Bonne lecture d’avance!</p>
          </div>
          <div className='text-center mt-5'>
            <form className="flex flex-col items-center" onSubmit={handleLogin}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full mb-4 p-2 rounded-lg border-2 border-gray-400"
                value={form.username}
                onChange={handleChange}
                disabled={isLoading}
              />
              <div className="relative w-full mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="w-full p-2 pr-10 rounded-lg border-2 border-gray-400"
                  value={form.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 bottom-2 mb-1"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="w-full flex justify-between items-center mb-4">
                <label className="text-white">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2"
                  />
                  Se souvenir de moi
                </label>
                <a href="/ForgotPassword" className="text-white">Mot de passe oublié?</a>
              </div>
              <button
                type="submit"
                className={`bg-black text-white font-bold py-2 px-4 rounded mr-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
            <div className='mt-3'>
              <p>Vous n'avez pas de compte? veuillez vous inscrire <a href='/signup' className='text-white'>ici</a></p>
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
        <div className="md:w-1/2 md:pl-8 mt-8 md:mt-0">
          <img src="/login-pic.png" alt="Image" className="w-full" />
        </div>
      </div>
    </div>
  );
}

export default Login;
