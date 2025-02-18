import { CookiesProvider, useCookies } from 'react-cookie'
import React, {useEffect, createContext} from "react";
import { BrowserRouter, Route, Routes, useNavigate, useLocation} from 'react-router-dom'


import Header from "./components/Header";
import Todos from "./components/Todos";
import Login from "./components/Login";
import CreateAccount from "./components/CreateAccount";

import useToken from "./hooks/useToken"



function App() {

  const UserContext = createContext()
  const {token, setToken} = useToken()

  let navigate = useNavigate()
  
  //Resolvendo a questão do login!
  // useEffect (() => {
  //   if(!localStorage.token) {
  //     console.log ("Sem token no storage!")

  //     if ((useLocation()["pathname"]) != "/login"){
  //       console.log("quero irt para /login")
  //       navigate('/login') 
  //     }
  //   }
  // })

  let locationPath = useLocation()["pathname"]
  console.log("locationPath: " + locationPath)

  useEffect(() => {
    if (!localStorage.token) {
      if ((locationPath != "/login") && (locationPath != "/createAccount")){
        navigate('/login')
      }
    } else {
      navigate ('/')
    }
  }, []);


  return (

    <UserContext.Provider value={token}>

      <h1> Organizer </h1>

      <Routes>
        <Route path="/login" element=<Login setToken={setToken} />/>
        <Route path="/createAccount" element=<CreateAccount/>/>
        <Route path="/" element = <Header setToken={setToken}/>/>

      </Routes>

    </UserContext.Provider>
  )
}

export default App;