import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Context/userContext';
import axios from 'axios';
import '../Styles/ParentalControl.css';

const ParentalControl = () => {
  const { user } = useContext(UserContext);
  const [parentalControl, setParentalControl] = useState(null);

  useEffect(() => {
    const fetchParentalControl = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/parental-controls/${user.id}`);
        setParentalControl(response.data);
      } catch (error) {
        console.error('Error fetching parental control:', error);
      }
    };
  
    fetchParentalControl();
  }, [user.id]);

  return (
    <div className="parental-control">
      <h2>Parental Control</h2>
      {parentalControl ? (
        <div>
          <p>Enabled: {parentalControl.isEnabled ? 'Yes' : 'No'}</p>
          <p>Allowed Start Time: {parentalControl.allowedStartTime}</p>
          <p>Allowed End Time: {parentalControl.allowedEndTime}</p>
        </div>
      ) : (
        <p>No parental control settings found.</p>
      )}
    </div>
  );
};

export default ParentalControl;
