import React, {useState} from "react";


function LoginForm({onLogin}) {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onLogin({ username, password })
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

export default LoginForm
