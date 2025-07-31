import { lazy, Suspense } from 'react';
import './HomeOfOrugallu.css';
import { useAuth } from "../orugallu-components/AuthContext";
import { Link } from "react-router-dom";

const GuestBanner = lazy(() => import('../orugallu-components/GuestBanner'));

function HomeOfOrugallu() {
  const { user } = useAuth();

  return (
    <>
      <Suspense fallback={null}>
        <GuestBanner />
      </Suspense>
      {user && user.role === "admin" ? (
        <div className="admin-home-center">
          <h2>Namaskaram🙏, 😍rugallu Captain!🫡</h2>
          <p>
            Y🙂u carry f😎rward the traditi🪔n of h🏡me-cooked l🫶ve.<br />
            Review orders and keep the legacy💪 of Miss👑 Orugallu Ruchulu alive with every package sent 🍃📦
          </p>
          <Link to="/admin/orders" className="admin-orders-link">
            Click here to view all orders.
          </Link>
        </div>
      ) : (
        <div className="home-wrapper">
          <section className="hero-section">
            <h1 className="hero-heading">Welcome to Miss Orugallu Ruchulu 🌾</h1>
            <p className="hero-subtext">
              Homemade organic pickles, millets, and more — rooted in tradition, packed with purity.
            </p>
            <a href="/items" className="browse-button">Browse Items</a>
          </section>
        </div>
      )}
    </>
  );
}

export default HomeOfOrugallu;
