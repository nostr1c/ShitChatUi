import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { useApi } from "../services/useApi";
import { CiLogout, CiEdit  } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { clearUser } from "../features/auth/authSlice";
import { GetImageUrl } from '../utils/general';
import FriendsList from './FriendsList';
import GroupChats from './GroupChats';
import './scss/Sidebar.scss';

function Sidebar() {
  const api = useApi();
  const dispatch = useDispatch();
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(prevState => !prevState);
  }

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
    <div className="Sidebar">
      <Link to="/"><h1>ShitChat</h1></Link>
      {
        !isAuthenticated ?
        <p>Not logged in</p>
        : (
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
            <div
              className='Sidebar--User--Btn'
              onClick={toggleModal}
            >
              <BsThreeDotsVertical />
              <div className={`Sidebar--User--Btn--Modal ${modalOpen ? "Active" : null}`}>
                <Link to={"/profile/edit"} className='Sidebar--User--Btn--Modal--Link'>
                  <CiEdit />
                  <p>Edit profile</p>
                </Link>
                <div onClick={logout} className='Sidebar--User--Btn--Modal--Link'>
                  <CiLogout />
                  <p>Logout</p>
                </div>
              </div>
            </div>
          </div>
          <GroupChats closeModal={() => setModalOpen(false)} /> 
          <FriendsList />
        </>
        )
      }

    </div>
  );
}

export default Sidebar;