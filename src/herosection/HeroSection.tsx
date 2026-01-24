import "./HeroSection.css";
import { Search, MapPin, Utensils, ShieldCheck, CookingPot, IndianRupee, Phone } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="hero">
      {/* Background Image */}
      <div className="hero-overlay" />

      <div className="hero-content">
        <span className="hero-badge">
           <span className="badge-dot" />
               #1 Food Network in Kerala
           </span>
        <h1 className="hero-title">
            Discover Homely & <br />
            <span>Verified Mess Services</span> in <br />
            Kerala
            </h1>

            <p className="hero-subtitle">
            Experience the warmth of homemade food away from home.
            <br />
            <span>
                Connect directly with trusted kitchens from Kasaragod to 
                <br/>
                Trivandrum.
            </span>
            </p>


        <div className="hero-search">
  {/* Location */}
  <div className="search-item">
    <MapPin size={20} className="search-icon" />
    <input
      type="text"
      placeholder="Search location (e.g. Infopark, Kochi)"
    />
  </div>

  <div className="search-divider" />

  {/* Preference */}
  <div className="search-item select">
    <Utensils size={20} className="search-icon" />
    <select defaultValue="">
      <option value="" disabled>
        Any Preference
      </option>
      <option value="veg">Veg</option>
      <option value="non-veg">Non-Veg</option>
    </select>
  </div>

  {/* Search Button */}
  <button type="button" className="search-btn">
    Search <Search size={18} />
  </button>
</div>


        {/* Popular Locations */}
        <div className="hero-tags">
          <span >Popular now:</span>
          <button type="button">Kochi</button>
          <button type="button">Trivandrum</button>
          <button type="button">Calicut</button>
          <button type="button">Technopark</button>
        </div>
      </div>
      {/* FEATURES INSIDE HERO */}
<div className="hero-features">
  <div className="features-card">
    <div className="feature-item">
        <div className="feature-icon">
            <ShieldCheck size={20} />
        </div>
        <div>
            <h4>100% Verified</h4>
            <p>Every kitchen physically inspected.</p>
        </div>
    </div>

    <div className="feature-item">
        <div className="feature-icon">
            <CookingPot size={20} />
        </div>
        <div>
            <h4>Homely Taste</h4>
            <p>Authentic recipes, zero preservatives.</p>
        </div>
    </div>
    <div className="feature-item">
        <div className="feature-icon">
            <IndianRupee size={20} />
        </div>
        <div>
            <h4>Transparent Pricing</h4>
            <p>No hidden fees or commissions.</p>
        </div>
    </div>

    <div className="feature-item">
        <div className="feature-icon">
            <Phone size={20} />
        </div>
        <div>
            <h4>Direct Contact</h4>
            <p>Connect directly with owners.</p>
        </div>
    </div>
  </div>
 </div>
    </section>
  );
}
