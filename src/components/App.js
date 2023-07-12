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
import { Routes, Route, useNavigate } from 'react-router';
import { BrowserRouter, Navigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import InfoTooltip from './InfoTooltip';
import * as auth from '../utils/auth';

function App() {
  //popup
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState([]);
  const [isZoomPopup, setIsZoomPopup] = useState(false);
  const [isQuestionPopupOpen, setIsQuestionPopupOpen] = useState(false);
  //context
  const [currentUser, setCurrentUser] = useState({});
  //cards
  const [cards, setCards] = useState([]);

  const navigate = useNavigate;

  // попап успешного входа
  const [isInfoTolltipSuccess, setIsInfoTolltipSuccess] = useState(false);
  const [isInfoTolltipOpen, setIsInfoTolltipOpen] = useState(false);

  // check
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  //token
  function handleToken() {
    const token = localStorage.getItem('token');
    if (token) {
      auth
        .getContent(token)
        .then(res => {
          setEmail(res.data.email);
          setIsLoggedIn(true);
          navigate('/');
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  useEffect(() => {
    handleToken();
  }, []);

  function handleOnRegister({ password, email }) {
    return auth
      .register(password, email)
      .then(res => {
        if (password && email) {
          handleInfoTolltip(false);
        } else {
          handleInfoTolltip(true);
          navigate('/sign-in', { replace: true });
        }
        return res;
      })
      .catch(err => console.error(err))
      .finally(() => {
        handleInfoTolltip(true);
      });
  }

  //login
  function handleOnLogin({ password, email }) {
    return auth
      .login(password, email)
      .then(res => {
        if (password && email) {
          setEmail(email);
          setIsLoggedIn(true);
          handleInfoTolltip(true);
          localStorage.setItem('token', res.token);
          navigate('/', { replace: true });
        }
      })
      .catch(err => {
        console.log(err);
        handleInfoTolltip(false);
      });
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
    setIsZoomPopup(true);
  }
  // Open Question Popup
  function handleQuestionPopupOpen() {
    setIsQuestionPopupOpen(true);
  }
  // Open Info Popup
  function handleInfoTolltip(isSuccess) {
    setIsInfoTolltipOpen(true);
    setIsInfoTolltipSuccess(isSuccess);
  }

  // Close all popups
  const closeAllPopups = useCallback(() => {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsZoomPopup(false);
    setIsQuestionPopupOpen(false);
    setIsInfoTolltipOpen(false);
    // setIsInfoTolltipSuccess({ isSuccess: false });
  }, []);
  // Close popups when clicking outside the popup
  const handleWindowCloseClick = useCallback(
    evt => {
      if (evt.target === evt.currentTarget) {
        closeAllPopups();
      }
    },
    [closeAllPopups]
  );
  // Close popups when pressing the Escape key
  function handleEscKey(event) {
    if (event.key === 'Escape') {
      closeAllPopups();
    }
  }

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

  //delete card
  function handleCardDelete() {
    handleQuestionPopupOpen();
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
    const handleEscKey = event => {
      if (event.key === 'Escape') {
        closeAllPopups();
      }
    };
    if (
      isEditProfilePopupOpen ||
      isAddPlacePopupOpen ||
      isEditAvatarPopupOpen ||
      isZoomPopup ||
      isQuestionPopupOpen ||
      isInfoTolltipOpen
    )
      document.addEventListener('keydown', handleEscKey);
    else document.removeEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [
    isEditProfilePopupOpen,
    isAddPlacePopupOpen,
    isEditAvatarPopupOpen,
    isZoomPopup,
    isQuestionPopupOpen,
    isInfoTolltipOpen,
    closeAllPopups
  ]);

  useEffect(
    isLoggedIn => {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([userInfo, initialCards]) => {
          setCurrentUser(userInfo);
          setCards(initialCards);
        })
        .catch(err => {
          console.log('Ошибка при получении информации:', err);
        });
    },
    [isLoggedIn]
  );

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/sign-up" element={<Register onRegister={handleOnRegister} />} />
            <Route path="/sign-in" element={<Login onLogin={handleOnLogin} />} />
            <Route
              path="/"
              element={
                isLoggedIn ? <Navigate to="/sign-up" replace /> : <Navigate to="/sign-in" replace />
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute
                  element={Main}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleConfirmDelete}
                  onQuestuon={handleCardDelete}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
          </Routes>
          <ProtectedRoute element={Footer} />
        </BrowserRouter>

        <EditProfilePopup
          isPopupOpen={isEditProfilePopupOpen}
          onClose={handleWindowCloseClick}
          onUpdateUser={handleUpdateUser}
        />

        <EditAvatarPopup
          isPopupOpen={isEditAvatarPopupOpen}
          onClose={handleWindowCloseClick}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <AddPlacePopup
          isPopupOpen={isAddPlacePopupOpen}
          onClose={handleWindowCloseClick}
          onAddPlace={handleAddPlace}
        />
        <PopupWithForm
          name="question-popup"
          title="Вы уверены"
          button="Да"
          onClose={handleWindowCloseClick}
        />

        <ImagePopup
          card={selectedCard}
          isPopupOpen={isZoomPopup}
          onClose={handleWindowCloseClick}
        />
        <InfoTooltip
          onClose={handleWindowCloseClick}
          isPopupOpen={isInfoTolltipOpen}
          isSuccess={isInfoTolltipSuccess.isSuccess}
        />
      </>
    </CurrentUserContext.Provider>
  );
}

export default App;
