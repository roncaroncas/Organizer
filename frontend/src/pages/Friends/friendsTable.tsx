import { useEffect, useState } from "react";

interface Friend {
  friendId: string;
  friendName: string;
}

/////////////TABELA DE AMIGOS ///////////////////////////////


function FriendsTable(){

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

  let structuredFriends = friendList.map( function (friend: Friend){
    return (
      <tr key={friend['friendId']+Math.random()}>
        <td>{friend['friendId']}</td>
        <td><a href={"/profile/"+friend.friendId}>{friend.friendName}</a></td>
      </tr>
    )
  })

  return(
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
  )
}

export default FriendsTable;