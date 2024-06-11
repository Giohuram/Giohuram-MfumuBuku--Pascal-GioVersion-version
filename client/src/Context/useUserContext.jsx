// useUserContext
import { useContext } from 'react';
import { UserContext } from '../Context/userContext';

export const useUserContext = () => {
  return useContext(UserContext);
};
