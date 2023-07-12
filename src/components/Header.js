import { useEffect, useState } from 'react';
import logo from '../images/logo/logo.svg';
import { Link, useLocation } from 'react-router-dom';

function Header({ email, onLogout }) {
  const { pathname } = useLocation();
  const [linkPath, setLinkPath] = useState('');
  const [linkText, setLinkText] = useState('');

  useEffect(() => {
    if (pathname === '/sign-in') {
      setLinkPath('/sign-up');
      setLinkText('Регистрация');
    } else {
      setLinkPath('/sign-in');
      setLinkText(email ? 'Выйти' : 'Войти');
    }
  }, [pathname, email]);

  return (
    <header className="header">
      <img className="header__logo" alt="логотип Место" src={logo} />
      {email ? (
        <div className="register__user">
          <p className="register__subtitle">{email}</p>
          <Link className="register__subtitle  register__login-link" onClick={onLogout}>
            Выйти
          </Link>
        </div>
      ) : (
        <Link className="register__subtitle register__login-link" to={linkPath}>
          {linkText}
        </Link>
      )}
    </header>
  );
}

export default Header;

// function Header({ email, onLogout }) {
//   const { pathname } = useLocation();
//   const [linkPath, setLinkPath] = useState('');
//   const [linkText, setLinkText] = useState('');

//   useEffect(() => {
//     if (pathname === '/sign-in') {
//       setLinkPath('/sign-up');
//       setLinkText('Регистрация');
//     } else {
//       setLinkPath('/sign-in');
//       setLinkText('Войти');
//     }
//     else {
//       setLinkPath('/sign-in');
//       setLinkText('Выйти');
//     }
//   }, [pathname]);

//   return (
//     <header className="header">
//       <img className="header__logo" alt="логотип Место" src={logo} />
//       <Link className="register__subtitle register__login-link" to={linkPath}>
//         {linkText}
//       </Link>
//     </header>
//   );
// }

// export default Header;
