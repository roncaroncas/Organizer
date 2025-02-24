import {useState} from "react";
import {useNavigate} from 'react-router-dom'


async function createUser(credentials: any) {

  console.log(JSON.stringify(credentials))
  console.log(credentials)

  await fetch('http://localhost:8000/createAccount', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
    })
  .then(data => console.log(data.text()))

  return
}

function Login() {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  let navigate = useNavigate()

  async function handleSubmit(event: any) {
    event.preventDefault()

    const credentials = {
      "username": username,
      "password": password
    }

    await createUser(credentials)

    navigate("/login")
    
  }

  return (
    <form onSubmit={handleSubmit} className = "loginform">

      <div>
        <p> Crie a sua conta! </p>
      </div>

      <label><b>Username</b></label>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

      <label><b>Password</b></label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <div className = "centralized-button">
        <button type="submit">Criar Conta!</button><br/>
      </div>

    </form>
  );
};

export default Login
