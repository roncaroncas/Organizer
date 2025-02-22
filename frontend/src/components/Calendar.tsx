import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom'

import Header from "./Header";


function Calendar ({removeCookie})  {

///////////ADICIONAR TASK NOVA//////////////////////////////

  const [taskName, setTaskName] = useState('')
  const [startTime, setStartTime] = useState<number>('')
  const [endTime, setEndTime] = useState<number>('')
  let navigate = useNavigate()

  async function createTask(){

    let message = {'taskName': taskName, 'startTime': startTime, 'endTime': endTime}
    console.log(message)
    const results = await fetch('http://localhost:8000/createTask', {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message)
    })
      .then(data => data.json())
    // .then(data => data.blabla)

    return results


  }


  async function handleSubmit(event) {

    event.preventDefault() //DEVE TER UM JEITO MELHOR DO QUE ISSO AQUI 
    const response = await createTask ()
    console.log(response)

    if (response) {
      console.log("Evento adicionado! :D")
    } else {
      console.log("Evento nao adicionado :(")
    }

    //jeito porco de atualizar a lista de tasks
    navigate(0)

  }


  /////////////TABELA DE TASKS ///////////////////////////

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

  
  let structuredTasks = taskList.map( function (task){
    return (
      <tr key={task[0]+Math.random()}>
        <td>{task[0]}</td>
        <td><a href={"/task/"+task[0]}>{task[1]}</a></td>
        <td>{task[2]}</td>
        <td>{task[3]}</td>
      </tr>
    )
  })

  return (
    <div>

    <Header removeCookie={removeCookie}/>
    <br/>

    <form onSubmit={handleSubmit} className = "loginform">
      <div>
        <p> Crie um evento! </p>
      </div>
      <label> Nome do Evento </label>
      <input type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
      <label> Início do Evento </label>
      <input type="number" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      <label> Final do Evento </label>
      <input type="number" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

      <div className = "centralized-button">
        <button type="submit">Adicionar!</button><br/>
      </div>
    </form>

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
