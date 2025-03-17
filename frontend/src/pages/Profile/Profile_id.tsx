import { useEffect, useState } from "react"
import { useParams } from 'react-router-dom'

import Header from "../../components/Header"
import useFetch from "../../hooks/useFetch"

function Profile_id () {

  const [profileData, setProfileData] = useState([])

  const { id } = useParams()

  //Fetch groupsData
  const { data, /*error, isLoading,*/ fetchData } = useFetch('http://localhost:8000/profile/' + id!.toString(), {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    setProfileData(data)
  }, [data])

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
              {profileData.length > 0 && (
                <tr key={profileData[0]}>
                  <td>{profileData[0]}</td>
                  <td>{profileData[1]}</td>
                  <td>{profileData[2]}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Profile_id;
