import React from "react";
import {useNavigate} from 'react-router-dom'




function Header ({setToken})  {

  let navigate = useNavigate()

  function handleClick () {
    console.log("Ai! fui clicado")
    localStorage.removeItem("token")
    navigate(0)
  }

  return (
    <div>
      <div className="topnav"> 
        <h1>
          <span className="active" href="#home">Home</span>
          <span href="#news">Friends</span>
          <span href="#contact">Calendar</span>

          <span href="#profile">Profile</span>

          <div onClick={handleClick}>
            <span>Logout</span>
          </div>

        </h1>
        <br/>
      </div>
        
    </div>
        
  );
};

export default Header;
