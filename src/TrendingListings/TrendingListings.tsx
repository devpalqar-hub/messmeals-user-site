import "./TrendingListings.css";
import { Heart, MapPin, Star,ArrowRight  } from "lucide-react";

export default function TrendingListings() {
  return (
    <section className="trending">
      {/* HEADER */}
      <div className="trending-header">
        <div>
          <h2>Trending Mess Listings</h2>
          <p>
            Highly rated home kitchens serving authentic Kerala meals in your
            area today.
          </p>
        </div>

        <button className="view-all">
            View all listings
            <ArrowRight size={18} className="view-all-icon" />
        </button>

      </div>

      {/* GRID */}
      {/* GRID */}
            <div className="listing-grid">

            {/* CARD */}
            <div className="listing-card">
                <div className="image-wrap">
                <img src="/food1.avif" alt="Amma's Kitchen" />

                <span className="badge veg">• Pure Veg</span>

                <button className="wishlist">
                    <Heart size={18} />
                </button>

                {/* TEXT ON IMAGE */}
                <div className="image-info">
                    <div className="location">
                    <MapPin size={14} /> Kakkanad, Kochi
                    </div>
                    <h3>Amma's Kitchen</h3>
                </div>
                </div>

                <div className="card-body">
                <div className="tags">
                    <span>Homely</span>
                    <span>Monthly Plan</span>
                    <span>Lunch & Dinner</span>
                </div>
                <div className="card-divider" />
                <div className="card-footer">
                    <div>
                    <small>STARTING AT</small>
                    <strong>₹3,500<span>/mo</span></strong>
                    </div>
                    <button className="menu-btn">View Menu</button>
                </div>

                <div className="rating">
                    <Star size={14} /> 4.8
                </div>
                </div>
            </div>

            {/* CARD 2 */}
            <div className="listing-card">
                <div className="image-wrap">
                <img src="/food2.avif" alt="Malabar Mess House" />

                <span className="badge nonveg">• Non-Veg</span>

                <button className="wishlist">
                    <Heart size={18} />
                </button>

                <div className="image-info">
                    <div className="location">
                    <MapPin size={14} /> Palayam, TVM
                    </div>
                    <h3>Malabar Mess House</h3>
                </div>
                </div>

                <div className="card-body">
                <div className="tags">
                    <span>Biryani</span>
                    <span>Night Delivery</span>
                </div>
                 <div className="card-divider" />
                <div className="card-footer">
                    <div>
                    <small>STARTING AT</small>
                    <strong>₹4,200<span>/mo</span></strong>
                    </div>
                    <button className="menu-btn">View Menu</button>
                </div>

                <div className="rating">
                    <Star size={14} /> 4.5
                </div>
                </div>
            </div>

            {/* CARD 3 */}
            <div className="listing-card">
                <div className="image-wrap">
                <img src="/food3.avif" alt="Lakshmi Foods" />

                <span className="badge mixed">• Mixed</span>

                <button className="wishlist">
                    <Heart size={18} />
                </button>

                <div className="image-info">
                    <div className="location">
                    <MapPin size={14} /> Mavoor, Calicut
                    </div>
                    <h3>Lakshmi Foods</h3>
                </div>
                </div>

                <div className="card-body">
                <div className="tags">
                    <span>Budget</span>
                    <span>Breakfast</span>
                </div>
                 <div className="card-divider" />
                <div className="card-footer">
                    <div>
                    <small>STARTING AT</small>
                    <strong>₹3,000<span>/mo</span></strong>
                    </div>
                    <button className="menu-btn">View Menu</button>
                </div>

                <div className="rating">
                    <Star size={14} /> 4.2
                </div>
                </div>
            </div>

            </div>
    </section>
  );
}
