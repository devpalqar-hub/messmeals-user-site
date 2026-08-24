import { useState } from "react";
import { X, MapPin } from "lucide-react";
import styles from "./AddressModal.module.css";
import type { AddressPayload } from "../../types/address";
import { createAddress } from "../../services/addressService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddressModal({ isOpen, onClose, onSuccess }: Props) {
  const { user } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AddressPayload>({
    name: user?.name || "",
    street: "",
    townOrcity: "",
    country: "India",
    postcode: "",
    landmark: "",
    latitudeLogitude: "",
    phone: "",
    email: "",
    locationLink: "",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return;

    setLoading(true);
    try {
      await createAddress(user.token, formData);
      toast.success("Delivery address added successfully!");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to add address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["am-overlay"]} onClick={onClose}>
      <div className={styles["am-card"]} onClick={(e) => e.stopPropagation()}>
        <button className={styles["am-close"]} onClick={onClose}>
          <X size={18} />
        </button>

        <div className={styles["am-header"]}>
          <h3>Add New Address</h3>
          <p>Where should we deliver your meals?</p>
        </div>

        <form className={styles["am-form"]} onSubmit={handleSubmit}>
          <div className={styles["am-grid-2"]}>
            <div className={styles["am-field"]}>
              <label>Contact Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. John Doe"
              />
            </div>
            <div className={styles["am-field"]}>
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="e.g. 9876543210"
              />
            </div>
          </div>

          <div className={styles["am-field"]}>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. john@example.com"
            />
          </div>

          <div className={styles["am-field"]}>
            <label>Street / Flat No. *</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
              placeholder="e.g. 123 Main St, Apt 4B"
            />
          </div>

          <div className={styles["am-grid-2"]}>
            <div className={styles["am-field"]}>
              <label>Town / City *</label>
              <input
                type="text"
                name="townOrcity"
                value={formData.townOrcity}
                onChange={handleChange}
                required
                placeholder="e.g. Kochi"
              />
            </div>
            <div className={styles["am-field"]}>
              <label>Postcode *</label>
              <input
                type="text"
                name="postcode"
                value={formData.postcode}
                onChange={handleChange}
                required
                placeholder="e.g. 682001"
              />
            </div>
          </div>

          <div className={styles["am-grid-2"]}>
            <div className={styles["am-field"]}>
              <label>Landmark</label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                placeholder="e.g. Opposite Central Mall"
              />
            </div>
            <div className={styles["am-field"]}>
              <label>Country *</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles["am-grid-2"]}>
            <div className={styles["am-field"]}>
              <label>Latitude, Longitude</label>
              <input
                type="text"
                name="latitudeLogitude"
                value={formData.latitudeLogitude}
                onChange={handleChange}
                placeholder="e.g. 9.9312, 76.2673"
              />
            </div>
            <div className={styles["am-field"]}>
              <label>Google Maps Link</label>
              <input
                type="url"
                name="locationLink"
                value={formData.locationLink}
                onChange={handleChange}
                placeholder="https://maps.app.goo.gl/..."
              />
            </div>
          </div>

          <div className={styles["am-actions"]}>
            <button type="button" className={styles["am-cancel-btn"]} onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={styles["am-submit-btn"]}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
