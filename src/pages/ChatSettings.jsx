import { Link, useParams } from "react-router-dom";
import "./scss/ChatSettings.scss"
import { useState } from "react";
import ChatSettingsGeneral from "../components/ChatSettingsGeneral";
import ChatSettingsInvites from "../components/ChatSettingsInvites";
import ChatSettingsRoles from "../components/ChatSettingsRoles";
import { IoCloseCircleOutline } from "react-icons/io5";

const tabs = [
  { component: ChatSettingsGeneral, name: "General", key: "general" },
  { component: ChatSettingsInvites, name: "Invites", key: "invites" },
  { component: ChatSettingsRoles, name: "Roles", key: "roles" }
];

function ChatSettings() {
  const params = useParams();
  const [currentTabKey, setCurrentTabKey] = useState("general");

  const currentTab = tabs.find(tab => tab.key === currentTabKey);
  const CurrentComponent = currentTab?.component || (() => <div>Tab not found</div>);

  return (
    <div className="ChatSettings">
      <div className="ChatSettings--Header">
        <div className="Top">
          <Link to={`/chat/${params.id}`}>
            <IoCloseCircleOutline />
          </Link>
          <h2>Settings</h2>
        </div>
        <div className="Tabs">
          {tabs.map(tab => (
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
        <CurrentComponent params={params} />
      </div>
    </div>
  )
}

export default ChatSettings