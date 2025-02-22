import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from 'react-router-dom'

import Header from "./Header";


function Calendar ({removeCookie})  {

///////////DADOS DA TASK//////////////////////////////

  const { id } = useParams()

  const [taskData, setTaskData] = useState([])

  let navigate = useNavigate()  

  useEffect(() => {
    fetch('http://localhost:8000/task/'+ id.toString(), {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          setTaskData(data)
          console.log(data)
        })}, [])

  
  /////////////USUARIOS DA TASK ///////////////////////////

  const [userList, serUserList] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/task/'+ id.toString()+"/users", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          serUserList(data)
          console.log(data)
        })}, [])

  
  let structuredUsers = userList.map( function (user){
    return (
      <tr key={user[0]+Math.random()}>
        <td>{user[0]}</td>
        <td><a href={"/profile/"+user[0]}>{user[1]}</a></td>
      </tr>
    )
  })

  //////////// CONVIDAR AMIGO //////////////////////

  const [newTaskUserId, setNewTaskUserId] = useState('')

  async function addNewTaskUser(userId) {

    console.log(newTaskUserId)
    
    const results = await fetch('http://localhost:8000/task/'+ id.toString()+"/addUser/" + userId.toString(), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({newTaskUserId})
      })
    .then(data => data.json())
    // .then(data => data.blabla)

    return results
  }

  async function handleSubmit(event) {

    event.preventDefault() //DEVE TER UM JEITO MELHOR DO QUE ISSO AQUI 
    const response = await addNewTaskUser (newTaskUserId)
    console.log(response)

    if (response) {
      console.log("User convidado adicionado! :D")
    } else {
      console.log("Amigo nao existe :(")
    }

    navigate(0)

  }




  return (
    <div>

    <Header removeCookie={removeCookie}/>
    <br/>

    <br/>

    <table>
      <thead>
        <tr>
          <th>Task_Id</th>
          <th>Task_Name</th>
          <th>Task_StartTime</th>
          <th>Task_EndTime</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{id}</td>
          <td>{taskData[0]}</td>
          <td>{taskData[1]}</td>
          <td>{taskData[2]}</td>
        </tr>
      </tbody>
    </table>
    <br/>

    <table>
      <thead>
        <tr>
          <th>User_id</th>
          <th>User_Name</th>
        </tr>
      </thead>
      <tbody>
        {structuredUsers}
      </tbody>
    </table>

    <br/>

    <form onSubmit={handleSubmit} className = "loginform">
      <div>
        <p> Adicione alguém para o evento! </p>
      </div>

      <label><b>User Id</b></label>
      <input type="text" value={newTaskUserId} onChange={(e) => setNewTaskUserId(e.target.value)} />

      <div className = "centralized-button">
        <button type="submit">Adicionar!</button><br/>
      </div>
    </form>
    

    </div>

  );
};

export default Calendar;
