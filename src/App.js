import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState, useRef } from "react";
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { type } from '@testing-library/user-event/dist/type';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState("");
  const [editName, setEditName] = useState("");
  const [editId, setEditId] = useState(null);

  const modalRef = useRef(null);
  let bsModal = useRef(null);

  const deleteModalRef = useRef(null);
  const deleteBsModal = useRef(null);
  const [deleteId, setDeleteId] = useState(null);

  const toastRef = useRef(null);
  const toastInstance = useRef(null);

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  //Fetch users from JSON Server
  useEffect(() => {
    fetchUsers();
    bsModal.current = new bootstrap.Modal(modalRef.current);
    deleteBsModal.current = new bootstrap.Modal(deleteModalRef.current);
    toastInstance.current = new bootstrap.Toast(toastRef.current,{
      delay: 10000
    });
    
  }, []);

  const showToast = (message, type = "success") =>{
    setToastMessage(message);
    setToastType(type);
    toastInstance.current.show();
  };

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
      showToast("User added successfully");
    } catch (err) {
      setError("Failed to add user");
    }
  };

  // Delete user
  // const deleteUser = async (id) => {
  //   try {
  //     await fetch(`http://localhost:5000/users/${id}`, { method: "DELETE" });
  //     setUsers(users.filter(u => u.id !== id));
  //   } catch {
  //     setError("Failed to delete user");
  //   }
  // };
  const openDeleteModal = (id) =>{
    setDeleteId(id);
    deleteBsModal.current.show();
  };

  const confirmDelete = async () =>{
    try{
      await fetch(`http://localhost:5000/users/${deleteId}`, { 
        method: "DELETE" 
      });
      setUsers(users.filter(u=> u.id !== deleteId));
      deleteBsModal.current.hide();
      showToast("User deleted successfully");
    }
    catch{
      setError("Failed to delete user");
      showToast("Something went wrong", "Danger");
    }
  };
  // Update user
  // const updateUser = async (id) => {
  //   const newName = prompt("Enter new name:");
  //   if (!newName) return;

  //   try {
  //     const response = await fetch(`http://localhost:5000/users/${id}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ name: newName })
  //     });
  //     const data = await response.json();
  //     setUsers(users.map(u => (u.id === id ? data : u)));
  //   } catch {
  //     setError("Failed to update user");
  //   }
  // };

  const openEditModal = (user) =>{
     setEditName(user.name);
     setEditId(user.id);
     bsModal.current.show();
     //const modalEl = document.getElementById("editUserModal");
     //const modal = new window.bootstrap.Modal(modalEl);
     //modal.show();
  };

  //save edited user
  const saveEdit = async () =>{
    if(!editName.trim()) return;

    try{
      const response = await fetch(`http://localhost:5000/users/${editId}`, {
        method: "PUT",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({name:editName})
      });
      const data = await response.json();
      setUsers(users.map(u => (u.id === editId ? data : u)));

      //hide modal
      bsModal.current.hide();
      showToast("User updated successfully");
      // const modalEl = document.getElementById("editUserModal");
      // const modal = window.bootstrap.Modal.getInstance(modalEl);
      // modal.hide();
    }
    catch{
      setError("Failed to update user");
    }
  };

  return (
    <div className="container mt-5" style={{background: "cadetblue", padding:"20px", borderRadius:"10px"}}>
      <h1 className="text-center mb-4">Users List</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Add new user"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addUser}>Add</button>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <ul className="list-group" style={{paddingBottom:"20px"}}>
          {users.map(user => (
            <li
              key={user.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {user.name}
              <div>
                <button className="btn btn-sm btn-warning me-2" onClick={() => openEditModal(user)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => openDeleteModal(user.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="modal fade" ref={modalRef} tabIndex="-1" aria-labelledby="editUserLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editUserLabel">Edit User</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" onClick={saveEdit}>Save</button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div className="modal fade" ref={deleteModalRef} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-danger">Confirm Delete</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <p>Are you sure you want to delete this user?</p>
              <p className="text-muted mb-0">This action cannot be undone.</p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <div className={`toast fade show align-items-center text-white bg-${toastType} position-fixed top-0 end-0 m-4`}
        ref={toastRef} role="alert" aria-live="assertive" aria-atomic="true" >
        <div className="d-flex">
          <div className="toast-body">
            {toastMessage}
          </div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
          ></button>
        </div>
      </div>


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

