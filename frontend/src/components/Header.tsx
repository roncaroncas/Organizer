// import React from "react";
import {useNavigate, useLocation} from 'react-router-dom'

function Header ({removeCookie})  {

  let navigate = useNavigate()
  let locationPath = useLocation()["pathname"]


  function handleLogout () {
    console.log("Ai! fui clicado u.u")
    navigate(0)
    removeCookie("token", {path: '/'})
    
  }


  const menuPages = [["Home", "/home"], ["Friends", "/friends"], ["Calendar", "/calendar"], ["Profile", "/profile"]]

  let structuredMenu = menuPages.map( function (item) {

    if (locationPath == item[1]) {
      return (<li className="active" key={item[0]}><a href={item[1]}>{item[0]}</a></li>)
    } else {
      return (<li key={item[0]}><a href={item[1]}>{item[0]}</a></li>)
    }
  })


  return (
    <div className="header">

      <h1> <a href="/">Organizer</a> </h1>
      <nav>
      <ul className="menu">
        {structuredMenu}
      </ul>
      </nav>
      <nav>

      <ul className="logout">
        <li onClick={handleLogout}><a href="/">Logout</a></li>
      </ul>
      </nav>
        
    </div>
        
  );
};

export default Header;
