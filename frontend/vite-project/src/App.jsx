import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import Search from "./pages/Search";


import Login from "./pages/Login";
import SavedRecipes from "./pages/SavedRecipes";
import Register from "./pages/Register";
import Home from "./pages/Home";
import About from "./pages/About";


const AppRoutes = () => {


	

  return (
   
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/saved" element={<SavedRecipes />} />
   
      </Routes>
    </Router>

    
  );
};

export default AppRoutes;