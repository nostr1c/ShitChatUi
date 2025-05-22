import { useSelector } from "react-redux";
import "./scss/Home.scss";


function Home() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

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