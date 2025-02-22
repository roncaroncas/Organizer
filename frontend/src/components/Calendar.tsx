import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom'

import { Box, Button, Container, Flex, Stack, Text, 
  Input, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot,
  DialogTitle, DialogTrigger, DialogActionTrigger} from "@chakra-ui/react";

import Header from "./Header";


function Calendar ({removeCookie})  {

///////////ADICIONAR TASK NOVA//////////////////////////////

  let navigate = useNavigate()

  const [taskName, setTaskName] = useState('')
  const [startTime, setStartTime] = useState<number>('')
  const [endTime, setEndTime] = useState<number>('')

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

  function handleClickDay(i){
    console.log("me clicou u.U: " + i.toString())
  }

  let calendarGrid = Array.from(Array(42).keys()).map(function (i){

    let d = new Date(i*86400*1000+day1)  
    let dStr = dateStr(d)

    if (d.getMonth() == calendarDate.getMonth()) {

      return (        
        <div key={dateStr(d)} className="dayInMonthCal">

          <div onClick={() => handleClickDay(dStr)}>
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

          <div onClick={() => handleClickDay(dStr)}>
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

      <br/>


      <div className = "centralized-button">

        <DialogRoot>

          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Crie um Evento!
            </Button>
          </DialogTrigger>

          <DialogContent
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="black"
            color="white"
            p={6}
            rounded="md"
            shadow="xl"
            maxW="md"
            w="90%"
            zIndex={1000}
            >

            <DialogHeader>
              <DialogTitle>Crie um Evento</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Stack gap="4">
              <label> Nome do Evento </label>
              <Input placeholder="Nome do Evento" onChange={(e) => setTaskName(e.target.value)}/>
              <label> Início do Evento </label>
              <Input placeholder="Início do Evento" onChange={(e) => setStartTime(e.target.value)}/>
              <label> Fim do Evento </label>
              <Input placeholder="Fim do Evento" onChange={(e) => setEndTime(e.target.value)}/>
              </Stack>
            </DialogBody>

            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogActionTrigger>
              <Button onClick={handleSubmit}>Adicionar</Button>
            </DialogFooter>

          </DialogContent>

        </DialogRoot>

      </div>  

      <br/>

    </div>

  );
};

export default Calendar;
