import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { GetImageUrl } from '../utils/general';
import GroupChats from './GroupChats';
import SidebarLinks from './SidebarLinks';
import './scss/Sidebar.scss';
import { FaUserEdit } from "react-icons/fa";

function Sidebar() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="Sidebar">
      <Link to="/"><h1>ShitChat</h1></Link>
      <>
      <div className='Sidebar--User'>
        <img
          src={GetImageUrl(user?.avatar)}
          alt=""
          className='Sidebar--User--Avatar'
        />
        <div className='Sidebar--User--Text'>
          <h3>{user?.username}</h3>
          <h4>Some description i guess</h4>
        </div>
        <NavLink
          className="Sidebar--User--Edit"
          to={"/profile/edit"}
        >
          <FaUserEdit />
        </NavLink>
      </div>
      <SidebarLinks />
      <GroupChats/> 
    </>
    </div>
  );
}

export default Sidebar;