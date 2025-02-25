import {useState, useEffect} from "react";
import {useNavigate, useLocation} from 'react-router-dom'

function Notifications ()  {

  let navigate = useNavigate()
  let locationPath = useLocation()["pathname"]

  let [notificationsList, setNotificationsList] = useState([])

  async function handleChangeStatus (idUserTask: string, newStatus: string){

      // newStatus:
      //   0 = Invited,
      //  10 = Maybe,
      //  20 = Confirmed,
      //  30 = Declined

     console.log("aceitei! "+idUserTask)

      await fetch('http://localhost:8000/updateNotificationStatus', {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({'idUserTask': idUserTask, 'newStatus': newStatus})
      }).then(navigate(0))
  }


  useEffect(() => {
    fetch('http://localhost:8000/myNotifications', {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          setNotificationsList(data)

        })}, [])

  let structuredNotifications = notificationsList.map( function (notification){
    let k = notification[0]
    console.log(k)
    return (
      <tr key={notification[0]}>
        <td>{notification[0]}</td>
        <td><a>{notification[1]}</a></td>
        <td><a onClick={() => {console.log(k); handleChangeStatus(k, 20)}}>Accept</a></td>
        <td><a onClick={() => {console.log(k); handleChangeStatus(k, 30)}}>Decline</a></td>
      </tr>
    )
  })


  return (
    <div className="notifications">

      <h1>Notifications</h1>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Task_Name</th>
            <th>Accept</th>
            <th>Decline</th>
          </tr>
        </thead>
        <tbody>
          {structuredNotifications}
        </tbody>
      </table>

        
    </div>
        
  );
};

export default Notifications;
