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

  let [newFriend, setNewFriend] = useState<User>({
    id: 0,
    name: ""
  })

  const { id } = useParams()

  // ------- FETCHES ---------- //

  //Fetch groupData
  const { data, error, isLoading, fetchData } = useFetch('http://localhost:8000/group/get/'+id.toString(), {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  //Fetch addNewGroup
  const { data: data_post, error: error_post, isLoading: isLoading_post, fetchData: fetchData_post } = useFetch('http://localhost:8000/group/inviteMember/'+id.toString(), {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newFriend),
  });


  // -------------------------- //

  useEffect(() => {
    fetchData()
  }, [,data_post])

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


  // -------- HANDLERS ------------ // 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { name, value, type, checked } = e.target;

    setNewFriend(prevNewFriend => {
      let newFriend = { ...prevNewFriend };

      if (type === "checkbox") {
          newFriend[name] = checked;
        } else {
          newFriend[name] = value;
        }
        return newFriend;    

    });
  };

  const handleSubmit = () => {
    event.preventDefault()
    fetchData_post()
  }

  // ----- STRUCTURED ----- //
  const structuredFriends = () => {
    return (
      <div>
        <h3>Membros!</h3>
        <p><strong>Users:</strong></p>
        <ul>
          {groupData.users.map((user) => (
          <li key={user.id}><a href = {"/profile/"+user.id.toString()} > {user.name} </a></li>
          ))}
        </ul>

      </div>
    );
  };


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
          </div>

          {/* MEMBROS */}
          <div className="card-container">
            {structuredFriends()}
          </div>

          {/*Adicionar Membro*/}
          <div className="card-container">
            <form>
              <h3> Adicionar alguem! </h3>
              <input type = "text" name = "id" placeholder="id" onChange={handleInputChange}></input>
              <button className="btn accept" onClick = {handleSubmit}>Adicionar!</button>

            </form>

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
