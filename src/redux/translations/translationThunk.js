import { setTranslations } from "./translationSlice";
import { useApi } from "../../services/useApi";

export const fetchTranslations = () => async (dispatch) => {
  try {
    const api = useApi();
    const response = await api.get("/translation");
    dispatch(setTranslations(response.data.data));
  } catch (e) {
    console.error(e);
  }
};
