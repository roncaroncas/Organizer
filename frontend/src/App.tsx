import { CookiesProvider, useCookies } from 'react-cookie'
import React, {useState} from "react";

import Header from "./components/Header";
import Todos from "./components/Todos";
import Login from "./components/Login";

function App() {

  const [token, setToken] = useState()

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (

        <Header/>
  )
}

export default App;