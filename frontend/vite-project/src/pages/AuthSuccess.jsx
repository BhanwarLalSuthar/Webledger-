import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

function AuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("accessToken", token);
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    } else {
      alert("Authentication failed");
      navigate("/login");
    }
  }, [navigate]);

  return <div>Processing authentication...</div>;
}

export default AuthSuccess;
