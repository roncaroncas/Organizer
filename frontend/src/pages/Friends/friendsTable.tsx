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


  let structuredFriends = friendList.map( function (friend: Friend){

    let f_id = friend.friendId

    return (
      <tr key={friend['friendId']+Math.random()}>
        <td>{friend['friendId']}</td>
        <td><a href={"/profile/"+friend.friendId}>{friend.friendName}</a></td>
        <td>{friend.status}</td>
        <td> <a key={friend.friendId}onClick={(e)=> (handleUnfriendClick(f_id))}> Desamigar :( </a></td>
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
          <th> Ações! </th>
        </tr>
      </thead>
      <tbody>
        {structuredFriends}
      </tbody>
    </table>
  )
}

export default FriendsTable;