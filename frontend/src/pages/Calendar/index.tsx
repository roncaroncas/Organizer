// import {useEffect, useState} from "react";
// import {useNavigate} from 'react-router-dom'

import { memo } from "react"

import Header from "../../components/Header"

// import AllTasksTable from "./AllTasksTable"
import CalendarTempos from "./CalendarTempos"
import CalendarGrid from "./CalendarGrid"
import SidebarLayout from "./SidebarLayout"


// TODO: MODAL E CONTROLE DE MODAL TEM QUE VIR PARA ESSE NIVEL!!!!

function Calendar ()  {

  return (
    <div>
      <Header/>
      <div className="pagebody calendarbody">
        <div className="sidebar">
          <SidebarLayout/>
        </div>

        <div className="main-content">
          <CalendarGrid/>
        </div>
        
      </div>
    {/*
      <div className="container">
        Apenas para debug!
        <AllTasksTable/>
      </div>
   */}
    </div>




  );
};

export default memo(Calendar);
