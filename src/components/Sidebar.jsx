import { useSelector } from 'react-redux';
import './scss/Sidebar.scss';
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiLogout, CiEdit  } from "react-icons/ci";
import { useState } from 'react';
import { useDispatch } from "react-redux";
import { clearUser } from "../features/auth/authSlice";
import { useApi } from "../services/useApi";

function Sidebar() {
  const api = useApi();
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
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
      <h1>ShitChat</h1>
      {
        !isAuthenticated ?
        <p>Not logged in</p>
        : (
          <div className='Sidebar--User'>
            <img
              src="https://www.looper.com/img/gallery/the-hunger-games-how-old-is-katniss-everdeen-when-the-series-begins-ends/l-intro-1693256055.jpg"
              alt=""
              className='Sidebar--User--Avatar'
            />
            <div className='Sidebar--User--Text'>
              <h3>Filip Siri</h3>
              <h4>Senior developer</h4>
            </div>
            <div
              className='Sidebar--User--Btn'
              onClick={toggleModal}
            >
              <BsThreeDotsVertical />
              <div className={`Sidebar--User--Btn--Modal ${modalOpen ? "Active" : null}`}>
                <div className='Sidebar--User--Btn--Modal--Link'>
                  <CiEdit />
                  <p>Edit profile</p>
                </div>
                <div onClick={logout} className='Sidebar--User--Btn--Modal--Link'>
                  <CiLogout />
                  <p>Logout</p>
                </div>
              </div>
            </div>
          </div>
        )
      }

    </div>
  );
}

export default Sidebar;