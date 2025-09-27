import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useApi } from "../services/useApi";
import { Link, Navigate } from "react-router-dom";
import { fetchUser } from "../redux/auth/authThunks";
import "./scss/Login.scss"
import { IoChatboxOutline } from "react-icons/io5";
import ValidationErrorList from "../components/ValidationErrorList";
import { toast } from "react-toastify";

function Register() {
  const api = useApi();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [credentials, setCredentials] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      var result = await api.post("/auth/register", credentials);
      dispatch(fetchUser());
      if (result.data.message) {
        toast.success(result.data.message);
      }
      setRedirect(true);
    } catch (error) {
      var response = error.response.data;
      if (response.hasErrors) {
        setErrors(response.errors);
        toast.error(response.message);
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
            <h2>Register</h2>
            <p>Enter account details</p>
          </div>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="Child">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="AwesomeCat23"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                autoComplete="new-password"
              />
              <ValidationErrorList
                errors={errors?.Username}
              />
            </div>
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
                autoComplete="new-password"
              />
              <ValidationErrorList
                errors={errors?.Password}
              />
            </div>
            <button type="submit">Register</button>
          </form>
          <Link to="/login">Already registrered? Click here to login.</Link>
        </div>
      </div>
    </>
  );
}

export default Register;