import {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom'

import Header from "../../components/Header";

import AllTasksTable from "./allTasksTable"


function Calendar ({ removeCookie })  {

///////////ADICIONAR TASK NOVA////////////////

  let navigate = useNavigate()

  const [taskName, setTaskName] = useState('')
  const [startTime, setStartTime] = useState<number>('')
  const [endTime, setEndTime] = useState<number>('')
  const [place, setPlace] = useState<string>('')
  const [withHour, setWithHour] = useState<bool>('')
  const [longDescription, setLongDescription] = useState<string>('')

  async function createTask(){

    let message = {
      'taskName': taskName,
      'startTime': startTime,
      'endTime': endTime,
      'place': place,
      'withHour': withHour,
    }
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
    console.log(task)
    return (
      <tr key={task[0]+Math.random()}>
        <td>{task[0]}</td>
        <td><a href={"/task/"+task[0]}>{task[1]}</a></td>
        <td>{task[2]}</td>
        <td>{task[3]}</td>
        <td>{task[4]}</td>
        <td>{task[5]}</td>
        <td>{task[6]}</td>
      </tr>
    )
  })


  /////////////Calendar GRID ///////////////////////////

  //// MONTH SELECTOR ////

  const [calendarDate, setCalendarDate] = useState<number>(new Date())

  let day1 = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 0)
  day1 = day1 - 86400*1000*day1.getDay()

  const monthNumberToLabelMap = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]


  function dateStr(date){
    return(
      date.getDate().toString().padStart(2, "0") + "/" +
      (date.getMonth()+1).toString().padStart(2, "0")  + "/" +
      date.getFullYear().toString()
    )
  }

  function handleClickDay(i: Date){

    console.log("me clicou u.U: " + i.toString())
    console.log(i)
    navigate("/calendar/" + i.getFullYear() +"/" + (i.getMonth()+1).toString().padStart(2, "0") + "/" + i.getDate().toString().padStart(2, "0"))
  }

  let calendarGrid = Array.from(Array(42).keys()).map(function (i){

    let d = new Date(i*86400*1000+day1)  
    let dStr = dateStr(d)

    if (d.getMonth() == calendarDate.getMonth()) {

      return (        
        <div key={dateStr(d)} className="dayInMonthCal">

          <div onClick={() => handleClickDay(d)}>
            {dStr}
          </div>

          <div onClick={() => console.log("Voce quer adicionar tarefa do dia: " + dStr)}>
            <a> (+) </a>
          </div>

        </div>
      )
    } else {
      return (        
        <div key={dateStr(d)} className="dayOutMonthCal">

          <div onClick={() => handleClickDay(d)}>
            {dStr}
          </div>

          <div onClick={() => console.log("Voce quer adicionar tarefa do dia: " + dStr)}>
            <a> (+) </a>
          </div>

        </div>
      )
    }
  })

  return (
    <div>

      <Header removeCookie={removeCookie}/>
      <br/>

      {/*COLUNA2      */}
      <h1> Calendar </h1>
      <h2> {calendarDate.getFullYear()} </h2>
      <h2> {monthNumberToLabelMap[calendarDate.getMonth()]} </h2>
      <div className = "calendarGrid">
        <div key="Dom" className="header"><p>D</p></div>
        <div key="Seg" className="header"><p>S</p></div>
        <div key="Ter" className="header"><p>T</p></div>
        <div key="Qua" className="header"><p>Q</p></div>
        <div key="Qui" className="header"><p>Q</p></div>
        <div key="Sex" className="header"><p>S</p></div>
        <div key="Sáb" className="header"><p>S</p></div>
        {calendarGrid}
      </div>
      <br/>
      
      {/*COLUNA3      */}
      <AllTasksTable/>
      <br/>

      <div className = "centralized-button">
        <form>
          <input placeholder="taskName" onChange={(e) => setTaskName(e.target.value)}></input>
          <br/>
          <input placeholder = "startTime" onChange={(e) => setStartTime(e.target.value)}></input>
          <br/>
          <input placeholder = "endTime" onChange={(e) => setEndTime(e.target.value)}></input>
          <br/>
          <input placeholder = "place" onChange={(e) => setPlace(e.target.value)}></input>
          <br/>
          <input placeholder = "withHour" onChange={(e) => setWithHour(e.target.value)}></input>
          <br/>
          <input placeholder = "longDescription" onChange={(e) => setLongDescription(e.target.value)}></input>
          <br/>
          <button onClick={handleSubmit}>Adicionar</button>
          <br/>
        </form>
      </div>  
      <br/>
   
    </div>

  );
};

export default Calendar;
