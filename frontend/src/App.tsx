import { CookiesProvider, useCookies } from 'react-cookie'
import React, {useEffect, createContext} from "react";
import { BrowserRouter, Route, Routes, useNavigate, useLocation} from 'react-router-dom'

import Home from "./components/Home";
import Friends from "./components/Friends";
import Calendar from "./components/Calendar";
import Profile from "./components/Profile";

import Login from "./components/Login";
import CreateAccount from "./components/CreateAccount";

import Error404 from "./components/Error404";

//import useToken from "./hooks/useToken"

function App() {

  // Cookies
  const [cookie, setCookie, removeCookie] = useCookies(['token'])

  let navigate = useNavigate()  
  let locationPath = useLocation()["pathname"]

  // Handle Login Navigation
  useEffect(() => {
    if (!cookie.token) {
      if ((locationPath != "/login") && (locationPath != "/createAccount")){
        navigate('/login')
      }
    } else {
      console.log(cookie.token)

      if ((locationPath == "/login") || (locationPath == "/createAccount")){
        navigate ('/home')
      } else if (locationPath == "/"){
        navigate ('/home')
      }   
    }
  }, []);


  return (

      <CookiesProvider>

        <h1> Organizer </h1>
        <Routes>
          <Route path="/login" element=<Login setCookie={setCookie} />/>
          <Route path="/createAccount" element=<CreateAccount/>/>
          <Route path="/home" element = <Home removeCookie={removeCookie} />/>
          <Route path="/friends" element = <Friends removeCookie={removeCookie} />/>
          <Route path="/calendar" element = <Calendar removeCookie={removeCookie} />/>
          <Route path="/profile" element = <Profile removeCookie={removeCookie} />/>
          <Route path="*" element = <Error404/>/>
        </Routes>

      </CookiesProvider>
  )
}

export default App;