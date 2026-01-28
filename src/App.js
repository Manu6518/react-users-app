
import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState("");

  // Fetch users from JSON Server
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Add new user
  const addUser = async () => {
    if (!newUser.trim()) return;

    const userToAdd = { name: newUser };

    try {
      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userToAdd)
      });
      const data = await response.json();
      setUsers([...users, data]);
      setNewUser("");
    } catch (err) {
      setError("Failed to add user");
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    try {
      await fetch(`http://localhost:5000/users/${id}`, { method: "DELETE" });
      setUsers(users.filter(u => u.id !== id));
    } catch {
      setError("Failed to delete user");
    }
  };

  // Update user
  const updateUser = async (id) => {
    const newName = prompt("Enter new name:");
    if (!newName) return;

    try {
      const response = await fetch(`http://localhost:5000/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName })
      });
      const data = await response.json();
      setUsers(users.map(u => (u.id === id ? data : u)));
    } catch {
      setError("Failed to update user");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Users List</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        value={newUser}
        onChange={(e) => setNewUser(e.target.value)}
        placeholder="Add new user"
      />
      <button onClick={addUser}>Add</button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {user.name}{" "}
              <button onClick={() => updateUser(user.id)}>Edit</button>{" "}
              <button onClick={() => deleteUser(user.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;


/*
  Previous version of Users List App (for reference / learning):

  - Fetches users from a public API (jsonplaceholder.typicode.com)
  - Uses functional components with useState and useEffect
  - Implements loading state and dynamic rendering
  - No CRUD functionality; read-only display

  This version helped me learn:
  - React hooks and functional components
  - Asynchronous fetch calls
  - Conditional rendering
  - Basic understanding of component re-rendering and virtual DOM

  The current version is upgraded to:
  - Full CRUD operations (Add/Edit/Delete)
  - Connected to a JSON Server backend
  - Includes error handling and improved UI
*/

// import { useEffect, useState } from "react";

// function App() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     console.log("useEffect called");

//     fetch("https://jsonplaceholder.typicode.com/users")
//       .then(response => response.json()) 
//       .then(data => {
//         setUsers(data);
//         setLoading(false);
//       });
//   }, []);
  
//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Users List</h1>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <ul>
//           {users.map(user => (
//             <li key={user.id}>{user.name}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default App;


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

