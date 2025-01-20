import { useSelector } from "react-redux";


function Home() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

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