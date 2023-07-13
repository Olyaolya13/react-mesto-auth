import { useEffect, useState } from 'react';
import logo from '../images/logo/logo.svg';
import { Link, useLocation } from 'react-router-dom';

function Header({ email, onLogout }) {
  const { pathname } = useLocation();
  const [linkPath, setLinkPath] = useState('');
  const [linkText, setLinkText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoVisible, setIsLogoVisible] = useState(true);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setIsLogoVisible(true);
    setIsMenuOpen(false);
    onLogout();
  };

  useEffect(() => {
    if (pathname === '/sign-in') {
      setLinkPath('/sign-up');
      setLinkText('Регистрация');
    } else {
      setLinkPath('/sign-in');
      setLinkText(email ? 'Выйти' : 'Войти');
    }
  }, [pathname, email]);

  useEffect(() => {
    if (isMenuOpen && email) {
      setIsLogoVisible(false);
    } else {
      setIsLogoVisible(true);
    }
  }, [isMenuOpen, email]);

  return (
    <header className={`header ${isMenuOpen ? 'header__menu-open' : ''}`}>
      {isLogoVisible && (
        <img
          className={`header__logo ${isMenuOpen ? 'header__logo-hidden' : ''}
          } `}
          alt="логотип Место"
          src={logo}
        />
      )}

      {email ? (
        <div className="header__burger header__burger-flex header__burger-menu">
          <input
            className="header__menu-input header__menu__toggle"
            id="header__menu__toggle"
            type="checkbox"
            checked={isMenuOpen}
            onChange={handleMenuToggle}
          />
          <label className="header__menu__btn" htmlFor="header__menu__toggle">
            <span></span>
          </label>
          <ul className={`header__menu header__menu__box${isMenuOpen ? 'header__menu_open' : ''} `}>
            <li className="header__menu-item">
              <p className="register__subtitle">{email}</p>
            </li>
            <li className="header__menu-item register__click">
              <Link
                className="register__subtitle register__subtitle-burger register__login-link"
                to={linkPath}
                onClick={handleLogout}
              >
                Выйти
              </Link>
            </li>
          </ul>
        </div>
      ) : (
        <div className="register__main">
          <Link className="register__subtitle register__login-link " to={linkPath}>
            {linkText}
          </Link>
        </div>
      )}
      {isMenuOpen && !isLogoVisible && (
        <div className="header__flex header__logo-bottom">
          <img className="header__logo" alt="логотип Место" src={logo} />
        </div>
      )}
    </header>
  );
}

export default Header;
