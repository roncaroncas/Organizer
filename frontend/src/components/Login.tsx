import React from "react";



const LoginForm = () => {
  return (
    <form className = "loginform">
      <div>
        <p> Faça o seu login! </p>
      </div>

      <label><b>Username</b></label>
      <input type="text" placeholder="Enter Username" name="uname" required/>

      <label><b>Password</b></label>
      <input type="password" placeholder="Enter Password" name="psw" required/>

      <div className = "centralized-button">
        <button type="submit">Login</button><br/>
        <button>Forget password?</button><br/>
        <button>Register new account</button>
      </div>

    </form>
  );
};

export default LoginForm;
