import {useState, useEffect} from "react"

import useFetch from "../hooks/useFetch";

interface updTempo {
    tempoId: number,
    newStatusId: number,
}

interface Notification {
  id: number
  name: string
  statusId: number
}

function Notifications ()  {

  // let navigate = useNavigate()
  let [notificationsList, setNotificationsList] = useState<Notification[]>([])

  let [updateTempo, setUpdateTempo] = useState<updTempo>({
    tempoId: 0,
    newStatusId: 0,
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
    body: JSON.stringify(updateTempo)
  });

  useEffect(() => {
    fetchData()
  }, [])


  useEffect(() => {
    if (data) {
      setNotificationsList(data);
    }
  }, [data]);

  // useEffect(() => {
  //   if (notificationsList) {
  //     console.log("Notification List:", notificationsList)
  //   }
  // }, [notificationsList])


  useEffect(() => {
    if (updateTempo.tempoId && updateTempo.newStatusId) {
     fetchData_update()
     fetchData()
    }
  }, [updateTempo])


  // ------ EVENT HANDLERS --------- //

  async function handleChangeStatus (tempoId: number, newStatusId: number){

    // newStatusId:
    //   0 = Invited,
    //  10 = Maybe,
    //  20 = Confirmed,
    //  30 = Declined

    setUpdateTempo({
      tempoId,
      newStatusId,
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
              <td><a>{notification.name}</a></td>
              <td>
                <button className="btn accept" onClick={() => handleChangeStatus(notification.id, 2)}>
                  Accept
                </button>
              </td>
              <td>
                <button className="btn reject" onClick={() => handleChangeStatus(notification.id, 3)}>
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
