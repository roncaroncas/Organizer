import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

import Notifications from "./Notifications";

import classNames from 'classnames'

function Header({ removeCookie }) {
  let navigate = useNavigate();
  let locationPath = useLocation().pathname;
  const [openDropdown, setOpenDropdown] = useState(null);

  function handleLogout() {
    removeCookie('token', { path: '/' });
    navigate("/login");
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
            <li className="menuItem" onClick={() => toggleDropdown('feed')}>
              Feed
              <ul className = {classNames(["dropdown", openDropdown === 'feed' ? 'dropdownOpen' : ''])}>
                <li><a href="/feed" className="dropdownItem">Feed</a></li>
              </ul>
            </li>
            <li className="menuItem" onClick={() => toggleDropdown('tasks')}>
              Tasks
              <ul className = {classNames(["dropdown", openDropdown === 'tasks' ? 'dropdownOpen' : ''])}>
                <li><a href="/calendar" className="dropdownItem">Calendar</a></li>
                <li><a href="/taskGroups" className="dropdownItem">TaskGroups</a></li>
              </ul>
            </li>
            <li className="menuItem" onClick={() => toggleDropdown('friends')}>
              Friends
              <ul className= {classNames(["dropdown", openDropdown === 'friends' ? 'dropdownOpen' : ''])}>
                <li><a href="/friends" className="dropdownItem">Friends</a></li>
                <li><a href="/groups" className="dropdownItem">Groups</a></li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
      <div className="rightSection">

        <li className="menuItem" onClick={() => toggleDropdown('notificacoes')}>
          Notificações
          <ul className= {classNames(["dropdown", openDropdown === 'notificacoes' ? 'dropdownOpen' : ''])}>
            <Notifications/>
          </ul>
        </li>
        <a href="/profile" className="link">
          Profile
        </a>
        <a href="/" onClick={handleLogout} className="link">
          Logout
        </a>
      </div>
    </div>
  );
}

export default Header;
