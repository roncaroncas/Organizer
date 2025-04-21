import { useState, useEffect, useContext, createContext } from "react"
import { format } from "date-fns"

import { CalendarProvider, useCalendarContext } from "../../context/CalendarContext"

import Header from "../../components/Header"
import DraggableWrapper from "../../components/DraggableWrapper"
import SearchUserInput from "../../components/SearchUserInput"

// import AllTasksTable from "./AllTasksTable"
import CalendarTempos from "./CalendarTempos"
import CalendarGrid from "./CalendarGrid"
import Sidebar from "./Sidebar"

import Tempo from "../Tempo/index"

function Calendar () {

  // -------------------

  // Todas as definições de variáveis estão dentro do CalendarProvider (useContext CalendarContext)

  // -------------------

  return (
    <CalendarProvider>
      <CalendarContent />
    </CalendarProvider>
  )
}

function CalendarContent ()  {

  const {isOpen, closeModal, selectedTempo, resetSelectedTempo, fetchData} = useCalendarContext()
  
  return (
    <>
      <Header/>
      
      <div className="pagebody calendarbody">

        <div className="sidebar">
          <Sidebar/>
        </div>

        <div className="main-content">
          <CalendarGrid/>
        </div>
        
        <div id="modal-div" className={isOpen ? "modal-shown" : "modal-hidden"}>
          <DraggableWrapper>
            <Tempo
              key = {selectedTempo.id}
              id = {selectedTempo.id}
              onClose={() => {
                resetSelectedTempo()
                closeModal()
              }}
              triggerRender = {fetchData} // faz um fetch para atualizar dados e forçar update da tela
              loadedTempo = {selectedTempo}
            />
          </DraggableWrapper>
        </div>
      </div>
    </>
  )
}

export default Calendar
