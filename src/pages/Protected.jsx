import { useDispatch } from "react-redux";
import { clearUser } from "../features/auth/authSlice";
import { useApi } from "../services/useApi";

function Protected() {
  const api = useApi();
  const dispatch = useDispatch();

  const logout = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/logout");
      dispatch(clearUser());
    } catch (error) {
      console.log("logout failed", JSON.stringify(error));
    }
  };

    return (
      <>
        <h1>Protected</h1>
        <form onSubmit={logout}>
          <button type="submit">Logout</button>
        </form>
      </>
    );
  }
  
export default Protected;