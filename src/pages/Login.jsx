import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useApi } from "../services/useApi";
import { Link, Navigate } from "react-router-dom";
import { fetchUser } from "../redux/auth/authThunks";
import "./scss/Login.scss"
import { showToast } from "../redux/toast/toastThunks";
import { handleApiErrors } from "../utils/general";
import { IoChatboxOutline } from "react-icons/io5";

function Login() {
  const api = useApi();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [redirect, setRedirect] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      var result = await api.post("/auth/login", credentials);
      dispatch(fetchUser());
      if (result.data.message) {
        dispatch(showToast("success", result.data.message))
      }
      setRedirect(true);
    } catch (error) {
      dispatch(showToast("error", error?.response?.data?.message))

      const errors = error.response.data.errors;
      if (errors) handleApiErrors(dispatch, errors);
    }
  };

  if (isAuthenticated || redirect) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="Form-Wrapper">
      <div className="Header">
        <div className="Name">
          <div className="Icon">
            <IoChatboxOutline />
          </div>
          <h1>ShitChat</h1>
        </div>
        <p>Welcome to ShitChat!</p>
      </div>
        <div className="Form">
          <div className="Title">
            <h1>Login</h1>
            <p>Enter your credentials</p>
          </div>
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
    </>
  );
}

export default Login;