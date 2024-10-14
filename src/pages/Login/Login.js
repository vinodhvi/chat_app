import React, { useState } from "react";
import "./Login.css";
import assets from "./../../assets/assets";
import { signup, login } from "../../config/firebase";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up")
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onSubmitHandler = (event) => {
    event.preventDefault();
    if(currentState === "Sign Up") {
      signup(userName, email, password);
    }else{
      login(email, password)
    }
  }
  return (
    <div className="login">
      <img src={assets.logo_big} alt="logo" />
      <form className="login-form" onSubmit={onSubmitHandler}>
        <h2>{currentState}</h2>
        {
          currentState === "Sign Up" ? <input className="form-input"
          onChange={(e)=> setUserName(e.target.value)}
          value={userName}
           type="text" placeholder="username" 
           required/> : null
        }
        
        <input
          className="form-input" 
          onChange={(e)=>setEmail(e.target.value) }
          value={email}
          type="email"
          placeholder="Email Address"
          required/>
        <input className="form-input"
        onChange={(e)=> setPassword(e.target.value)}
        value={password}
         type="password" placeholder="password" 
         required/>
        <button type="submit">{currentState === "Sign Up" ? "Create account" : "Login Now"}</button>
        <div className="login-term">
          <input type="checkbox" />
          <p>Agree to the terms of use &amp; privacy policy.</p>
        </div>
        <div className="login-forget">
          {
            currentState === "Sign Up" ?
            <p className="login-toggle ">Already have an account? <span onClick={()=> setCurrentState("Login")}>Login here</span></p>
            :
<p className="login-toggle ">Create an account<span onClick={()=> setCurrentState("Sign Up")}> Click here</span></p>
          }
        
          
        </div>
      </form>
    </div>
  );
};

export default Login;
