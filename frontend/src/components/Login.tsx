import React, {useState} from "react";


async function loginUser(credentials) {

  console.log(JSON.stringify(credentials))
  console.log(credentials)

  const results = await fetch('http://localhost:8000/login', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
    })
  .then(data => data.text())

  return results
}


function Login({setToken}) {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  async function handleSubmit(event) {
    event.preventDefault()

    const credentials = {
      "username": username,
      "password": password
    }

    const token = await loginUser(credentials)

    setToken(token)
    


  }

  return (
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
        <button>Forget password?</button><br/>
        <button>Register new account</button>
      </div>

    </form>
  );
};

export default Login
