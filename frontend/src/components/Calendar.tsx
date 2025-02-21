import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom'

import Header from "./Header";


function Calendar ({removeCookie})  {


  /////////////TABELA DE EVENTOS ///////////////////////////

  const [taskList, setTaskList] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/myTasks', {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          setTaskList(data['tasks'])
        })}, [])

  console.log('a' + taskList)

  let structuredTasks = taskList.map( function (task){
    return (
      <tr key={task[0]+Math.random()}>
        <td>{task[0]}</td>
        <td>{task[1]}</td>
        <td>{task[2]}</td>
        <td>{task[3]}</td>
      </tr>
    )
  })

  return (
    <div>

    <Header removeCookie={removeCookie}/>
    <br/>

    <table key="tableFriends">
      <thead>
        <tr>
          <th>Task_Id</th>
          <th>Task_Name</th>
          <th>Task_StartTime</th>
          <th>Task_EndTime</th>
        </tr>
      </thead>
      <tbody>
        {structuredTasks}
      </tbody>
    </table>

    </div>

  );
};

export default Calendar;
