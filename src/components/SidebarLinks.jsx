import "./scss/SidebarLinks.scss"
import { FaUserFriends } from "react-icons/fa";
import { RiChatNewFill } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";
import { clearUser } from "../redux/auth/authSlice";
import { FaUserEdit } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useApi } from "../services/useApi";

function SidebarLinks() {
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
    <div className="SidebarLinks">
      <div className="SidebarLinks--Header">
        <button
          className="SidebarLinks--Header--Link Logout"
          onClick={logout}
        >
          <CiLogout />
        </button>

        <NavLink
          className="SidebarLinks--Header--Link"
          to={"/friends"}
        >
          <FaUserFriends />
        </NavLink>

        <NavLink
          className="SidebarLinks--Header--Link"
          to={"/chat/create"}
        >
          <RiChatNewFill />
        </NavLink>
      </div>
    </div>
  )
}

export default SidebarLinks;