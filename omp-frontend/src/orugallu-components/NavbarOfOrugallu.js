import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useCart } from "../orugallu-components/CartContext";
import SearchDropdown from "./SearchDropdown";
import ToastMessage from "./ToastMessage";
import styles from "./NavbarOfOrugallu.module.css";

function NavbarOfOrugallu({ showLogoIntro }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const { cart, addToCart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  useEffect(() => {
    fetch("http://localhost:5000/api/items")
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error("Failed to fetch items:", err));
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleLogout = () => logout();

  const filteredItems = items.filter(i =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning🌞";
    if (hour < 18) return "Good afternoon☀️";
    return "Good evening🍵";
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <span className={styles.logo}>
          <img
            src="/orugallu-logo.png"
            alt="Logo"
            className={`${styles.navLogo} navLogo`}
          />
          Miss Orugallu Ruchulu👑
        </span>
        <span className={styles.caption}>~~మన ఇ❤️టి రుచులు 🌿</span>
        {user && (
          <span>
            {getGreeting()}, {user.username}👋
          </span>
        )}
      </div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="🔍 Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        {searchTerm && (
          <SearchDropdown
            items={filteredItems}
            onAddToCart={handleAddToCart}
            onClear={() => setSearchTerm("")}
          />
        )}
      </div>

      <div className={styles.links}>
        {/* Add Orugallu🏠 link before Items */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.activeLink : ""}`
          }
        >
          Orugallu🏠
        </NavLink>
        <NavLink
          to="/items"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.activeLink : ""}`
          }
        >
          Items
        </NavLink>
        <NavLink
          to="/myorders"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.activeLink : ""}`
          }
        >
          My Orders
        </NavLink>
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.activeLink : ""}`
          }
        >
          Cart 🛒
          {cartCount > 0 && (
            <span className={styles.badge}>{cartCount}</span>
          )}
        </NavLink>
        {user ? (
          <button className={styles.link} onClick={handleLogout}>
            Logout
          </button>
        ) : (
          location.pathname !== "/login" && (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.activeLink : ""}`
              }
            >
              Login
            </NavLink>
          )
        )}
      </div>

      {showToast && <ToastMessage message="🛒 Item added to cart!" />}
    </nav>
  );
}

export default NavbarOfOrugallu;