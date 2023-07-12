import { useEffect, useState } from 'react';
import logo from '../images/logo/logo.svg';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const { pathname } = useLocation();
  const [linkPath, setLinkPath] = useState('');
  const [linkText, setLinkText] = useState('');

  useEffect(() => {
    if (pathname === '/sign-in') {
      setLinkPath('/sign-up');
      setLinkText('Регистрация');
    } else {
      setLinkPath('/sign-in');
      setLinkText('Войти');
    }
  }, [pathname]);

  return (
    <header className="header">
      <img className="header__logo" alt="логотип Место" src={logo} />
      <Link className="register__subtitle register__login-link" to={linkPath}>
        {linkText}
      </Link>
    </header>
  );
}

export default Header;

// function Header({ isLoggedIn }) {
//   return (
//     <header className="header">
//       <img className="header__logo" alt="логотип Место" src={logo} />
//       {isLoggedIn ? (
//         <Link to="/sign-out" className="register__subtitle register__login-link">
//           Выйти
//         </Link>
//       ) : (
//         <>
//           <Link to="/sign-in" className="register__subtitle register__login-link">
//             Войти
//           </Link>
//           <Link to="/sign-up" className="register__subtitle register__login-link">
//             Регистрация
//           </Link>
//         </>
//       )}
//     </header>
//
//   );
// }

// export default Header;
