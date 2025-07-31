import React from "react";
import styles from "./NavbarOfOrugallu.module.css";

function SearchDropdown({ items, onAddToCart, onClear }) {
  if (items.length === 0) {
    return <div className={`${styles.searchDropdown} ${styles.empty}`}>No items found.</div>;
  }

  return (
    <div className={styles.searchDropdown}>
  {items.slice(0, 6).map(item => (
    <div key={item.id} className={styles.searchItem}>
      <img src={item.imageUrl} alt={item.name} />
      <div>
        <div className={styles.searchItemName}>{item.name}</div>
        <div className={styles.price}>₹{item.price}</div>
        <button className={styles.btn} onClick={() => onAddToCart({ ...item, quantity: 1 })}>
          Add to Cart
        </button>
      </div>
    </div>
  ))}
  <button className={styles.clearSearch} onClick={onClear}>Clear ❌</button>
</div>
  );
}

export default SearchDropdown;
