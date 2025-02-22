import React from "react";
import {useNavigate, useLocation} from 'react-router-dom'


function Header ({removeCookie})  {

  let navigate = useNavigate()
  let locationPath = useLocation()["pathname"]

  function navigateToPage(path){
    navigate(path)
  }

  function handleLogout () {
    console.log("Ai! fui clicado u.u")
    navigate(0)
    removeCookie("token", {path: '/'})
    
  }


  const menuPages = [["Home", "/home"], ["Friends", "/friends"], ["Calendar", "/calendar"], ["Profile", "/profile"]]

  let structuredMenu = menuPages.map( function (item) {

    if (locationPath == item[1]) {
      return (<a key={item[0]} className="active">{item[0]}</a>)
    } else {
      return (<a key={item[0]} href={item[1]}>{item[0]}</a>)
    }
  })


  return (
    <div>
      <div className="topnav"> 
        <h1>

          {structuredMenu}

          <div onClick={handleLogout}>
            <a>Logout</a>
          </div>

        </h1>
        <br/>
      </div>
        
    </div>
        
  );
};

export default Header;
