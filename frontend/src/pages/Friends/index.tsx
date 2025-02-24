import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'

import Header from "../../components/Header";

import FriendsTable from "./friendsTable"
import AddFriendInput from "./addFriendInput"


interface Cookie {
  (name: string): void;
}

interface RemoveCookie {
  (name: string): void;
}

interface FriendsProps {
    removeCookie: RemoveCookie;
    cookie: Cookie;
}


function Friends ( {cookie, removeCookie}: FriendsProps )  {

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
