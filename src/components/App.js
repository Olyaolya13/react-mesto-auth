import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import CurrentUserContext from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ProtectedRoute from './ProtectedRoute';
import Popup from './PopupCloseEsc';
import success from '../images/logo/Union.svg';
import unsuccess from '../images/logo/Unsuccess.svg';

import { Navigate, Routes, Route, useNavigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import InfoTooltip from './InfoTooltip';
import * as auth from '../utils/auth';

function App() {
  const navigate = useNavigate();

  //popup
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState([]);
  const [isZoomPopupOpen, setIsZoomPopupOpen] = useState(false);
  const [isInfoTooltipSuccess, setIsInfoTooltipSuccess] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  //context
  const [currentUser, setCurrentUser] = useState({});
  //cards
  const [cards, setCards] = useState([]);
  // check isLoggedIn
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //user email
  const [email, setEmail] = useState('');
  //token
  function handleToken() {
    const token = localStorage.getItem('token');
    if (token) {
      return auth
        .checkToken(token)
        .then(res => {
          setEmail(res.email);
          setIsLoggedIn(true);
          navigate('/', { replace: true });
        })
        .catch(error => {
          console.log(error);
        });
    }
    return Promise.resolve();
  }

  useEffect(() => {
    handleToken();
  }, []);

  function handleOnRegister({ password, email }) {
    return auth
      .register(password, email)
      .then(res => {
        if (!res || res.error) {
          handleInfoTooltip(false);
        } else {
          handleInfoTooltip(true);
          navigate('/sign-in', { replace: true });
        }
        return res;
      })
      .catch(err => {
        console.error(err);
        handleInfoTooltip(false);
      });
  }

  //login
  function handleOnLogin({ password, email }) {
    return auth
      .login(password, email)
      .then(res => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          setIsLoggedIn(true);
          setEmail(email);
          navigate('/', { replace: true });
        }
      })
      .catch(err => {
        console.log(err);
        handleInfoTooltip(false);
      });
  }

  //logout
  function handleLogOut() {
    setIsLoggedIn(false);
    setEmail('');
    localStorage.removeItem('token');
    navigate('/sign-in', { replace: true });
  }

  // Open Edit Profile Popup
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  // Open Edit Avatar Popup
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  // Open Add Place Popup
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  // Open Zoom Popup with selected card
  function handleCardClick(card) {
    setSelectedCard(card);
    setIsZoomPopupOpen(true);
  }

  // Open Info Popup
  function handleInfoTooltip(isSuccess) {
    setIsInfoTooltipOpen(true);
    setIsInfoTooltipSuccess(isSuccess);
  }

  // Close all popups
  const closeAllPopups = useCallback(() => {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsZoomPopupOpen(false);
    setIsInfoTooltipOpen(false);
    setIsInfoTooltipSuccess(false);
  }, []);

  // Update user information
  function handleUpdateUser(userInfo) {
    api
      .editProfile(userInfo)
      .then(data => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Update user avatar
  function handleUpdateAvatar(avatar) {
    api
      .editAvatar(avatar)
      .then(data => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch(err => {
        console.log(err);
      });
  }
  //add card
  function handleAddPlace(newCard) {
    api
      .addNewCard(newCard)
      .then(card => {
        setCards(state => [card, ...state]);
        closeAllPopups();
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Handle like on a card
  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    {
      if (!isLiked) {
        api
          .addNewLike(card._id)
          .then(newCard => {
            setCards(state => state.map(c => (c._id === card._id ? newCard : c)));
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        api
          .removeLike(card._id)
          .then(newCard => {
            setCards(state => state.map(c => (c._id === card._id ? newCard : c)));
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }

  function handleConfirmDelete(card) {
    api
      .removeCard(card._id)
      .then(() => {
        setCards(state => state.filter(c => c._id !== card._id));
      })
      .catch(err => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (isLoggedIn) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([userInfo, initialCards]) => {
          setCurrentUser(userInfo);
          setCards(initialCards);
        })
        .catch(err => {
          console.log('Ошибка при получении информации:', err);
        });
    }
  }, [isLoggedIn]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header email={email} isLoggedIn={isLoggedIn} onLogout={handleLogOut} />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute
              element={Main}
              isLoggedIn={isLoggedIn}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleConfirmDelete}
            />
          }
        />
        <Route path="/sign-up" element={<Register onRegister={handleOnRegister} />} />
        <Route path="/sign-in" element={<Login onLogin={handleOnLogin} />} />

        <Route
          path="*"
          element={isLoggedIn ? <Navigate to="/" replace /> : <Navigate to="/sign-in" replace />}
        />
      </Routes>
      {isLoggedIn && <Footer />}

      <Popup onClose={closeAllPopups}>
        <EditProfilePopup
          isPopupOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <EditAvatarPopup
          isPopupOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <AddPlacePopup
          isPopupOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlace}
        />
        <PopupWithForm
          name="question-popup"
          title="Вы уверены"
          button="Да"
          onClose={closeAllPopups}
        />

        <ImagePopup card={selectedCard} isPopupOpen={isZoomPopupOpen} onClose={closeAllPopups} />
        <InfoTooltip
          onClose={closeAllPopups}
          isPopupOpen={isInfoTooltipOpen}
          text={
            isInfoTooltipSuccess
              ? 'Вы успешно зарегистрировались!'
              : 'Что-то пошло не так! Попробуйте ещё раз.'
          }
          image={isInfoTooltipSuccess ? success : unsuccess}
        />
      </Popup>
    </CurrentUserContext.Provider>
  );
}

export default App;
