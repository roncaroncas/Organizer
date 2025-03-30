// import {useEffect, useState} from "react";
// import {useNavigate} from 'react-router-dom'

import { memo } from "react"; 

import Header from "../../components/Header";

// import AllTasksTable from "./AllTasksTable"
import CalendarTempos from "./CalendarTempos"
import CalendarGrid from "./CalendarGrid"
// import AddNewTask from "./AddNewTask"

function Calendar ()  {

  return (
    <div>

      <Header/>

      <div className="pagebody calendarbody">

        <div className = "leftcolumn">
          <div className ="full-container">

            <div>
              <h3> Blups </h3>
              <a>HEALTH</a> <br/>
              <a>GOODS</a> <br/>
              <a>EDUCATION</a> <br/>
              <a>WORK</a> <br/>
              <a>EXERCISES</a> <br/>
              <a>FOOD!</a> <br/>
            </div>
            <hr/>

            <CalendarTempos/>

            <hr/>
            
          </div>
        </div>
        <div className = "maincolumn">
          <div className ="full-container">
            <CalendarGrid/>
          </div>
        </div>
        
        <br/>

      </div>
      <br/>
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
