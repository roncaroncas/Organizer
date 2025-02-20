import React, {useState} from "react";
import {useNavigate} from 'react-router-dom'


async function loginUser(credentials) {

  console.log(credentials)
  
  const results = await fetch('http://localhost:8000/login', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
    })
  .then(data => data.json())
  .then(data => data.token)

  return results
}


// function Login({setToken}) {
function Login({setCookie}) {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  let navigate = useNavigate()
  const routeChange = () =>{ 
    let path = '/createAccount' 
    navigate(path);
    console.log("routeChange!")
  }


  async function handleSubmit(event) {

    event.preventDefault() //DEVE TER UM JEITO MELHOR DO QUE ISSO AQUI 

    const credentials = {
      "username": username,
      "password": password
    }

    const token = await loginUser(credentials)

    console.log("lido do forms o token: " + token)
    // setToken(token)
    setCookie("token", token, {path: "/"})
    navigate(0) //força um refresh para trocar de página...

  }

  return (
    <div>

      <form onSubmit={handleSubmit} className = "loginform">
        <div>
          <p> Faça o seu login! </p>
        </div>

        <label><b>Username</b></label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label><b>Password</b></label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <div className = "centralized-button">
          <button type="submit">Login</button><br/>
        </div>

        {/*<button>Forget password?</button><br/>*/}
        
      </form>

      <div className = "centralized-button">
        <button onClick={routeChange}>Criar nova conta!</button>
      </div>

    </div>

  );
};

export default Login
