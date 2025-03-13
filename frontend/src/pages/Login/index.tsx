import {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom'

import useFetch from "../../hooks/useFetch";

interface UserData {
  username: string
  password: string
  id: number
  name: string
  dateOfBirth: number
  email: string
};

// function Login({setToken}) {
function Login({ setCookie }:{setCookie:any} ) {

  const [userData, setUserData] = useState({
    username: "",
    password: ""
  })

  let navigate = useNavigate()

  // ----- FETCHES ------ //


  const { data, error, isLoading, fetchData } = useFetch('http://localhost:8000/login', {   // RETORNA O TOKEN!!!!!
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });


 // --------EFFECTS -------------- //

  useEffect (() => {
    if (data) {
      setCookie("token", data.token, {path: "/"})
      navigate("/calendar")
    }
  }, [data])

  useEffect(() => {
    if (error) {
      console.error("Login error:", error);
    }
  }, [error]);


  // ------- EVENT HANDLERS ---------- //

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const { name, value, type, checked } = event.target;

    setUserData(prevUserData => {
      let newUserData = { ...prevUserData };

      if (type === "checkbox") {
          newUserData[name] = checked;
        } else {
          newUserData[name] = value;
        }
        return newUserData;    

    })
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (isLoading) {
      return; // Prevent multiple submissions
    }

    if (!userData.username || !userData.password) {
      alert("Please fill in both fields.");
    return;
  }

    fetchData()
  }


  // ---------------------------- //


  return (
    <div>

    

      <form onSubmit={handleSubmit} className="loginform container">
        <div>
          <p> Faça o seu login! </p>
        </div>

        <label><b>Username</b></label>
        <input className="login-input" type="text" name="username" value={userData.username} onChange={handleInputChange} />

        <label><b>Password</b></label>
        <input className="login-input" type="password" name="password" value={userData.password} onChange={handleInputChange} />

        <div className="centralized-button">
          <button type="submit">Login</button><br/>
        </div>

        {isLoading && <div>Loading...</div>} {/* Show loading */}
        {error && <div> Acesso Negado!! </div>}
        
      </form>

      <div className = "loginform container">
        <a href="/createAccount"><button>Criar nova conta!</button></a>
      </div>

    </div>

  );
};

export default Login
