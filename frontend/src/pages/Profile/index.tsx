import {useEffect, useState} from "react";
// import {useNavigate} from 'react-router-dom'

import Header from "../../components/Header";

function Profile ({removeCookie }: { removeCookie: any })  {

  const [myselfData, setMyselfData] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/profile', {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          setMyselfData(data)
          console.log(data)
        })}, [])



  return (

    <div>

      <Header removeCookie={removeCookie}/>
      <br/>

      <table key="tableFriends">
        <thead>
          <tr>
            <th>My_Id</th>
            <th>My_Name</th>
            <th>Birthday</th>
          </tr>
        </thead>
        <tbody>
          <tr key={myselfData[0]}>
            <td>{myselfData[0]}</td>
            <td>{myselfData[1]}</td>
            <td>{myselfData[2]}</td>
          </tr>
        </tbody>
      </table>

    </div>
        
  )
}
export default Profile;
