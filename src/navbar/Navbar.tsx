import { useState } from "react";
import { NavLink } from "react-router-dom";
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
          <span className="logo-text">MESS MEALS</span>
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
          <NavLink to="/" className="nav-link home">Home</NavLink>
          <NavLink to="/view-all-listings" className="nav-link">Listings</NavLink>
          <NavLink to="/about" className="nav-link">About</NavLink>
          <NavLink to="/login" className="nav-link login">Login</NavLink>

          <NavLink to="/list-mess" className="cta-btn mobile-btn">
            List Your Mess
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
