import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Added useSelector
import { login } from "../store_slices/authSlice";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth); // Add state monitoring

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission default behavior
    try {
      const result = await dispatch(login({ email, password: pass })).unwrap();
      alert(result.message || "Login successful");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message || "Login failed");
    }
  };

  const googleLogin = () => {
    window.location.href = "http://localhost:3030/auth/google";
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={email}
          required
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={pass}
          required
          disabled={loading}
          onChange={(e) => setPass(e.target.value)}
        />
        {error && <p className="error-text">{error}</p>}
        <button 
          type="submit" 
          className="login-button" 
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <button
          type="button"
          className="google-login-button"
          onClick={googleLogin}
          disabled={loading}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google Logo"
            className="google-logo"
          />
          Continue with Google
        </button>
        <p className="login-footer-text">
          Don't have an account?{" "}
          <button
            type="button"
            className="signup-link"
            onClick={() => navigate("/register")}
            disabled={loading}
          >
            Signup
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;