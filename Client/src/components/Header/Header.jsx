import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "How it works", path: "/how-it-works" },
  { label: "Testimonials", path: "/testimonials" },
  { label: "FAQ's", path: "/faqs" },
  { label: "Shipping", path: "/shipping" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClass = ({ isActive }) =>
    `transition-colors ${
      isActive
        ? "text-teal-600 font-semibold border-b-2 border-teal-600"
        : "text-gray-700 hover:text-teal-600"
    }`;

  const mobileNavClass = ({ isActive }) =>
    `block py-2 border-b transition ${
      isActive
        ? "text-teal-600 font-semibold"
        : "text-gray-700 hover:text-teal-600"
    }`;

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="B2BMart" className="h-8 w-auto" />
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-6 text-sm font-medium">
            {navLinks.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={navClass}
                end={item.path === "/"} // important for Home
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex gap-3">
            <NavLink
              to="/login"
              className="px-4 py-1.5 rounded-md border border-teal-600 text-teal-600 hover:bg-teal-50 transition"
            >
              Log In
            </NavLink>

            <NavLink
              to="/register"
              className="px-4 py-1.5 rounded-md bg-teal-600 text-white hover:bg-teal-700 transition"
            >
              Register
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-gray-700"
            aria-label="Toggle Menu"
          >
            {open ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 space-y-3 bg-white">
          {navLinks.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === "/"}
              onClick={() => setOpen(false)}
              className={mobileNavClass}
            >
              {item.label}
            </NavLink>
          ))}

          <div className="flex gap-3 pt-3">
            <NavLink
              to="/login"
              className="w-full text-center py-2 rounded-md border border-teal-600 text-teal-600"
            >
              Log In
            </NavLink>

            <NavLink
              to="/register"
              className="w-full text-center py-2 rounded-md bg-teal-600 text-white"
            >
              Register
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}
