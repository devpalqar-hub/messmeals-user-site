import { useEffect, useState } from "react";
import { getAllMess } from "../services/messApi";
import type { Mess, MessMeta } from "../types/mess";
import { MapPin, Star, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ViewAllListings.css";

export default function ViewAllListings() {
  const [messList, setMessList] = useState<Mess[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<MessMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMess();
  }, [page]);

  const fetchMess = async () => {
    setLoading(true);
    try {
      const res = await getAllMess(page, 6);
      setMessList(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error("Failed to fetch mess", err);
    } finally {
      setLoading(false);
    }
  };
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

    
  return (
    <section className="view-all-page">
      <h1>All Mess Listings</h1>

      {loading ? (
        <p>Loading messes...</p>
      ) : (
        <>
          <div className="listing-grid">
            {messList.map((mess) => {
              const imageUrl =
                mess.images
                  ?.slice()
                  .sort((a, b) => a.sortOrder - b.sortOrder)[0]
                  ?.url;
              return (
                <div className="listing-card" key={mess.id}>
                  {/* IMAGE SECTION */}
                  <div className="image-wrap">
                    <MessImage
                      src={imageUrl}
                      alt={`${mess.name} mess in ${mess.location ?? "Kerala"}`}
                    />

                    {mess.is_verified && (
                      <span className="badge veg">• Verified</span>
                    )}

                    <button className="wishlist" aria-label="Save mess">
                      <Heart size={18} />
                    </button>

                    {/* TEXT OVER IMAGE */}
                    <div className="image-info">
                      <div className="location">
                        <MapPin size={14} />
                        {mess.location || "Kerala"}
                      </div>
                      <h3>{mess.name}</h3>
                    </div>
                  </div>

                  {/* CARD BODY */}
                  <div className="card-body">
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

                    <div className="rating">
                      <Star size={14} /> 4.5
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAGINATION */}
          {meta && meta.totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ‹
              </button>

              {Array.from({ length: meta.totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={page === i + 1 ? "active" : ""}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={page === meta.totalPages}
                onClick={() => setPage(page + 1)}
              >
                ›
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
