import { Route, Routes } from "react-router-dom"
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { RxHamburgerMenu } from "react-icons/rx";
import { useState } from "react";
import "./scss/App.scss"
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "./features/auth/authThunks";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);


  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState);
  }

  return (
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
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>

      
    </div>
  )
}

export default App