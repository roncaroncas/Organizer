import { useEffect } from "react"
import { useNavigate } from 'react-router-dom'

import { useCookies } from 'react-cookie';

import useFetch from "../../hooks/useFetch"
import useForm from "../../hooks/useForm"

import logo from '../../assets/mamaco.jpeg';

interface FormData {
  username: string;
  password: string;
}

interface UserData {
  username: string
  password: string
  id: number
  name: string
  dateOfBirth: number
  email: string
};

// function Login({setToken}) {
function Login() {


  // ------------- FORM VARS --------- //

  const initialValues: FormData = {
      username: "",
      password: "",
  }

  const formatForAPI = (values: FormData):UserData => {
    return {
      username: values.username,
      password: values.password,
      id: 0,
      name: "",
      dateOfBirth: 0,
      email: "",
    };
  };

  // const [userData, setUserData] = useState<FormData>({
  //     username: "",
  //     password: ""
  //   })

  const { formValues, handleInputChange, getFormattedData/*, resetForm*/ } = useForm<FormData>(initialValues, formatForAPI);
  const formattedData = getFormattedData()
  

 // ------------COOKIE HANDLER ----------- //

  const [/*cookie*/, setCookie, /*removeCookie*/] = useCookies(['token']);
  
  let navigate = useNavigate()

  // ----- FETCHES ------ //

  const { data, error, isLoading, fetchData } = useFetch('http://localhost:8000/login', {   // RETORNA O TOKEN!!!!!
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formattedData)
  });

  // let [token, setToken] = useState<string>("")

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

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {

  //   const { name, value, type, checked } = event.target;

  //   setUserData(prevUserData => {
  //     let newUserData = { ...prevUserData };

  //     if (type === "checkbox") {
  //         newUserData[name] = checked;
  //       } else {
  //         newUserData[name] = value;
  //       }
  //       return newUserData;    

  //   })
  // }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (isLoading) {
      return; // Prevent multiple submissions
    }

    if (!formValues.username || !formValues.password) {
      alert("Please fill in both fields.");
    return;
  }

    fetchData()
  }


  // ---------------------------- //


  return (
    <div className = "login-page">

      <div className="title-container">
        <h1 className="login-title">TEMPO</h1>
      </div>

      <div className="login-container">
              
        <div className="left-column" >
          <img src={logo} alt="Logo" />
        </div>

        <div className="separator"/>

        <div className="right-column">

          <div className="container">

            <form onSubmit={handleSubmit} >
              <div>
                <p> Faça o seu login! </p>
              </div>

              <label><b>Username</b></label>
              <input className="login-input" type="text" name="username" value={formValues.username} onChange={handleInputChange} />

              <label><b>Password</b></label>
              <input className="login-input" type="password" name="password" value={formValues.password} onChange={handleInputChange} />

              
              <button className ="btn accept" type="submit">Login</button><br/>
              

              {isLoading && <div>Loading...</div>} {/* Show loading */}
              {error && <div> Acesso Negado!! </div>}
              
            </form>

          </div>

          <br/>

          <div className = "container">
            <a href="/createAccount"><button className="btn accept">Criar nova conta!</button></a>
          </div>

        </div>

      </div>
    </div>

  );
};

export default Login
