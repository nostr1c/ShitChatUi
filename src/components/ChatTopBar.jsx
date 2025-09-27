import { Link } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import PermissionGate from "./PermissionGate";

export default function ChatTopBar({ room, onToggleSidebar, userId }) {
  return (
    <div className="Chat--Top">
      {room && (
        <PermissionGate
          roomId={room.id}
          userId={userId}
          permissions={["manage_server", "manage_server_roles", "manage_invites"]}
        >
          <Link className="Chat--Top--Btn Settings" to={"settings"}>
            <IoIosSettings />
          </Link>
        </PermissionGate>
      )}
      <h1>{room ? room.name : "Loading..."}</h1>
      <button className="Chat--Top--Btn Sidebar" onClick={onToggleSidebar}>
        <FaUserFriends />
      </button>
    </div>
  );
}
