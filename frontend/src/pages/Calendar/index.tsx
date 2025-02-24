// import {useEffect, useState} from "react";
// import {useNavigate} from 'react-router-dom'

import Header from "../../components/Header";

import AllTasksTable from "./AllTasksTable"
import CalendarGrid from "./CalendarGrid"
import AddNewTask from "./AddNewTask"

function Calendar ({ removeCookie }:{removeCookie:any})  {

  return (
    <div>

      <Header removeCookie={removeCookie}/>
      <br/>

      <CalendarGrid/>
      <br/>
      
      {/*COLUNA3      */}
      <AllTasksTable/>
      <br/>

      <AddNewTask/>
      <br/>
   
    </div>

  );
};

export default Calendar;
