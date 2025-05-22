import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useApi } from "../services/useApi";
import { Link, Navigate } from "react-router-dom";
import { fetchUser } from "../features/auth/authThunks";
import "./scss/Login.scss"
import { showToast } from "../features/toast/toastThunks";

function Register() {
  const api = useApi();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [credentials, setCredentials] = useState({ username: "", email: "", password: "" });
  const [redirect, setRedirect] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      var result = await api.post("/auth/register", credentials);
      dispatch(fetchUser());
      if (result.data.message) {
        dispatch(showToast("success", result.data.message))
      }
      setRedirect(true);
    } catch (error) {
      if (error.response.data.hasErrors) {
        const errors = error.response.data.errors;

        Object.entries(errors).forEach(([key, messages]) => {
          messages.forEach((message) => {
            dispatch(showToast("error", message))
          });
        });
      }
    }
  };

  if (isAuthenticated || redirect) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="Form-Wrapper">
        <div className="Form">
          <h1>Register</h1>
          <form onSubmit={handleSubmit} autoComplete="off">
            <input
              type="text"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              autoComplete="new-password"
            />
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
              autocomplete="new-password"
            />
            <button type="submit">Register</button>
          </form>
          <Link to="/login">Already registrered? Click here to login.</Link>
        </div>
      </div>
    </>
  );
}

export default Register;