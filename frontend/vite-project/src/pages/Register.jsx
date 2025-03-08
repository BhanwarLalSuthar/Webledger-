import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import './Register.css';

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    const payload = { name, email, password: pass };

    fetch('http://localhost:3030/auth/register', {
      method: 'POST',
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        navigate('/login');
      })
      .catch((error) => console.log(error));
  };

  const googleRegister = useGoogleLogin({
    onSuccess: async (response) => {
      console.log("Google Token Response:", response)
      try {
        const res = await fetch('http://localhost:3030/auth/google', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: response.access_token })
        });

        const data = await res.json();
        console.log("Google API Response:", data); // Debug response
        if (!res.ok) throw new Error(data.message || "Google registration failed!");
        alert(data.message);
        if (res.ok){

          navigate('/');
        }
      } catch (error) {
        console.error("Google Register Error:", error);
        alert("Google registration failed! Please try again.");
      }
    },
    onError: () => alert("Google Signup Failed"),
    flow: "implicit",
  });

  return (
    <div className="register-container">
      <h2 className="register-heading">Register</h2>
      <form className="register-form" onSubmit={(e) => e.preventDefault()}>
        <input type="text" placeholder="Name" className="register-input" required onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" className="register-input" required onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="register-input" required onChange={(e) => setPass(e.target.value)} />
        <button type="button" className="register-button" onClick={handleRegister}>Register</button>
        <button type="button" className="google-login-button" onClick={() => googleRegister()}>
          Sign up with Google
        </button>
        <p className="register-footer-text">
          Already have an account? <button type="button" className="login-link" onClick={() => navigate('/login')}>Login</button>
        </p>
      </form>
    </div>
  );
}

export default Register;
