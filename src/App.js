import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("useEffect called");

    fetch("https://jsonplaceholder.typicode.com/users")
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);
  
  return (
    <div style={{ padding: "20px" }}>
      <h1>Users List</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;


// React calls App() → renders <p>Loading...</p>
// React runs useEffect() → starts fetch()
// Fetch finishes → calls setUsers(data) and setLoading(false)
// State updates → React re-renders App() → now loading = false
// return produces <ul> with users → DOM updates

// The component function runs again 
// The Virtual DOM is recalculated
// But the real DOM updates only if something changed visually
// ✅ Correct version (say this in interviews):
// “State changes cause a re-render of the component,
// but React updates only the affected parts of the DOM using virtual DOM diffing.”

// React re-renders a component when state or props change to a new value.
// If the state value is the same, React bails out and skips re-rendering.
// However, components may still re-render due to parent renders or StrictMode in development.

