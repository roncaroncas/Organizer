import React, { useState } from "react";

import CalendarTempos from "./CalendarTempos"

const SidebarLayout = () => {
  const [expanded, setExpanded] = useState({
    profile: false,
    tempos: true,
    addons: false,
  });

  const toggle = (section) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (

      <>
        <div className = "sidebar-section">
          <div className = "section-header" onClick={() => toggle("profile")}>
            <h3>PROFILE (Clickable)</h3>
          </div>
          {expanded.profile && (
            <div className="section-content">
              Profile content goes here...
            </div>
          )}
        </div>

        <div className = "sidebar-section">
          <div className = "section-header" onClick={() => toggle("addons")}>
            <h3> Blups (Clickable)</h3>
          </div>
          {expanded.addons && (
            <div className="section-content">
              <a>HEALTH</a> <br/>
              <a>GOODS</a> <br/>
              <a>EDUCATION</a> <br/>
              <a>WORK</a> <br/>
              <a>EXERCISES</a> <br/>
              <a>FOOD!</a> <br/>
            </div>
          )}        
        </div>        

        <div className = "sidebar-section">
          <div className = "section-header" onClick={() => toggle("tempos")}>
            <h3> TEMPO (Clickable) </h3>
          </div>
        
          {expanded.tempos && (
            <div className="section-content">
              <CalendarTempos/> 
            </div>
          )}
        </div>

        
      </>
  );
};

export default SidebarLayout;
