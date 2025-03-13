import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector,  } from "react-redux";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const { isAuthenticated = false } = useSelector((state) => state.auth || {})
  // Listen for login/logout changes
  useEffect(() => {
    const syncUser = () => setUser(JSON.parse(localStorage.getItem("user")));
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("storage")); // Notify other components
    navigate("/login");
  };
  const handleGoToSaved = () => {
    if (!isAuthenticated) {
      alert('Please login to view saved recipes.');
      navigate('/login');
      return;
    }
    navigate('/saved');
  };


  return (
    <nav className="bg-gradient-to-r from-purple-600 to-pink-500 p-4 text-white shadow-lg w-full fixed top-0 left-0 z-50">
      <div className="flex justify-between items-center px-6 max-w-full">
        <h1 className="text-2xl font-extrabold tracking-wide">Recipe App</h1>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={30} className="text-white" /> : <Menu size={30} className="text-white" />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <NavItem to="/" label="Home" />
          <NavItem to="/about" label="About" />
          <NavItem to="/saved" label="Saved Recipes" />
          {/* <NavItem to="/login" label="Login" />
          <NavItem to="/register" label="Register" /> */}

          {user ? (
            <>
              <span className="px-4 py-2">{user.name}</span>
              <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavItem to="/login" label="Login" />
              <NavItem to="/register" label="Register" />
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col space-y-3 mt-4 text-center bg-white text-gray-900 p-4 rounded-lg shadow-md w-full">
          <NavItem to="/" label="Home" mobile />
          <NavItem to="/about" label="About" mobile />
          <NavItem to="/saved" label="Saved Recipes" mobile />
          <NavItem to="/login" label="Login" mobile />
          <NavItem to="/register" label="Register" mobile />

          {user ? (
            <>
              <span className="block py-3 rounded-lg text-lg">{user.name}</span>
              <button onClick={handleLogout} className="block py-3 rounded-lg bg-red-500 hover:bg-red-600 transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavItem to="/login" label="Login" mobile />
              <NavItem to="/register" label="Register" mobile />
            </>
          )}
        </div>
      )}
    </nav>
  );
};

// NavItem Component for reusable menu items
const NavItem = ({ to, label, mobile }) => (
  <Link
    to={to}
    className={`${
      mobile
        ? "block py-3 rounded-lg text-lg hover:bg-gray-200 transition"
        : "px-4 py-2 rounded-lg hover:bg-white hover:text-gray-900 transition duration-300"
    }`}
  >
    {label}
  </Link>
);

export default Navbar;
