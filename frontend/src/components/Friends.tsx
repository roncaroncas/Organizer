import React, {useEffect, useState} from "react";

import Header from "./Header";


function Friends ({cookie, removeCookie})  {


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
      <tr key={friend[0]+"id"}>
        <td>{friend[0]}</td>
        <td>{friend[1]}</td>
      </tr>
    )
  })


  return (
    <div>
      <Header removeCookie={removeCookie}/>
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
  );
};

export default Friends;
