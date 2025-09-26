import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useApi } from "../services/useApi";
import { Link, Navigate } from "react-router-dom";
import { fetchUser } from "../redux/auth/authThunks";
import "./scss/Login.scss"
import { IoChatboxOutline } from "react-icons/io5";
import ValidationErrorList from "../components/ValidationErrorList";
import { toast } from "react-toastify";

function Login() {
  const api = useApi();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      var result = await api.post("/auth/login", credentials);
      dispatch(fetchUser());
      if (result.data.message) {
        toast.success(result.data.message)
      }
      setRedirect(true);
    } catch (error) {
      var response = error.response.data;
      if (response.hasErrors) {
        setErrors(response.errors);
        toast.error(response.message)
      }
      if (response.message == "ErrorInvalidEmailOrPassword") {
        toast.error(response.message)
      }
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
            <div className="Child">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="text"
                placeholder="john.doe@example.com"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              />
              <ValidationErrorList
                errors={errors?.Email}
              />
            </div>
            <div className="Child">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Supersecret123"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
              <ValidationErrorList
                errors={errors?.Password}
              />
            </div>

            <button type="submit">Login</button>
          </form>
          <Link to="/register">No account? Click here to register.</Link>
        </div>
      </div>
    </>
  );
}

export default Login;