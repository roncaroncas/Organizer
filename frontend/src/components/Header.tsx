import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

function Header({ removeCookie }) {
  let navigate = useNavigate();
  let locationPath = useLocation().pathname;
  const [openDropdown, setOpenDropdown] = useState(null);

  function handleLogout() {
    console.log('Ai! fui clicado u.u');
    navigate(0);
    removeCookie('token', { path: '/' });
  }

  function toggleDropdown(menu) {
    setOpenDropdown(openDropdown === menu ? null : menu);
  }

  return (
    <div className="header">
      <h1>
        <a href="/" style={{ color: 'white', textDecoration: 'none' }}>
          Organizer
        </a>
      </h1>
      <div className="menuContainer">
        <nav>
          <ul className="menu">
            <li className="menuItem" onClick={() => toggleDropdown('tasks')}>
              Tasks
              <ul className={`dropdown ${openDropdown === 'tasks' ? 'dropdownOpen' : ''}`}>
                <li><a href="/calendar" className="dropdownItem">Calendar</a></li>
                <li><a href="/taskGroups" className="dropdownItem">TaskGroups</a></li>
              </ul>
            </li>
            <li className="menuItem" onClick={() => toggleDropdown('friends')}>
              Friends
              <ul className={`dropdown ${openDropdown === 'friends' ? 'dropdownOpen' : ''}`}>
                <li><a href="/friends" className="dropdownItem">Friends</a></li>
                <li><a href="/friendGroups" className="dropdownItem">FriendGroups</a></li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
      <div className="rightSection">
        <a
          href="/profile"
          className="link"
        >
          Profile
        </a>
        <a
          href="/"
          onClick={handleLogout}
          className="link"
        >
          Logout
        </a>
      </div>
    </div>
  );
}

export default Header;
