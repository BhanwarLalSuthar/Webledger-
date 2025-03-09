import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import './Login.css';

function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const payload = { email, password: pass };

    fetch('http://localhost:3030/auth/login', {
      method: 'POST',
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token){

          alert(data.message);
          localStorage.setItem("accessToken", data.token);
          localStorage.setItem("user", JSON.stringify(data.user)); // Store user info
          window.dispatchEvent(new Event("storage")); // Notify other components
          navigate("/");
        }else {
          alert('Login failed');
        }
      })
      .catch((error) => console.log(error));
  };

  const googleLogin = useGoogleLogin({
    
    
    onSuccess: async (response) => {
      try {
        const res = await fetch('http://localhost:3030/auth/google', {
          method: 'POST', // Change GET to POST for better security
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: response.code }) // Send auth code to backend

        });

        const data = await res.json();
        if (data.token) {
          alert(data.message);
          localStorage.setItem("accessToken", data.token);
          localStorage.setItem("user", JSON.stringify(data.user)); // Store user info
          window.dispatchEvent(new Event("storage")); // Notify navbar to update
          navigate("/");
        } else {
          alert("Google Login Failed!");
      }
     } catch (error) {
        console.error("Google Login Error:", error);
      }
    },
    onError: () => alert("Google Login Failed"),
    flow: "auth-code",
    ux_mode: "popup"
  });

  return (
    <div className="login-container">
      <h2 className="login-heading">Login</h2>
      <form className="login-form">
        <input type="email" placeholder="Email" className="login-input" required onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="login-input" required onChange={(e) => setPass(e.target.value)} />
        <button type="button" className="login-button" onClick={handleLogin}>Login</button>
        <button type="button" className="google-login-button" onClick={() => googleLogin()}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google Logo" className="google-logo" />
          Continue with Google
        </button>

        <p className="login-footer-text">
          Don't have an account? <button type="button" className="signup-link" onClick={() => navigate('/register')}>Signup</button>
        </p>
      </form>
    </div>
  );
}

export default Login;
