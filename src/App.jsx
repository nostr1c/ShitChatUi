import { Route, Routes, useLocation } from "react-router-dom"
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { RxHamburgerMenu } from "react-icons/rx";
import { useState } from "react";
import "./scss/App.scss"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./redux/auth/authThunks";
import EditProfile from "./pages/EditProfile";
import CreateChat from "./pages/CreateChat";
import Chat from "./pages/Chat";
import { signalRService } from "./services/signalRService";
import ChatSettings from "./pages/ChatSettings";
import Join from "./pages/Join";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import { fetchTranslations } from "./redux/translations/translationThunk";
import Topbar from "./components/TopBar";
import Friends from "./pages/Friends";

function App() {
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.chat.rooms);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  // Initially fetch the user.
  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchTranslations());
  }, []);

  // Close sidebar when change room.
  useEffect(() => {
    setSidebarOpen(false);
  }, [location])

  // Start signalr connection, join groups, attach listeners
  useEffect(() => {
    const roomsArray = rooms ? Object.values(rooms) : [];
    if (roomsArray.length > 0) {
      signalRService.startConnection(roomsArray).then(() => {
        if (signalRService.connection.state === "Connected") {
          signalRService.attachListeners(dispatch);
        }
      });
    }
  }, [rooms]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState);
  }

  // Because mobile is weird
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();
    window.addEventListener('resize', setVh);

    return () => {
      window.removeEventListener('resize', setVh);
    };
  }, []);

  return (
    <>
      <ToastContainer
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        draggablePercent={20}
        pauseOnHover
        theme="dark"
      />
      <div className="Main">
        {isAuthenticated && (
          <>
            {/* <Topbar /> */}
            <div className={`Sidebar-Wrapper ${sidebarOpen ? 'open' : ''}`}>
              <Sidebar />
            </div>
            <div className="Mobile-Top">
              <button 
                className="Sidebar-toggle"
                onClick={toggleSidebar}
                aria-label="Toggle Sidebar"
              >
                <RxHamburgerMenu />
              </button>
            </div>
          </>
        )}

        <main className="Content">
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/profile/edit" element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } />
            <Route path="/chat/:id" element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } />
            <Route path="/chat/create" element={
              <ProtectedRoute>
                <CreateChat />
              </ProtectedRoute>
            } />
            <Route path="/chat/:id/settings" element={
              <ProtectedRoute>
                <ChatSettings />
              </ProtectedRoute>
            } />
            <Route path="/:id" element={
              <ProtectedRoute>
                <Join />
              </ProtectedRoute>
            } />
            <Route path="/friends" element={
              <ProtectedRoute>
                <Friends />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </>

  )
}

export default App