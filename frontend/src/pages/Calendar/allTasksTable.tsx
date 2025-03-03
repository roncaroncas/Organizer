import {useEffect, useState} from "react";
// import {useNavigate} from 'react-router-dom'


function AllTasksTable ()  {

  // let navigate = useNavigate()


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
          setTaskList(data)
        })}, [])

  
  return(
    <table key="tableFriends">
      <thead>
        <tr>
          <th>Task_Id</th>
          <th>Task_Name</th>
          <th>Task_StartTime</th>
          <th>Task_EndTime</th>
          <th>Task_Place</th>
          <th>Task_FullDay</th>
          <th>Task_LongDescription</th>
          <th>Task_UserStatus</th>
        </tr>
      </thead>
      <tbody>
      {taskList.map( function (task){
        return (
          <tr key={task.id}>
            <td>{task.id}</td>
            <td>{task.taskName}</td>
            <td>{task.startDayTime}</td>
            <td>{task.endDayTime}</td>
            <td>{task.place}</td>
            <td>{task.fullDay?"Sim":"Não"}</td>
            <td>{task.taskDescription}</td>
            <td>{task.status}</td>
          </tr>
        )
        })}
      </tbody>
    </table>
  )

  
};

export default AllTasksTable;
