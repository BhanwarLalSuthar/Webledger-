import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setAuth } from "./store_slices/authSlice";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import SavedRecipes from "./pages/SavedRecipes";
import Register from "./pages/Register";
import Home from "./pages/Home";
import About from "./pages/About";
import AuthSuccess from "./pages/AuthSuccess";
// import ProtectedRoute from "./components/ProtectedRoute"; // Optional, see below

const AppRoutes = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem("accessToken");
      const user = JSON.parse(localStorage.getItem("user"));
      dispatch(setAuth({ token, user }));
    };

    // Sync on initial load
    syncAuth();

    // Listen for storage changes (e.g., from login/logout in another tab)
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
    };
  }, [dispatch]);

  return (
    <Router future={{ v7_relativeSplatPath: true }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Protect SavedRecipes route */}
        <Route
          path="/saved"
          element={
            // <ProtectedRoute>
              <SavedRecipes />
            // </ProtectedRoute>
          }
        />
        <Route path="/auth/success" element={<AuthSuccess />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;