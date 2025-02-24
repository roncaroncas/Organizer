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
          setTaskList(data['tasks'])
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
          <th>Task_WithHour</th>
          <th>Task_LongDescription</th>
        </tr>
      </thead>
      <tbody>
      {taskList.map( function (task){
        // console.log(task)
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
        })}
      </tbody>
    </table>
  )

  
};

export default AllTasksTable;
