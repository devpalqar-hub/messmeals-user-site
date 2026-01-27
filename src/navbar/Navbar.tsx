import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        {/* LEFT */}
        <div className="navbar-left">
          <div className="logo-box">
            <span className="logo-icon">🍽️</span>
          </div>
          <span className="logo-text">Kerala Mess Finder</span>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="navbar-toggler"
          onClick={() => setIsNavbarOpen(!isNavbarOpen)}
        >
          ☰
        </button>

        {/* RIGHT / MENU */}
        <div className={`navbar-right ${isNavbarOpen ? "show" : ""}`}>
          <Link to="/" className="nav-link home">Home</Link>
          <Link to="/locations" className="nav-link">Locations</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/login" className="nav-link login">Login</Link>

          <Link to="/list-mess" className="cta-btn mobile-btn">
            List Your Mess
          </Link>
        </div>
      </nav>
    </header>
  );
}
