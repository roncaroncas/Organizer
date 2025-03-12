import {useEffect, useState} from "react";

import Header from "../../components/Header"
import useFetch from "../../hooks/useFetch"

interface User {
  id: number
  name: string
};

interface Group {
  id?: number
  name?: string
  description: string
  users?: User[]
};

function FriendGroups ({ removeCookie }:{removeCookie:any})  {


 let [groups, setGroups] = useState([])


 //---- FETCHES ------ //

  //Fetch groupsData
  const { data, error, isLoading, fetchData } = useFetch('http://localhost:8000/group/getAll', {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (data) {
      setGroups(data)
      console.log("chamei o setGroupData!")
      console.log(data)
    }
  }, [data])

  useEffect(() => {
    console.log(groups)
  }, [groups])

  // ---------------------------------------- //

  let structuredGroups = groups.map((group) => {

    return (
      <div key={group.id} className="container">
        <div className ="card-container">
          <a href={"/group/"+group.id.toString()}> <strong> {group.name} </strong> </a> 
          <p> {group.description} </p>

          {group.users.slice(0, 3).map((user) => {

            return (
              <div key={user.id}>
                <p> {user.name} </p>
              </div>
              )
          })}

          {group.users.length > 3 && (
            <div>+{group.users.length - 3} more</div>
          )}         
        </div>
        <br/>
      </div>
      )
  })



  return (
    <div>

      <Header removeCookie={removeCookie}/>

      <div className="pagebody">

        <div className="card-container">
          <h3> Meus Grupos! </h3>
        </div>

        {structuredGroups}
        <br/>
       
       {/* --- Novo Grupo --- */}
        <div className="card-container">
          <h3> Novo Grupo! </h3>
          <input type="text" placeholder="Group Name"/>
          <input type="text" placeholder="Group Description"/>

          <button className ="btn accept">
            Criar
          </button>
        </div>


       {/* --- Procurar Grupo --- */}
        <div className="card-container">
          <h3> Procurar Grupo! </h3>
          <input type="text" placeholder="Group Name"/>

          <button className ="btn accept">
            Procurar Grupo!
          </button>
        </div>

      </div>
   
    </div>
  )
};

export default FriendGroups;
