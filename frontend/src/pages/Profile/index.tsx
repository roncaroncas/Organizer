import {useEffect, useState} from "react"

import Header from "../../components/Header"
import useFetch from "../../hooks/useFetch"

interface ProfileData {
  id: string;
  name: string;
  birthday: string;
}

function Profile ()  {

  const [myselfData, setMyselfData] = useState<ProfileData>({
    id: "",
    name: "",
    birthday: ""
  })

  //Fetch groupsData
  const { data, /*error, isLoading,*/ fetchData } = useFetch('http://localhost:8000/profile', {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    if (data) {
      setMyselfData({
        id: data[0],
        name: data[1],
        birthday: data[2]
      });
    }
  }, [data]);

  useEffect(() => {
    fetchData()
  }, [])

  return (

    <div>
      <Header/>      

      <div className = "pagebody">

{/*        <div className="container">
          <Notifications/>          
        </div>*/}

        <br/>

        <div className="container">
          <table key="tableFriends">
            <thead>
              <tr>
                <th>My_Id</th>
                <th>My_Name</th>
                <th>Birthday</th>
              </tr>
            </thead>
            <tbody>
              <tr key={myselfData.id}>
                <td>{myselfData.id}</td>
                <td>{myselfData.name}</td>
                <td>{myselfData.birthday}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>
        
  )
}
export default Profile;
