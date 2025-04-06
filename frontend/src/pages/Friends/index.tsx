// import { useEffect, useState } from "react";

import Header from "../../components/Header";

import FriendsTable from "./friendsTable"
import AddFriendInput from "./addFriendInput"


function Friends ()  {

  return (
    <div>
      <Header />

      <div className="pagebody">

        <FriendsTable/>
        <br/>

        <AddFriendInput/>
        <br/>
        
      </div>
    </div>  
  )
}

export default Friends;
