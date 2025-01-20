import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../features/auth/authSlice";
import { useApi } from "../services/useApi";
import { Link, Navigate } from "react-router-dom";

import "./scss/Login.scss"

function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [redirect, setRedirect] = useState(false);
  const dispatch = useDispatch();
  const api = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/login", credentials);
      const { data } = await api.get("/auth/me");
      dispatch(setUser(data));
      setRedirect(true);
    } catch (error) {
      console.log("Login failed");
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="Form-Wrapper">
        <div className="Form">
          <h1>LOGIN</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
            <button type="submit">Login</button>
          </form>
          <Link to="/register">No account? Click here to register.</Link>
        </div>
      </div>




      {/* <div className="form">
        <div className="wrapper">
          <div className="header">
            <h2>Log in</h2>
          </div>
          <div className="form-content">
            <form className="form" onSubmit={handleSubmit}>
              <div className="form-child">
                <label>Email address</label>
                <div className="form-child-input">
                  <div>
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-child">
                <label>Password</label>
                <div className="form-child-input">
                  <div>
                    <i className="fa-solid fa-lock"></i>
                  </div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-checkbox">
                  <input type="checkbox" />
                  <label>Remember me</label>
              </div>
              <button type="submit" className="submit">Login</button>
              <div className="register-wrapper">
                  <a>Don't have an account? Sign up here</a>
              </div>
            </form>
          </div>
        </div>
    </div> */}
    </>
  );
}

export default Login;