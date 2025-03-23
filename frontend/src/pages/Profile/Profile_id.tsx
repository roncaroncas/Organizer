import { useEffect, useState } from "react"
import { useParams } from 'react-router-dom'

import Header from "../../components/Header"
import useFetch from "../../hooks/useFetch"

interface ProfileData {
  id: string;
  name: string;
  birthday: string;
}

function Profile_id () {

  const [profileData, setProfileData] = useState<ProfileData>({
    id: "",
    name: "",
    birthday: ""
  })
  const { id } = useParams()

  //Fetch groupsData
  const { data, /*error, isLoading,*/ fetchData } = useFetch('http://localhost:8000/profile/' + id!.toString(), {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    if (data) {
      console.log(data[0], data[1], data[2])
      setProfileData({
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
      <Header />
      <br />

      <div className="pagebody">

        <div className="container">

          <table key="tableProfile" className="profile-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Birthday</th>
              </tr>
            </thead>

            <tbody>
              <tr key={profileData.id}>
                <td>{profileData.id}</td>
                <td>{profileData.name}</td>
                <td>{profileData.birthday}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Profile_id;
