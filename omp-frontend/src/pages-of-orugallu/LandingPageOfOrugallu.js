import React, { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./LandingPageOfOrugallu.css";

const GuestBanner = lazy(() => import("../orugallu-components/GuestBanner"));

function LandingPageOfOrugallu() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/items")
      .then(res => res.json())
      .then(data => {
        const unique = [...new Set(data.map(item => item.category.toLowerCase()))];
        setCategories(unique);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <GuestBanner />
      </Suspense>
      <div className="landing-wrapper">
        <h1 className="landing-title">Welcome to Miss Orugallu Ruchulu 👑</h1>
        <p className="landing-subtitle">Authentic Flavors | Timeless Taste</p>

        <div className="main-square-box">
          <div className="main-tile-grid">
            {categories.map((cat, idx) => (
                <div className="tile-wrapper" key={cat}>
              <motion.div
  key={cat}/* Using key to ensure unique identification for Framer Motion */
  className="tile-wrapper"
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{
    duration: 0.7,
    delay: idx * 0.1,
    ease: "easeOut"
  }}
>
  <motion.div
    className="category-tile"
    whileHover={{ scale: 1.05 }}
    onClick={() => navigate(`/items?q=${encodeURIComponent(cat)}`)}
    animate={{
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }
    }}
  >
    <img
      src={`/category-thumbnails/${cat}.jpg`}
      alt={cat}
      className="tile-image"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "/category-thumbnails/default.jpg";
      }}
    />
    <div className="tile-overlay">
      {cat.charAt(0).toUpperCase() + cat.slice(1)}
    </div>
  </motion.div>
</motion.div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPageOfOrugallu;