import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AiFillHeart } from 'react-icons/ai';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    const getUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== 'undefined') {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error parsing user:', err);
        localStorage.removeItem('user');
        setUser(null);
      }
    };

    getUserFromStorage();
    window.addEventListener('storage', getUserFromStorage);
    return () => window.removeEventListener('storage', getUserFromStorage);
  }, []);

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="bg-white/80 backdrop-blur-md fixed w-full z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-1 text-2xl font-semibold tracking-tight text-gray-800 hover:text-rose-500 transition-all duration-200"
        >
          <img
            src="/images/logo.chef.webp"
            alt="Chef Logo"
            className="h-10 w-10 rounded-full shadow-md border border-rose-200"
          />
          <span className="text-3xl font-serif text-gray-900">Chef</span>
          <span className="text-3xl font-mono text-rose-500">AI</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center text-[16px] font-[Poppins] text-gray-700">
          <Link to="/home" className=" text-sm hover:text-rose-500 transition font-medium">
            Home
          </Link>
          <Link to="/smartkitchen" className="text-sm hover:text-rose-500 transition font-medium">
            Smart-Kitchen
          </Link>
          <Link to="/create" className="relative inline-block hover:text-rose-500 transition font-medium">
            <span className="text-sm">Create</span>
            <span className="absolute -top-2 -right-3 text-[10px] font-bold uppercase text-pink-600 bg-pink-100 px-1 rounded-sm">
              AI
            </span>
          </Link>

          <Link to="/recipe" className=" text-sm hover:text-rose-500 transition font-medium">
            Recipe
          </Link>
          <Link
  to="/savedrecipe"
  className="flex items-center space-x-2 text-sm text-gray-700 font-medium hover:text-rose-500 transition"
>
  <AiFillHeart className="text-base text-rose-600" />
  <span>Favourites</span>
</Link>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={toggleDropdown} className="flex items-center gap-2">
                <img
                  src={
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${user?.name}&background=FBCFE8&color=9F1239`
                  }
                  alt="avatar"
                  className="w-10 h-10 rounded-full border border-rose-300 shadow-sm"
                />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 text-sm"
                  >
                    <div className="px-4 py-3 border-b">
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-gray-600 text-xs">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow hover:from-pink-500 hover:to-rose-500 transition"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Hamburger */}
        <button className="md:hidden text-gray-700" onClick={toggleMenu}>
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-6 pt-4 pb-6 space-y-4 text-base text-gray-700 font-[Poppins] shadow-md rounded-b-xl">
          <Link to="/home" onClick={toggleMenu} className="block hover:text-rose-500">
            Home
          </Link>
          <Link to="/smartkitchen" onClick={toggleMenu} className="block hover:text-rose-500">
            Smart-Kitchen
          </Link>
          <Link to="/create" onClick={toggleMenu} className="block hover:text-rose-500  flex-col items-start">
            <span className="text-xs font-bold uppercase tracking-wide text-pink-500 leading-none">AI <br/></span>
            <span>Create</span>
          </Link>
          <Link to="/recipe" onClick={toggleMenu} className="block hover:text-rose-500">
            Recipe
          </Link>
          <Link to="/savedrecipe" onClick={toggleMenu} className="block hover:text-rose-500 items-center gap-2">
            <AiFillHeart className="text-rose-500 text-lg" />
            <span>Favourites</span>
          </Link>

          {user ? (
            <div className="bg-gray-50 mt-4 rounded-lg p-4 shadow text-center">
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${user?.name}&background=FBCFE8&color=9F1239`
                }
                alt="avatar"
                className="w-14 h-14 mx-auto rounded-full mb-2 border border-rose-300"
              />
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-gray-600 text-xs mb-3">{user.email}</p>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="bg-rose-500 text-white w-full py-2 rounded-full font-semibold hover:bg-rose-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              <div className="mt-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-center py-2 rounded-full font-semibold shadow">
                Login
              </div>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
