// import {useState} from "react";
// import {useNavigate} from 'react-router-dom'
import { useParams } from 'react-router-dom'

import Header from "../../components/Header";

import AllTasksTable from "./AllTasksTable"
import AddNewTask from "./AddNewTask"


function CalendarDay ({removeCookie}:{removeCookie:any})  {

// ///////////ADICIONAR TASK NOVA//////////////////////////////

//   let navigate = useNavigate()

  const { yyyy } = useParams<string>()
  const { mm } = useParams<string>()
  const { dd } = useParams<string>()
  
//   let pageDate = new Date (yyyy, mm, dd)
//   // let pageDateStr = pageDate.toString()

//   const [taskName, setTaskName] = useState<string>('')
//   const [startTime, setStartTime] = useState<string>(yyyy)
//   const [endTime, setEndTime] = useState<string>('')

//   async function createTask(){

//     let message = {'taskName': taskName, 'startTime': startTime, 'endTime': endTime}
//     console.log(message)
//     const results = await fetch('http://localhost:8000/createTask', {
//     method: "POST",
//     credentials: "include",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(message)
//     })
//       .then(data => data.json())
//     // .then(data => data.blabla)

//     return results

//   }

  // async function handleSubmit(event) {

  //   event.preventDefault() //DEVE TER UM JEITO MELHOR DO QUE ISSO AQUI 
  //   const response = await createTask ()
  //   console.log(response)

  //   if (response) {
  //     console.log("Evento adicionado! :D")
  //   } else {
  //     console.log("Evento nao adicionado :(")
  //   }

  //   //jeito porco de atualizar a lista de tasks
  //   navigate(0)

  // }


  
  return (
    <div>

      <Header removeCookie={removeCookie}/>
      <br/>

      {/*COLUNA2      */}
{/*      <h1> Calendar </h1>
      <h2> {CalendarDate.getFullYear()} </h2>
      <h2> {monthNumberToLabelMap[calendarDate.getMonth()]} </h2>*/}
      <h3> {dd}/{mm}/{yyyy}</h3>

      <br/>
      
      {/*COLUNA3      */}
      <AllTasksTable/>
      <br/>

      <AddNewTask/>
      

      <br/>

   
    </div>

  );
};

export default CalendarDay;
