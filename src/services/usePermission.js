import { useSelector } from "react-redux";
import { userHasPermission } from "../utils/permissions";

export function usePermission(roomId, userId, permissions) {
  const roomRoles = useSelector((state) => state.chat.roomRoles);
  const roomMembers = useSelector((state) => state.chat.roomMembers);
  const room = useSelector((state) => state.chat.rooms[roomId]);

  return userHasPermission(roomRoles, roomMembers, room, roomId, userId, permissions);
}