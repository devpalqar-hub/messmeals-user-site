import "./OwnAMess.css";
import { useState } from "react";
import { Store } from "lucide-react";
import ListMessModal from "../ListMessModal/ListMessModal";

export default function OwnAMess() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="own-a-mess">
      <div className="oam-inner">
        <div className="oam-icon">
          <Store size={30} />
        </div>

        <div className="oam-text">
          <h2>Own a mess?</h2>
          <p>Join our platform and reach thousands of hungry people in your area.</p>
        </div>

        <button className="oam-btn" onClick={() => setIsModalOpen(true)}>
          List Your Mess Now
        </button>
      </div>

      <ListMessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
