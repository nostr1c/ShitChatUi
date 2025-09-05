import { Link, Navigate, useParams } from "react-router-dom";
import "./scss/ChatSettings.scss"
import { useState } from "react";
import ChatSettingsGeneral from "../components/ChatSettingsGeneral";
import ChatSettingsInvites from "../components/ChatSettingsInvites";
import ChatSettingsRoles from "../components/ChatSettingsRoles";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { usePermission } from "../services/usePermission";

const tabs = [
  { component: ChatSettingsGeneral, name: "General", key: "general", requiredPermissions: ["manage_server"] },
  { component: ChatSettingsInvites, name: "Invites", key: "invites", requiredPermissions: ["manage_invites"] },
  { component: ChatSettingsRoles, name: "Roles", key: "roles", requiredPermissions: ["manage_server_roles"] }
];

function ChatSettings() {
  const { id: roomId} = useParams();
  const user = useSelector((state) => state.auth.user);

  const allowed = usePermission(roomId, user.id, [
    "manage_server",
    "manage_roles",
    "manage_invites"
  ]);

  if (!allowed) return <Navigate to={`/chat/${roomId}`} replace />


  const [currentTabKey, setCurrentTabKey] = useState("general");


  const availableTabs = tabs.filter(tab => {
    if (!tab.requiredPermissions) return true;
    return tab.requiredPermissions.some(p => usePermission(roomId, user.id, [p]));
  });

  const currentTab = availableTabs.find(tab => tab.key === currentTabKey);
  const CurrentComponent = currentTab?.component || (() => <div>Tab not found</div>);

  return (
    <div className="ChatSettings">
      <div className="ChatSettings--Header">
        <div className="Top">
          <Link to={`/chat/${roomId}`}>
            <IoCloseCircleOutline />
          </Link>
          <h2>Settings</h2>
        </div>
        <div className="Tabs">
          {availableTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setCurrentTabKey(tab.key)}
              className={tab.key === currentTabKey ? "active" : ""}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
      <div className="ChatSettings--Content">
        <CurrentComponent />
      </div>
    </div>
  )
}

export default ChatSettings