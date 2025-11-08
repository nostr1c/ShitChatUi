import { useApi } from "../../services/useApi";
import { toast } from "react-toastify";
import { deleteConnection, pushAcceptedConnection, setConnections } from "./connectionSlice";
import { useDispatch, useSelector } from "react-redux";

export const useConnectionActions = () => {
  const api = useApi();
  const dispatch = useDispatch();
  const translations = useSelector((state) => state.translations.english);

  const fetchFriends = async () => {
    try {
      const { data } = await api.get("user/connections");
      dispatch(setConnections(data.data));
    } catch (error) {
      console.error("Error fetching friends:", error);
      toast.error("Failed to load friends.");
    }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      const response = await api.put(`connection/accept?friendId=${userId}`);
      toast.success(response.data.message);
      const connection = response.data.data;
      dispatch(pushAcceptedConnection({ connection }));
    } catch (e) {
      toast.error(e.response?.data?.message || e);
    }
  };

  const handleDeleteRequest = async (userId) => {
    try {
      const response = await api.delete(`connection/delete?friendId=${userId}`);
      toast.success(translations[response.data.message]);
      const connection = response.data.data;
      dispatch(deleteConnection({ connection }));
    } catch (e) {
      toast.error(translations[e.response?.data?.message] || "Failed to delete request");
    }
  };
  
  return { fetchFriends, handleAcceptRequest, handleDeleteRequest };
};