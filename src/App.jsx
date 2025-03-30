import { Route, Routes } from "react-router-dom"
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { RxHamburgerMenu } from "react-icons/rx";
import { useState } from "react";
import "./scss/App.scss"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./features/auth/authThunks";
import EditProfile from "./pages/EditProfile";
import ToastParent from "./components/ToastParent";
import Chat from "./pages/Chat";
import { signalRService } from "./services/signalRService";
import { pushMesage, setUserTyping } from "./features/chat/chatSlice";

function App() {
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.chat.rooms);

  useEffect(() => {
     dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (rooms && rooms.length > 0) {
      signalRService.startConnection(rooms).then(() => {
        if (signalRService.connection.state === "Connected") {

          signalRService.on("ReceiveMessage", (message, room) => {
            console.log("New message received:", message);
            dispatch(pushMesage({ room: room, message }));
          });

          signalRService.on("ReceiveUserTyping", (room, user, isTyping) => {
            console.log("Typing:", room, user, isTyping);
            dispatch(setUserTyping({ room, user, isTyping }))
          });
        }
      });
    }
  }, [rooms]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState);
  }

  return (
    <>
      <ToastParent />
      <div className="Main">
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
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </>

  )
}

export default App