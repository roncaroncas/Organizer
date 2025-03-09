import {useEffect, useState} from "react";

import Header from "../../components/Header";

function FriendGroups ({ removeCookie }:{removeCookie:any})  {


 let [groups, setGroups] = useState([
    {
      id: 1,
      name: "Group A",
      description: "Description A",
      users: [
        { id: 101, name: "Alice" },
        { id: 102, name: "Bob" },
        { id: 103, name: "Boba" },
        { id: 104, name: "Bobe" },
        { id: 105, name: "Bobi" },
      ],
    },
    {
      id: 2,
      name: "Group B",
      description: "Description B",
      users: [
        { id: 201, name: "Charlie" },
        { id: 202, name: "David" },
      ],
    },
    {
      id: 3,
      name: "Group C",
      description: "Description C",
      users: [
        { id: 301, name: "Eve" },
        { id: 302, name: "Frank" },
      ],
    },
  ])


  let structuredGroups = groups.map((group) => {

    return (
      <div key={group.id} className="container">
        <div className ="card-container">
          <strong> {group.name} </strong>
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
