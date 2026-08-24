import styles from "./OwnAMess.module.css";
import { useState } from "react";
import { Store } from "lucide-react";
import ListMessModal from "../../components/ui/ListMessModal/ListMessModal";

export default function OwnAMess() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className={styles["own-a-mess"]}>
      <div className={styles["oam-inner"]}>
        <div className={styles["oam-icon"]}>
          <Store size={30} />
        </div>

        <div className={styles["oam-text"]}>
          <h2>Own a mess?</h2>
          <p>Join our platform and reach thousands of hungry people in your area.</p>
        </div>

        <button className={styles["oam-btn"]} onClick={() => setIsModalOpen(true)}>
          List Your Mess Now
        </button>
      </div>

      <ListMessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
