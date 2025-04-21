import { useEffect, createContext } from "react"
import { CookiesProvider, useCookies } from 'react-cookie';

import { Route, Routes, useNavigate, useLocation} from 'react-router-dom'

import Feed from "./pages/Feed/index";
import Friends from "./pages/Friends/index";
import FriendsGroups from "./pages/Groups/index";
import GroupPage from "./pages/Groups/GroupPage";
import Calendar from "./pages/Calendar/index";
import Tempo from "./pages/Tempo/index";
import Profile from "./pages/Profile/index";
import Profile_id from "./pages/Profile/Profile_id";

// import CalendarGroupsManager from "./pages/TaskGroups/CalendarGroupsManager"

import Login from "./pages/Login/index";
import CreateAccount from "./pages/Login/CreateAccount";

import Error404 from "./pages/Errors/Error404";


// ------------------------------------

export const CookieContext = createContext<any>(null);

function App() {

  // Cookies
  // debugger;
  const [cookie, setCookie, removeCookie] = useCookies(['token'])

  let navigate = useNavigate()  
  let locationPath = useLocation()["pathname"]

  // Handle Login Navigation
  useEffect(() => {
    if (!cookie.token) {
      if ((locationPath != "/login") && (locationPath != "/createAccount")){
        navigate('/login')
      }
    }
  }, [cookie.token]);


  return (
    <CookiesProvider>
      <CookieContext.Provider value={{ cookie, setCookie, removeCookie }}> {/* Provide the context value */}
        <Routes>
          <Route path="/" element = {<Calendar/>} />
          <Route path="/login" element = {<Login/>} />
          <Route path="/createAccount" element = {<CreateAccount/>} />
          <Route path="/feed" element = {<Feed/>} />
          <Route path="/friends" element = {<Friends/>} />
          <Route path="/groups" element = {<FriendsGroups/>} />
          <Route path="/group/:id" element = {<GroupPage/>} />
          <Route path="/calendar" element = {<Calendar/>} />
          <Route path="/calendar/:id" element = {<Tempo/>} />
          {/*<Route path="/taskGroups" element = {<CalendarGroupsManager/>} />*/}
          <Route path="/profile" element = {<Profile/>} />
          <Route path="/profile/:id" element = {<Profile_id/>} />

          <Route path="*" element = {<Error404/>} />
        </Routes>
      </CookieContext.Provider>
    </CookiesProvider>
  )
}

export default App;