import { setUser, clearUser } from "./authSlice";
import { useApi } from "../../services/useApi";

export const fetchUser = () => async (dispatch) => {
  try {
    const api = useApi();
    const response = await api.get("/auth/me");
    dispatch(setUser(response.data));
  } catch {
    dispatch(clearUser());
  }
};
