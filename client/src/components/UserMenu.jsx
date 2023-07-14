import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import './UserMenu.css'


function UserMenu({ isLoggedIn, setIsLoggedIn }) {
  const [sidebar, setSidebar] = useState(false);
  const toggleSidebar = () => {
    setSidebar(!sidebar);
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('jwtToken');
    sessionStorage.removeItem('username');
  };

  return (
    <>
      <div className='navbar'>

        <Link to='#' className='menu-bars' onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faUser} />
        </Link>
      </div>

      <nav className={sidebar ? 'user-menu active' : 'user-menu'}>
        {!isLoggedIn ? (
          <ul className='user-menu-items'>
            <li>
              <Link to='/registration' className='menu-bars' >Registration</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        ) : (<div  className='log-out'>
          <Link onClick={handleLogout}>logout</Link>
          <Link to={'/deleteAccount'}>delete account</Link>
        </div>
        )}

      </nav>
    </>
  );
}

export default UserMenu