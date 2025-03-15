import { CookiesProvider, useCookies } from 'react-cookie'
import { useEffect } from "react"
import { Route, Routes, useNavigate, useLocation} from 'react-router-dom'

import Home from "./pages/Home/index";
import Feed from "./pages/Feed/index";
import Friends from "./pages/Friends/index";
import FriendsGroups from "./pages/Groups/index";
import GroupPage from "./pages/Groups/GroupPage";
import Calendar from "./pages/Calendar/index";
import CalendarDay from "./pages/Calendar/CalendarDay";
import Profile from "./pages/Profile/index";
import Profile_id from "./pages/Profile/Profile_id";

import CalendarGroupsManager from "./pages/TaskGroups/CalendarGroupsManager"

import Login from "./pages/Login/index";
import CreateAccount from "./pages/Login/CreateAccount";

import Error404 from "./pages/Errors/Error404";

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
    }
  }, []);


  return (
      <CookiesProvider>
        <Routes>
          <Route path="/" element=<Calendar setCookie={setCookie} />/>
          <Route path="/login" element=<Login setCookie={setCookie} />/>
          <Route path="/createAccount" element=<CreateAccount/>/>
          <Route path="/feed" element = <Feed removeCookie={removeCookie} />/>
          <Route path="/friends" element = <Friends removeCookie={removeCookie} />/>
          <Route path="/groups" element = <FriendsGroups removeCookie={removeCookie} />/>
          <Route path="/group/:id" element = <GroupPage removeCookie={removeCookie} />/>
          <Route path="/calendar" element = <Calendar removeCookie={removeCookie} />/>
          <Route path="/taskGroups" element = <CalendarGroupsManager/>/>
          <Route path="/profile" element = <Profile removeCookie={removeCookie} />/>
          <Route path="/profile/:id" element = <Profile_id removeCookie={removeCookie} />/>
          {/*<Route path="/test" element = <Test/>/>*/}

          <Route path="*" element = <Error404/>/>
        </Routes>
      </CookiesProvider>
  )
}

export default App;