import { useState, useEffect } from "react"
import { format } from "date-fns"
import { addDays, addMonths, addYears } from "date-fns"

import { useCalendarContext } from "../../context/CalendarContext"

import useFetch from "../../hooks/useFetch"
import useModal from "../../hooks/useModal"

import TempoForm from "./TempoForm"
import GridMonth from "./grid/GridMonth"
import GridWeek from "./grid/GridWeek"
import GridDay from "./grid/GridDay"

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
}

type OnTempoClick = (tempo: Tempo) => void
type OnNewTempoClick = () => void


// ---------------------------------------------------

function CalendarGrid(){

  const {
    refDate, setRefDate,
    isOpen, openModal, closeModal,
    grid, setGrid, setGridMode,
    selectedTempo, setSelectedTempo, resetSelectedTempo,
    openTempo,
    tempos, setTempos,
    data, fetchData,} = useCalendarContext()


  const GridHeader = () => {

    // ------ HEADER ----------- //

    let headerContent

    if (grid.mode === "Month") {
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

      )
    } else if (grid.mode === "Week") {
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
      )
    } else if (grid.mode === "Day") {
      headerContent = (
        <div key="dayHeader" className="calendar-header col-08">
          <span>{format(refDate, "dd/MM/yyyy")}</span>
        </div>        
      )
    }
    
    
    return (
      <> {headerContent} </>
    )
  }

  const GridBody = () => {

    const commonProps = {
      refDate,
      setRefDate,
      setGridMode,
      tempos,
      openTempo,
    }


    const modeComponents = {
      Month: <GridMonth {...commonProps} />,
      Day: <GridDay {...commonProps} />,
      Week: <GridWeek {...commonProps} />
    }

    return modeComponents[grid.mode] 
  }


  // ----- RETURN -------- //

  return (
    <>
    
      <div className = "calendar-container">

        {/*HEADER*/}
        <GridHeader />

        {/*BODY*/}            
        <GridBody />

      </div>
      
    </>

  )
}

export default CalendarGrid
