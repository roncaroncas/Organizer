import React from "react";

const Header = ({user}) => {
  return (
    <div>
      <div className="topnav"> 
        <h1>
          <span className="active" href="#home">Home</span>
          <span href="#news">Friends</span>
          <span href="#contact">Calendar</span>
          <span href="#profile">Profile</span>
        </h1>
        <br/>
      </div>

      <h3> {user.username} (Id) </h3>
            
    </div>
        
  );
};

export default Header;
