import { useEffect, useState } from "react";
import Login from "./components/Login";
import Users from "./components/Users";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("authUser");
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <Users />
      ) : (
        <Login onLogin={() => setIsAuthenticated(true)} />
      )}
    </>
  );
}

export default App;


// I separated authentication logic from business features.
// App.js handles authentication state, Login handles credential validation, and Users is a protected component rendered only after login.