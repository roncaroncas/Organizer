import { useState, useEffect } from "react";
import { format, /*startOfMonth, endOfMonth, startOfWeek, endOfWeek, getISOWeek*/ } from "date-fns";
import { addDays, addMonths, addYears } from "date-fns";

import useFetch from "../../hooks/useFetch";
import useModal from "../../hooks/useModal";

import TempoForm from "./TempoForm";
import CalendarMonth from "./CalendarMonth";
import CalendarDay from "./CalendarDay";

interface TempoBase {
  name: string
  startTimestamp: Date
  endTimestamp: Date
  place: string
  fullDay: boolean
  description: string
  status: string
  parentId? : number
}

interface TempoRequest extends TempoBase {
  //
}

interface TempoResponse extends TempoBase {
  id: number
}

interface GridState {
  grid: "Month" | "Week" | "Day"
  param: number
  day: Date
}

type OnTempoClick = (tempo: Tempo) => void;
type OnNewTempoClick = () => void;


// ---------------------------------------------------------------

function CalendarGrid({
  isOpen,
  openModal,
  closeModal,
  selectedTempo,
  setSelectedTempo,
  resetSelectedTempo,
  tempos,
  setTempos,
  data,
  fetchData,
}){


  // ----   CONTROLE DO GRID ------ // 

  const [grid, setGrid] = useState<GridState>({
    grid: "Month",
    param: -1,
    day: new Date(Date.now())
  })

  function setGridAsDay (day: Date):void {
    setGrid({
      grid: "Day",
      param: 0,
      day: new Date (day),
    })
    return
  }

  function setGridAsMonth():void {
    let month = grid.day.getMonth()
    setGrid({
      grid: "Month",
      param: month,
      day: new Date (grid.day),
    })
    return
  }

  function changeDay(delta: number) {
    setGrid((prev) => {
      return {...prev, day: addDays(prev.day, delta)}
    });
  }

  function changeMonth(delta: number) {
    setGrid((prev) => {
      return {...prev, day: addMonths(prev.day, delta)}
    });
  }

  function changeYear(delta: number) {
    setGrid((prev) => {
      return {...prev, day: addYears(prev.day, delta)}
    });
  }

  // ------- EVENT HANDLERS -----

  const onTempoClick:OnTempoClick = (tempo: Tempo) => {
    setSelectedTempo(tempo)
    openModal();
  }

  const onNewTempoClick:OnNewTempoClick = () => { 
    resetSelectedTempo()
    openModal()
  }

 // ------------------

  const GridPreHeader = () => {   // ISSO AQUI NEM TINHA QUE EXISTIR IRMOES!

    const monthNumberToLabelMap = [
      'JAN', 'FEV', 'MAR',
      'ABR', 'MAI', 'JUN',
      'JUL', 'AGO', 'SET',
      'OUT', 'NOV', 'DEZ',
    ]

    return (
      <div className="card-container">
        <h1 style={{ margin: "0px 0px 0px 20px", textAlign: "left", display: "flex", gap: "40px", fontSize: "2em" }}>
          {/* Year Section */}
          <div style={{ display: "flex", width: "100px", alignItems: "center" }}>
            <span>{grid.day.getFullYear()}</span>
            <div style={{ display: "flex", flexDirection: "column", marginLeft: "30px", fontSize: "0.5em", alignItems: "center" }}>
              <span onClick={() => changeYear(+1)} style={{ cursor: "pointer" }}>+</span>
              <span onClick={() => changeYear(-1)} style={{ cursor: "pointer" }}>-</span>
            </div>
          </div>

          {/* Month Section with Fixed Width */}
          <div style={{ display: "flex", alignItems: "center"}}>
            <span onClick={() => setGridAsMonth()} style={{ width: "140px", textAlign: "center",  cursor: "pointer"  }}>
              {monthNumberToLabelMap[grid.day.getMonth()]}
            </span>
            <div style={{ display: "flex", flexDirection: "column", marginLeft: "10px", fontSize: "0.5em", alignItems: "center" }}>
              <span onClick={() => changeMonth(+1)} style={{ cursor: "pointer" }}>+</span>
              <span onClick={() => changeMonth(-1)} style={{ cursor: "pointer" }}>-</span>
            </div>
          </div>
        </h1>
      </div>  
    )

  }



  const GridHeader = () => {

    // ------ HEADER ----------- //

    let headerContent;

    if (grid.grid === "Month") {
      headerContent = (
        <>
          <div key="weekHeader" className="calendar-header">
            <p>Week</p>
          </div>

          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((name) => (
            <div key={"weekHeader" + name} className="calendar-header">
              <p>{name}</p>
            </div>
          ))}
        </>

      );
    } else if (grid.grid === "Day") {
      headerContent = (
        <div key="dayHeader" className="calendar-header col-08">
          <h2>
            <span onClick={() => changeDay(-1)}> - </span>
            {format(grid.day, "dd/MM/yyyy")}
            <span onClick={() => changeDay(+1)}> + </span>
          </h2>
        </div>        
      );
    }
    
    return (
      <>
        {headerContent}
      </>
    )
  };

  const GridBody = () => {
    return(
    grid.grid == "Month"?
        <CalendarMonth grid={grid} tempos={tempos} onTempoClick={onTempoClick} setGridAsDay={setGridAsDay} onNewTempoClick={onNewTempoClick}/>
        : grid.grid == "Day"?
        <CalendarDay grid={grid} tempos={tempos} onTempoClick={onTempoClick} />
        :
        ""
    )
  }

  // --------------- DEBUG ------------------------ //
  // useEffect(() => {
  //   console.log("tempos:", tempos);
  // }, [tempos]);

  // useEffect(() => {
  //   console.log("grid:", grid);
  // }, [grid]);

  // useEffect(() => {
  //   console.log("SelectedTempo:", selectedTempo);
  // }, [selectedTempo]);


  // ----- RETURN -------- //

  return (
    <>
      {/* PRE-HEADER*/}
      <GridPreHeader/>  {/*ISSO AQUI NAO DEVIA EXISTIR PARÇA*/}

      <div className = "card-container">
        <div className = "calendar-container">

          {/*HEADER*/}
          <GridHeader />

          {/*BODY*/}            
          <GridBody />

        </div>
      </div>
    </>

  );
};

export default CalendarGrid;



