import { useState } from "react";
import styles from "./ListMessModal.module.css";
import { submitEnquiry } from "../../../services/enquiryService";
import type { EnquiryPayload } from "../../../types/enquiry";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

/* Kerala districts */
const districts = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
];

export default function ListMessModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState({
    ownerName: "",
    messName: "",
    email: "",
    phone: "",
    district: "",
    locality: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  /* handle input */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* submit to API */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload: EnquiryPayload = {
        Name: form.ownerName,
        email: form.email,
        phone: form.phone,
        message: form.message,
        messname: form.messName,
        pincode: form.locality,
        district: form.district,
      };

      await submitEnquiry(payload);

      alert("Form submitted successfully!");

      setForm({
        ownerName: "",
        messName: "",
        email: "",
        phone: "",
        district: "",
        locality: "",
        message: "",
      });

      onClose();
    } catch (err) {
      console.error(err);
      alert("Submission failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["modal-overlay"]} onClick={onClose}>
      <div
        className={styles["modal-card"]}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles["modal-title"]}>List Your Mess</h2>

        <form className={styles["modal-form"]} onSubmit={handleSubmit}>
          <input
            name="ownerName"
            aria-label="Mess Owner Name"
            placeholder="Mess Owner Name"
            value={form.ownerName}
            onChange={handleChange}
            required
          />

          <input
            name="messName"
            aria-label="Mess Name"
            placeholder="Mess Name"
            value={form.messName}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            aria-label="Email address"
            placeholder="Mess Mail ID"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="phone"
            aria-label="Phone number"
            placeholder="Phone No"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <select
            name="district"
            aria-label="District"
            value={form.district}
            onChange={handleChange}
            required
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          <input
            name="locality"
            aria-label="Locality or Pincode"
            placeholder="Locality - Pincode"
            value={form.locality}
            onChange={handleChange}
          />

          <textarea
            name="message"
            aria-label="Additional message"
            placeholder="Additional Message"
            rows={3}
            value={form.message}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Enquiry"}
          </button>
        </form>

        <span className={styles["close-btn"]} onClick={onClose}>✕</span>
      </div>
    </div>
  );
}
