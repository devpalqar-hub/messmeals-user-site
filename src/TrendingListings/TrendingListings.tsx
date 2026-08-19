import "./TrendingListings.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, Star, ArrowRight } from "lucide-react";
import { getAllMess } from "../services/messApi";
import type { Mess } from "../types/mess";

/* ---------------- IMAGE COMPONENT ---------------- */
function MessImage({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  const [imgSrc, setImgSrc] = useState(
    src || "/food-placeholder.png"
  );

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading="lazy"
      onError={() => setImgSrc("/food-placeholder.png")}
    />
  );
}

/* ---------------- COMPONENT ---------------- */
export default function TrendingListings() {
  const navigate = useNavigate();

  const [messList, setMessList] = useState<Mess[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingMess();
  }, []);

  const fetchTrendingMess = async () => {
    try {
      const res = await getAllMess(1, 8);
      setMessList(res.data);
    } catch (err) {
      console.error("Failed to fetch trending mess", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="trending">
      {/* HEADER */}
      <div className="trending-header">
        <div>
          <h2>Top rated messes near you</h2>
          <p>
            Highly rated home kitchens serving authentic Kerala meals in your
            area today.
          </p>
        </div>

        <button
          className="view-all"
          onClick={() => navigate("/view-all-listings")}
        >
          View all listings
          <ArrowRight size={18} className="view-all-icon" />
        </button>
      </div>

      {/* GRID */}
      {loading ? (
        <p>Loading trending messes...</p>
      ) : (
        <div className="listing-grid">
          {messList.map((mess) => {
            const imageUrl =
              mess.images
                ?.slice()
                .sort((a, b) => a.sortOrder - b.sortOrder)[0]
                ?.url;

            return (
              <div className="listing-card" key={mess.id}>
                {/* IMAGE */}
                <div className="image-wrap">
                  <MessImage
                    src={imageUrl}
                    alt={`${mess.name} mess in ${mess.location ?? "Kerala"}`}
                  />

                  {mess.is_verified && (
                    <span className="badge veg">• Verified</span>
                  )}

                  <button className="wishlist" aria-label="Save mess">
                    <Heart size={14} />
                  </button>

                  {/* IMAGE TEXT */}
                  <div className="image-info">
                    <div className="location">
                      <MapPin size={14} />
                      {mess.location || "Kerala"}
                    </div>
                    <h3>{mess.name}</h3>
                  </div>
                </div>

                {/* BODY */}
                <div className="card-body">
                  <div className="rating">
                    <Star size={13} fill="currentColor" /> 4.5
                  </div>

                  <div className="tags">
                    <span>Homely</span>
                    <span>Monthly Plan</span>
                  </div>

                  <div className="card-divider" />

                  <div className="card-footer">
                    <div>
                      <small>STARTING AT</small>
                      <strong>
                        ₹{mess.plans?.[0]?.price ?? "N/A"}
                        <span>/mo</span>
                      </strong>
                    </div>

                    <button
                      className="menu-btn"
                      onClick={() => navigate(`/mess/${mess.id}`)}
                    >
                      View Menu
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
