import { useEffect, useState} from "react";
import { useParams } from 'react-router-dom';

import useFetch from "../../hooks/useFetch";

import Header from "../../components/Header";

interface User {
  id?: number;
  name?: string;
}

interface Group {
  id?: number;
  name?: string;
  description?: string;
  users?: User[];
}
function GroupPage_Id ({removeCookie }: { removeCookie: any }) {

  const [groupData, setGroupData] = useState<Group>({
    id: 0,
    name: "",
    description: "",
    users: [],
  });

  const { id } = useParams()

  //Fetch groupData
  const { data, error, isLoading, fetchData } = useFetch('http://localhost:8000/group/get/'+id.toString(), {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (data) {
      setGroupData(data)
      console.log("chamei o setGroupData!")
      console.log(data)
    }
  }, [data])

  useEffect(() => {
    console.log(groupData)
  }, [groupData])

  return (
    <div>
      <Header removeCookie={removeCookie} />
      <br />

      <div className="pagebody">

        <div className="container">

          <div className="card-container">
            <p><strong>Id:</strong> {groupData.id}</p>
            <p><strong>Name:</strong> {groupData.name}</p>
            <p><strong>Description:</strong> {groupData.description}</p>
            <p><strong>Users:</strong> {groupData.users}</p>
          </div>

          <div className="card-container">
            <h3> Group Feed! </h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupPage_Id;
