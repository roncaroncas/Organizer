import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom'

import Header from "./Header";


function Friends ({cookie, removeCookie})  {

///////////ADICIONAR AMIGO //////////////////////////////

  const [friendId, setFriendId] = useState('')
  let navigate = useNavigate()

  async function addFriend(friendId) {

    console.log(friendId)
    
    const results = await fetch('http://localhost:8000/addFriend', {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({friendId})
      })
    .then(data => data.json())
    // .then(data => data.blabla)

    return results
  }

  async function handleSubmit(event) {

    event.preventDefault() //DEVE TER UM JEITO MELHOR DO QUE ISSO AQUI 
    const response = await addFriend (friendId)
    console.log(response)

    if (response) {
      console.log("Amigo adicionado! :D")
    } else {
      console.log("Amigo nao existe :(")
    }

    navigate(0)

  }



/////////////TABELA DE AMIGOS ///////////////////////////////

  const [friendList, setFriendList] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/myFriends', {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          setFriendList(data['friends'])
        })}, [])

  console.log('a' + friendList)

  let structuredFriends = friendList.map( function (friend){
    return (
      <tr key={friend[0]+Math.random()}>
        <td>{friend[0]}</td>
        <td><a href={"/profile/"+friend[0]}>{friend[1]}</a></td>
      </tr>
    )
  })


///////////////////////////////////////////////////
  return (
    <div>
      <Header removeCookie={removeCookie}/>
      <br/>

      <form onSubmit={handleSubmit} className = "loginform">
        <div>
          <p> Adicione um amigo! </p>
        </div>

        <label><b>Friend Id</b></label>
        <input type="text" value={friendId} onChange={(e) => setFriendId(e.target.value)} />

        <div className = "centralized-button">
          <button type="submit">Adicionar!</button><br/>
        </div>
      </form>

      <br/>

      <table key="tableFriends">
        <thead>
          <tr>
            <th>Friend_Id</th>
            <th>Friend_Name</th>
          </tr>
        </thead>
        <tbody>
          {structuredFriends}
        </tbody>
      </table>

    </div>  
  )
}

export default Friends;
