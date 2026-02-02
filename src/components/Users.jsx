import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState, useRef } from "react";
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

function Users() {
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

  useEffect(() => {
    fetchUsers();
    bsModal.current = new bootstrap.Modal(modalRef.current);
    deleteBsModal.current = new bootstrap.Modal(deleteModalRef.current);
    toastInstance.current = new bootstrap.Toast(toastRef.current,{ delay: 4000 });
  }, []);

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    toastInstance.current?.show();
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

  const addUser = async () => {
    if (!newUser.trim()) return;
    try {
      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newUser })
      });
      const data = await response.json();
      setUsers([...users, data]);
      setNewUser("");
      showToast("User added successfully");
    } catch {
      setError("Failed to add user");
    }
  };

  const openEditModal = (user) => {
    setEditName(user.name);
    setEditId(user.id);
    bsModal.current.show();
  };

  const saveEdit = async () => {
    if (!editName.trim()) return;
    try {
      const response = await fetch(`http://localhost:5000/users/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName })
      });
      const data = await response.json();
      setUsers(users.map(u => (u.id === editId ? data : u)));
      bsModal.current.hide();
      showToast("User updated successfully");
    } catch {
      setError("Failed to update user");
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    deleteBsModal.current.show();
  };

  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:5000/users/${deleteId}`, { method: "DELETE" });
      setUsers(users.filter(u => u.id !== deleteId));
      deleteBsModal.current.hide();
      showToast("User deleted successfully");
    } catch {
      setError("Failed to delete user");
      showToast("Something went wrong", "danger");
    }
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    window.location.reload();
  };

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Users Dashboard</h2>
        <button className="btn btn-dark btn-sm" onClick={logout}>Logout</button>
      </div>

      {/* Add User Card */}
      <div className="card p-3 mb-4 shadow-sm rounded">
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Add new user"
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
          />
          <button className="btn btn-success" onClick={addUser}>
            <FaPlus /> Add
          </button>
        </div>
      </div>

      {/* Users Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <div className="row g-3">
          {users.map(user => (
            <div className="col-md-4" key={user.id}>
              <div className="card shadow-sm rounded p-3 d-flex justify-content-between align-items-center">
                <span className="fw-medium">{user.name}</span>
                <div>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(user)}>
                    <FaEdit />
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => openDeleteModal(user.id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <div className="modal fade" ref={modalRef} tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit User</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" />
            </div>
            <div className="modal-body">
              <input type="text" className="form-control" value={editName} onChange={e => setEditName(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button className="btn btn-primary" onClick={saveEdit}>Save</button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <div className="modal fade" ref={deleteModalRef} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-danger">Confirm Delete</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" />
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this user?</p>
              <p className="text-muted mb-0">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className={`toast fade align-items-center text-white bg-${toastType} position-fixed top-0 end-0 m-4`}
        ref={toastRef} role="alert" aria-live="assertive" aria-atomic="true">
        <div className="d-flex">
          <div className="toast-body">{toastMessage}</div>
          <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" />
        </div>
      </div>
    </div>
  );
}

export default Users;



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

