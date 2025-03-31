import { useState, useContext } from 'react'

// import { useCookies } from 'react-cookie';
import { CookieContext } from '../App';

import Notifications from "./Notifications";

import classNames from 'classnames'

function Header() {

 const { removeCookie } = useContext(CookieContext);
  const [openDropdown, setOpenDropdown] = useState<string>("");

  function handleLogout() {
    removeCookie('token');
  }

  function toggleDropdown(menu: string) {
    setOpenDropdown(openDropdown === menu ? "" : menu);
  }

  function handleMouseEnter(menu: string) {
    setOpenDropdown(menu);
  }

  function handleMouseLeave() {
    setOpenDropdown("");
  }

  // Define menu structure
  const menus = [
    {
      title: "Feed",
      key: "feed",
      links: [{ name: "Feed", href: "/feed" }]
    },
    {
      title: "Tasks",
      key: "tasks",
      links: [
        { name: "Calendar", href: "/calendar" },
        { name: "TaskGroups", href: "/taskGroups" }
      ]
    },
    {
      title: "Friends",
      key: "friends",
      links: [
        { name: "Friends", href: "/friends" },
        { name: "Groups", href: "/groups" }
      ]
    }
  ];

  // Right section dropdowns
  const rightMenus = [
    {
      title: "Notificações",
      key: "notificacoes",
      content: <Notifications />
    },
    {
      title: "User",
      key: "user",
      links: [
        { name: "Profile", href: "/profile" },
        { name: "Logout", action: handleLogout } // Logout as an action
      ]
    }
  ];

  return (
    <div className="header">
      <h1>
        <a href="/" style={{ color: 'white', textDecoration: 'none' }}>
          Tempo
        </a>
      </h1>
      <div className="menuContainer">
        <nav>
          <ul className="menu">
            {menus.map(({ title, key, links }) => (
              <li 
                key={key}
                className="menuItem"
                onClick={() => toggleDropdown(key)}
                onMouseEnter={() => handleMouseEnter(key)}
                onMouseLeave={handleMouseLeave}
              >
                {title}
                <ul className={classNames(["dropdown", openDropdown === key ? 'dropdownOpen' : ''])}>
                  {links.map(({ name, href }) => (
                    <li key={name}>
                      <a href={href} className="dropdownItem">{name}</a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Right Section */}
      <div className="rightSection">
        <ul className="menu">
          {rightMenus.map(({ title, key, links, content }) => (
            <li 
              key={key}
              className="menuItem"
              onClick={() => toggleDropdown(key)}
              onMouseEnter={() => handleMouseEnter(key)}
              onMouseLeave={handleMouseLeave}
            >
              {title}
              <ul className={classNames(["dropdown", openDropdown === key ? 'dropdownOpen' : ''])}>
                {links 
                  ? links.map(({ name, href, action }) => (
                      <li key={name}>
                        {action ? (
                          <a onClick={action} className="dropdownItem" style={{ cursor: 'pointer' }}>
                            {name}
                          </a>
                        ) : (
                          <a href={href} className="dropdownItem">{name}</a>
                        )}
                      </li>
                    )) 
                  : content}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Header;
