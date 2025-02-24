import { useEffect, useState } from "react";


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
          setFriendList(data['friends'])
        })}, [])

  let structuredFriends = friendList.map( function (friend){
    return (
      <tr key={friend[0]+Math.random()}>
        <td>{friend[0]}</td>
        <td><a href={"/profile/"+friend[0]}>{friend[1]}</a></td>
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