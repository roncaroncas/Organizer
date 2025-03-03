import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'

interface Friend {
  friendId: string
  friendName: string
  friendStatus: string
}

/////////////TABELA DE AMIGOS ///////////////////////////////


function FriendsTable(){
  
  let navigate = useNavigate()

  const [friendId, setFriendId] = useState<number>(-1)
  const [friendList, setFriendList] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/myFriends', {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          setFriendList(data)
    })
  }, [])

  function handleUnfriendClick(f_id){
    console.log(f_id)

    fetch('http://localhost:8000/deleteFriend', {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({"friendId": f_id})
      })

      navigate(0)
  }   

  function handleAcceptFriendClick(f_id){
    console.log(f_id)

    fetch('http://localhost:8000/acceptFriend', {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({"friendId": f_id})
      })

      navigate(0)
  }  

  let structuredFriends = friendList.map( function (friend: Friend){

    let f_id = friend.friendId
    let goodMsg = ""
    let badMsg = ""

    if (friend.statusNmbr==1) {
      goodMsg =
        <td>
          <a onClick={(e)=> (handleAcceptFriendClick(f_id))}>
            Aceitar amizade
          </a>
        </td>
      badMsg =
        <td>
          <a onClick={(e)=> (handleUnfriendClick(f_id))}>
            Recusar amizade
          </a>
        </td>

    } else if (friend.statusNmbr==2){
      goodMsg = <td/>
      badMsg =
        <td>
          <a onClick={(e)=> (handleUnfriendClick(f_id))}> 
            Cancelar Convite
          </a>
        </td>
    } else {
      goodMsg = <td/>
      badMsg =
        <td>
          <a onClick={(e)=> (handleUnfriendClick(f_id))}> 
            Excluir Amizade
          </a>
        </td>
    }

    return (
      <tr key={friend['friendId']+Math.random()}>
        <td>{friend['friendId']}</td>
        <td><a href={"/profile/"+friend.friendId}>{friend.friendName}</a></td>
        <td>{friend.status} ({friend.statusNmbr})</td>        
        {goodMsg}
        {badMsg}
      </tr>
    )
  })

  return(
    <table key="tableFriends">
      <thead>
        <tr>
          <th>Friend_Id</th>
          <th>Friend_Name</th>
          <th>Friend_Status</th>
          <th>Ações Ok!</th>
          <th>Ações No!</th>
        </tr>
      </thead>
      <tbody>
        {structuredFriends}
      </tbody>
    </table>
  )
}

export default FriendsTable;