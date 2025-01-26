import { useSelector } from "react-redux";


function Home() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return (
    <>
      <h1>Home</h1>
      {
        isAuthenticated && 
        <p>Logged in</p>
      }

      {
        isAuthenticated &&
        <p>{user?.data?.username}</p>
      }
    </>
  );
}

export default Home;