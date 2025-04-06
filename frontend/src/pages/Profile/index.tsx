import {useEffect, useState} from "react"
import { parseISO, format } from 'date-fns'

import Header from "../../components/Header"
import useFetch from "../../hooks/useFetch"

interface ProfileData {
  id: number;
  name: string;
  birthday: Date | null;
}

function Profile ()  {

  const [myselfData, setMyselfData] = useState<ProfileData>({
    id: 0,
    name: "",
    birthday: null
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
        ...data,
        birthday: data.birthday ? new Date(data.birthday) : null
      });
    }
  }, [data]);

  // useEffect(() => {
  //   if (myselfData){
  //     console.log("myselfData: ", myselfData)
  //     console.log("id: ", myselfData.id)
  //     console.log("name: ", myselfData.name)
  //     console.log("birthday: ", myselfData.birthday)
  //   }      
  // }, [myselfData])

  useEffect(() => {
    fetchData()
  }, [])

  return (

    <div>
      <Header/>      

      <div className = "pagebody">

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
                <td>
                  {myselfData.birthday
                    ? format((myselfData.birthday), 'dd/MM/yyyy')
                    : ''}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>
        
  )
}
export default Profile;
