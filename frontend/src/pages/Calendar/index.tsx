// import {useEffect, useState} from "react";
// import {useNavigate} from 'react-router-dom'

import Header from "../../components/Header";

import AllTasksTable from "./AllTasksTable"
import CalendarGroups from "./CalendarGroups"
import CalendarGrid from "./CalendarGrid"
// import AddNewTask from "./AddNewTask"

function Calendar ({ removeCookie }:{removeCookie:any})  {

  return (
    <div>


      <Header removeCookie={removeCookie}/>
      <br/>

      <div className="pagebody calendarPage">

        <div className ="column1 container">

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

          <CalendarGroups/>

          <hr/>
          
        </div>

        <div className ="column2 container">
          <CalendarGrid/>
        </div>

        {/*<AddNewTask/>
        <br/>*/}
        
        {/*COLUNA3      */}

      </div>
      <br/>
      <div className="container">
        <AllTasksTable/>
      </div>

   
    </div>

  );
};

export default Calendar;
