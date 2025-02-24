// import { useEffect, useState } from "react";

import Header from "../../components/Header";

import FriendsTable from "./friendsTable"
import AddFriendInput from "./addFriendInput"




function Friends ( {removeCookie}: {removeCookie:any} )  {

  return (
    <div>
      <Header removeCookie={removeCookie}/>
      <br/>

      <FriendsTable/>
      <br/>

      <AddFriendInput/>
      <br/>

    </div>  
  )
}

export default Friends;
