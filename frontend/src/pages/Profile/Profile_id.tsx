import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'

import Header from "../../components/Header";

interface RemoveCookie {
  (name: string): void;
}

function Profile_id ({removeCookie }: { removeCookie: RemoveCookie })  {

  const [profileData, setProfileData] = useState([])

  const { id } = useParams()

  console.log("hello!")
  console.log(id)

  useEffect(() => {
    fetch('http://localhost:8000/profile/'+ id!.toString(), {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          setProfileData(data)
          console.log(data)
        })}, [])


  return (

    <div>

      <Header removeCookie={removeCookie}/>
      <br/>

      <table key="tableFriends">
      
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Birthday</th>
          </tr>
        </thead>

        <tbody>
          <tr key={profileData[0]}>
            <td>{profileData[0]}</td>
            <td>{profileData[1]}</td>
            <td>{profileData[2]}</td>
          </tr>
        </tbody>

      </table>

    </div>
        
  )
}
export default Profile_id;
