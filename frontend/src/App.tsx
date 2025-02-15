import { ChakraProvider } from '@chakra-ui/react'
import { defaultSystem } from "@chakra-ui/react"

import { CookiesProvider, useCookies } from 'react-cookie'

import Header from "./components/Header";
import Todos from "./components/Todos";
import LoginForm from "./components/Login";

function App() {

  var isLoggedIn = false

  const [cookies, setCookie] = useCookies([''])
  
  function handleLogin(user) {
    setCookie('user', user, {path: '/'})
  }

  const [token, setToken] = useState();

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (

    <CookiesProvider>
      <ChakraProvider value={defaultSystem}>
        {isLoggedIn == true && <Header user={cookies.user}/>}
        {isLoggedIn == false && <Header user={"cookies.user"}/>}
        <br/>
        {cookies.user == null && <LoginForm onLogin={handleLogin}/>}
        {cookies.user != null && <LoginForm onLogin={handleLogin}/>}
        <Todos />
      </ChakraProvider>
    </CookiesProvider>
  )
}

export default App;