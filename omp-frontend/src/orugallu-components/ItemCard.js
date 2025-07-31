import React, { useState } from 'react';
import styles from './ItemCard.module.css';
import { useCart } from "../orugallu-components/CartContext";
import ToastMessage from './ToastMessage';

function ItemCard({ id, name, price, description, imageUrl }) {
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = () => {
    addToCart({ id, name, price, quantity: 1 });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className={styles.card}>
      <img src={imageUrl} alt={name} className={styles.image} />
      <h3>{name}</h3>
      <p>{description}</p>
      <p className={styles.price}>₹{price}</p>
      <button onClick={handleAddToCart} className={styles.cartButton}>
        Add to Cart 🛒
      </button>
      {showToast && <ToastMessage message={`${name} added to cart 🛒`} />}
    </div>
  );
}

export default ItemCard;