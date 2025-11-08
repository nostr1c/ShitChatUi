import { useSelector } from "react-redux";
import "./scss/Home.scss";
import { toast } from "react-toastify";
import FriendRequestToast from "../components/Friends/FriendRequestToast";
import { useEffect } from "react";

function Home() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   toast(
  //     () => (
  //       <FriendRequestToast/>
  //     ),
  //     { autoClose: 5000 }
  //   );
  // }, [])


  return (
    <>
      <div className="Home">
        <h1>
          Welcome, {user?.username}! 
        </h1>
      </div>
    </>
  );
}

export default Home;