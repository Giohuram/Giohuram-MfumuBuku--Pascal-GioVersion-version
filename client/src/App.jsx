// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import SignUp from './components/SignUp';
import NavBar from './components/NavBar';
import LandingPage from './LandingPage/Landingpage';
import Librairie from './Pages/Librairie';
import MyLibrary from './LibraryPages/MyLibrary';
import ReadingClub from './LibraryPages/ReadingClub';
import Subscription from './LibraryPages/Subscription';
import MyProfile from './LibraryPages/MyProfile';
import Lecture from './SpecificComponent/Lecture';
import { BookProvider } from '../src/Context/BookContext';
import { MyBooksProvider } from '../src/Context/MyBooksContext';
import LectureAudio from './SpecificComponent/LectureAudio';
import ParentalControl from './SpecificComponent/ParentalControl';
import StatLecture from './LibraryPages/StatLecture';
import SingleBook from './Pages/SingleBook';
// import {UserContextProvider} from './Context/userContext';
import Banner from './SharedComponents/Banner';
import ResetPassword from './Utils/ResetPassword';
import ForgotPassword from './Utils/ForgotPassword';
import UserProfilePage from './SpecificComponent/UserProfilePage';
import ModalAbonnement from './SpecificComponent/ModalAbonnement';
import PaymentPage from './Utils/PaymentPage';
import MyBooks from './LibraryPages/MyBooks'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  

  return (
    <BookProvider>
      <MyBooksProvider>
        <Router>
          <>
            {!(window.location.pathname.includes('/librairie') || window.location.pathname.includes('/MyLibrary') || window.location.pathname.includes('/MyBooks') || window.location.pathname.includes('/ReadingClub') || window.location.pathname.includes('/UserProfilePage') || window.location.pathname.includes('/ParentalControl') || window.location.pathname.includes('/StatLecture')|| window.location.pathname.includes('/ModalAbonnement') || window.location.pathname.includes('/Subscription') || window.location.pathname.includes('/SingleBook') || window.location.pathname.includes('/LectureAudio') || window.location.pathname.includes('/Lecture') || window.location.pathname.includes('/book/:id') || window.location.pathname.includes('/MyProfile')) && <NavBar isLoggedIn={isLoggedIn} />}
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/librairie" element={isLoggedIn ? <Librairie /> : <Navigate to="/login" />} />
              <Route path="/MyLibrary" element={<MyLibrary />} />
              <Route path="/Lecture" element={< Lecture />} />
              <Route path="/LectureAudio" element={ < LectureAudio />} />  
              <Route path="/ReadingClub" element={<ReadingClub />} />
              <Route path="/UserProfilePage" element={<UserProfilePage />}/>
              <Route path="/MyProfile" element={<MyProfile />} />
              <Route path="/ParentalControl" element={<ParentalControl />} />
              <Route path="/Subscription" element={<Subscription />} />
              <Route path="/ModalAbonnement" element={<ModalAbonnement />} />
              <Route path="/StatLecture" element={<StatLecture />} />
              <Route path="/Book/:id" element={<SingleBook />} />
              <Route path="/MyProfile" element={<MyProfile />} />
              <Route path="/PaymentPage" element={<PaymentPage />} />
              <Route path="/MyBooks" element={<MyBooks />} />
              <Route path="/" element={<Banner />} />
              <Route path="/ResetPassword" element={<ResetPassword />} />
              <Route path="/ForgotPassword" element={<ForgotPassword />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
      
        </Router>
    </MyBooksProvider>
   </BookProvider>  
  );
}

export default App;
