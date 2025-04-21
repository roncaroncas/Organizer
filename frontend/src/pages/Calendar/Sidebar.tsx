import React, { useState } from "react";
import { format } from "date-fns";

import DateDisplayer from "./components/DateDisplayer";
import SidebarProfile from "./SidebarProfile"
import SidebarEras from "./SidebarEras"
import SidebarTempos from "./SidebarTempos"


const sections = [
  { key: "profile", title: "Profile", Component: SidebarProfile },
  { key: "eras", title: "Eras", Component: SidebarEras },
  { key: "tempos", title: "Tempo", Component: SidebarTempos },
];

function Sidebar(){

  const [expanded, setExpanded] = useState({
    profile: false,
    tempos: true,
    eras: false,
  })

  const toggle = (key) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <>
      <div className="sidebar-section">
        <DateDisplayer />
      </div>

      {sections.map(({ key, title, Component }) => (
        <div key={key} className="sidebar-section">
          <div className="section-header" onClick={() => toggle(key)}>
            <h3>{title}</h3>
          </div>
          {expanded[key] && (
            <div className="section-content">
              <Component />
            </div>
          )}
        </div>
      ))}
    </>
  );
}

export default Sidebar
