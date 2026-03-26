import { useAuth0 } from "@auth0/auth0-react";

const Home = () => {
  const {
    loginWithRedirect,
    isAuthenticated,
    user,
    isLoading,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  const handleGetToken = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log("ACCESS TOKEN:", token);

      // ✅ Use user directly
      console.log("Name:", user?.name, "email:", user?.email);

    } catch (error) {
      console.error("Error getting token:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={loginWithRedirect}>Login</button>
      ) : (
        <>
          <h2>Welcome {user?.name}</h2>

          <button onClick={handleGetToken}>
            Get Access Token
          </button>

          <button
            onClick={() =>
              logout({
                logoutParams: { returnTo: window.location.origin },
              })
            }
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default Home;