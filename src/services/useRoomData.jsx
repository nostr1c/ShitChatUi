import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMembersToRoom, addMessage, setRoomInfo, setRoomRoles } from "../redux/chat/chatSlice";
import { useApi } from "../services/useApi";

export const useRoomData = (roomId) => {
  const api = useApi();
  const dispatch = useDispatch();
  const { messages, roomMembers, roomInfo, roomRoles } = useSelector((state) => state.chat);

  useEffect(() => {
    if (!roomId) return;

    const fetchData = async () => {
      try {
        if (!messages[roomId]) {
          const { data } = await api.get(`group/${roomId}/messages`);
          dispatch(addMessage({ room: roomId, message: data.data }));
        }
        if (!roomMembers[roomId]) {
          const { data } = await api.get(`group/${roomId}/members`);
          dispatch(addMembersToRoom({ room: roomId, members: data.data }));
        }
        if (!roomInfo[roomId]) {
          const { data } = await api.get(`group/${roomId}`);
          dispatch(setRoomInfo({ room: roomId, data: data.data }));
        }
        if (!roomRoles[roomId]) {
          const { data } = await api.get(`group/${roomId}/roles`);
          dispatch(setRoomRoles({ room: roomId, data: data.data }));
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchData();
  }, [roomId]);

  return { messages, roomMembers, roomInfo, roomRoles };
};
