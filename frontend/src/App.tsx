import { ChakraProvider } from '@chakra-ui/react'
import { defaultSystem } from "@chakra-ui/react"
import Header from "./components/Header";
import Todos from "./components/Todos";
import LoginForm from "./components/Login";

function App() {

  return (
    <ChakraProvider value={defaultSystem}>
      <Header />
      <br/>
      <LoginForm />
      <Todos />
    </ChakraProvider>
  )
}

export default App;