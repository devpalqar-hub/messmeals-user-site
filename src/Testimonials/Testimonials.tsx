import "./Testimonials.css";
import { useState } from "react";
import { Star, Quote } from "lucide-react";

const REVIEWS = [
  {
    text: "The food is just like home. Very tasty and hygienic. Totally worth the price.",
    name: "Arjun M.",
    location: "Kochi",
  },
  {
    text: "Easy booking and reliable service. I found the best mess near my office.",
    name: "Sneha P.",
    location: "Ernakulam",
  },
  {
    text: "Affordable plans with awesome food. Highly recommended!",
    name: "Vishnu S.",
    location: "Kalamassery",
  },
];

export default function Testimonials() {
  const [active] = useState(0);

  return (
    <section className="testimonials">
      <h2 className="testi-title">What our customers say</h2>

      <div className="testi-grid">
        {REVIEWS.map((r) => (
          <div className="testi-card" key={r.name}>
            <Quote size={28} className="testi-quote" />
            <p className="testi-text">{r.text}</p>
            <div className="testi-footer">
              <div className="testi-avatar">{r.name.charAt(0)}</div>
              <div className="testi-person">
                <strong>{r.name}</strong>
                <span>{r.location}</span>
              </div>
              <div className="testi-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="#f5a623" color="#f5a623" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="testi-dots">
        {REVIEWS.map((_, i) => (
          <span key={i} className={i === active ? "dot active" : "dot"} />
        ))}
      </div>
    </section>
  );
}
