// import { useEffect, useState } from "react";

import Header from "../../components/Header";

import FriendsTable from "./friendsTable"
import AddFriendInput from "./addFriendInput"




function Friends ( {removeCookie}: {removeCookie:any} )  {

  return (
    <div>
      <Header removeCookie={removeCookie}/>

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
