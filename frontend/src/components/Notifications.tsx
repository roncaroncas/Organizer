import {useState, useEffect} from "react"
// import {useNavigate} from 'react-router-dom'

import useFetch from "../hooks/useFetch";

interface updStatus {
    idUserTask: number,
    newStatus: number,
}

interface Notification {
  id: number;
  taskName: string;
}

function Notifications ()  {

  // let navigate = useNavigate()
  let [notificationsList, setNotificationsList] = useState<Notification[]>([])

  let [updateStatus, setUpdateStatus] = useState<updStatus>({
    idUserTask: 0,
    newStatus: 0,
  })


  // ---------------- FETCHES ---------- //


  const { data, /*error, isLoading,*/ fetchData } = useFetch('http://localhost:8000/notification/getAll', {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  const { /*data:data_update, error:error_update, isLoading:isLoading_update,*/ fetchData:fetchData_update } = useFetch('http://localhost:8000/notification/updateStatus', {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateStatus)
  });

  useEffect(() => {
    fetchData()
  }, [])


  useEffect(() => {
    if (Array.isArray(data)) {
      // Convert tuples into objects
      const formattedData = data.map(([id, taskName]) => ({
        id,
        taskName,
      }));
      setNotificationsList(formattedData);
    }
  }, [data]);

  useEffect(() => {
    if (updateStatus.idUserTask && updateStatus.newStatus) {
     fetchData_update()
     fetchData()
    }
  }, [updateStatus])


  // ------ EVENT HANDLERS --------- //

  async function handleChangeStatus (idUserTask: number, newStatus: number){

    // newStatus:
    //   0 = Invited,
    //  10 = Maybe,
    //  20 = Confirmed,
    //  30 = Declined

    setUpdateStatus({
      idUserTask,
      newStatus,
    })
  }

  // let structuredNotifications = notificationsList.map( function (notification){
  //   let k = notification[0]
  //   return (
  //     <tr key={notification[0]}>
  //       <td>{notification[0]}</td>
  //       <td><a>{notification[1]}</a></td>
  //       <td><button className = "btn accept" onClick={() => {console.log(k); handleChangeStatus(k, "20")}}>Accept</button></td>
  //       <td><button className = "btn reject" onClick={() => {console.log(k); handleChangeStatus(k, "30")}}>Decline</button></td>
  //     </tr>
  //   )
  // })


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
          {notificationsList.map((notification: Notification) => (
            <tr key={notification.id}>
              <td>{notification.id}</td>
              <td><a>{notification.taskName}</a></td>
              <td>
                <button className="btn accept" onClick={() => handleChangeStatus(notification.id, 20)}>
                  Accept
                </button>
              </td>
              <td>
                <button className="btn reject" onClick={() => handleChangeStatus(notification.id, 30)}>
                  Decline
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

        
    </div>
        
  );
};

export default Notifications;
