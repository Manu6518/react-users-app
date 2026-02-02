import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa"; // Make sure to install react-icons

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/authUsers?email=${email}&password=${password}`
      );
      const data = await response.json();

      if (data.length === 1) {
        localStorage.setItem("authUser", JSON.stringify(data[0]));
        onLogin();
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "#f0f2f5" }}
    >
      <div
        className="card p-4 shadow-sm"
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "12px",
          animation: "fadeIn 0.5s ease",
        }}
      >
        <h3 className="card-title text-center mb-4">Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Email input */}
        <div className="input-group mb-3">
          <span className="input-group-text bg-white border-end-0">
            <FaEnvelope />
          </span>
          <input
            type="email"
            className="form-control border-start-0"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ transition: "0.3s" }}
          />
        </div>

        {/* Password input */}
        <div className="input-group mb-3">
          <span className="input-group-text bg-white border-end-0">
            <FaLock />
          </span>
          <input
            type="password"
            className="form-control border-start-0"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ transition: "0.3s" }}
          />
        </div>

        {/* Remember / Forgot */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <input type="checkbox" id="remember" className="form-check-input" />
            <label htmlFor="remember" className="form-check-label ms-1">
              Remember me
            </label>
          </div>
          <a href="#" className="text-decoration-none" style={{ fontSize: "0.9rem" }}>
            Forgot password?
          </a>
        </div>

        {/* Gradient login button */}
        <button
          className="btn w-100 text-white"
          onClick={handleLogin}
          style={{
            background: "linear-gradient(90deg, #4b6cb7, #182848)",
            border: "none",
            padding: "0.5rem",
            fontWeight: "500",
            transition: "0.3s",
          }}
          onMouseOver={(e) =>
            (e.target.style.background = "linear-gradient(90deg, #182848, #4b6cb7)")
          }
          onMouseOut={(e) =>
            (e.target.style.background = "linear-gradient(90deg, #4b6cb7, #182848)")
          }
        >
          Login
        </button>

        <p className="text-center mt-3" style={{ fontSize: "0.9rem" }}>
          Don't have an account?{" "}
          <a href="#" className="text-decoration-none">
            Sign Up
          </a>
        </p>
      </div>

      {/* Smooth fade-in animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .form-control:focus {
            box-shadow: 0 0 8px rgba(75, 108, 183, 0.4);
            border-color: #4b6cb7;
          }
        `}
      </style>
    </div>
  );
}

export default Login;
