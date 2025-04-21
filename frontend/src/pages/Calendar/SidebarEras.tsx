import { useState } from "react";

import { useCalendarContext } from "../../context/CalendarContext"


function SidebarEras() {

  const {selectedEra, setSelectedEra, eras} = useCalendarContext(); 

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {eras.map((option) => (
        <li key={option}>
          <button
            onClick={() => setSelectedEra(option)}
            style={{
              width: "100%",
              padding: "0.4em 1em",
              borderRadius: "5px",
              border: "1px solid #ccc",
              backgroundColor: selectedEra === option ? "#ffa500" : "#f0f0f0",
              color: selectedEra === option ? "#fff" : "#333",
              fontWeight: selectedEra === option ? "bold" : "normal",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
          >
            {option}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default SidebarEras;
