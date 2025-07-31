import React, { lazy, Suspense } from 'react';
import './CartPageOfOrugallu.css';
import { useCart } from "../orugallu-components/CartContext";
import { useNavigate } from 'react-router-dom';

const GuestBanner = lazy(() => import('../orugallu-components/GuestBanner'));

function CartPageOfOrugallu() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const handleRemove = (id) => {
    removeFromCart(id);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Suspense fallback={null}>
        <GuestBanner />
      </Suspense>
      <div className="cart-wrapper">
        <h2 className="cart-title">🛒 Your Cart</h2>

        {cart.length === 0 ? (
          <div className="empty-cart-message">
            <h2>Ika Modhaledadhama?!</h2>
            <p>Bring home flav😋rs of Orugallu!.</p>
            <button className="browse-items-btn" onClick={() => navigate("/items")}>
              🍽️ Browse Items
            </button>
          </div>
        ) : (
          <>
            <ul>
              {cart.map(item => (
                <li key={item.id}>
                  <div className="cart-item">
                    <strong>{item.name}</strong>
                    <div className="quantity">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                      >-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <span>₹{item.price * item.quantity}</span>
                    <button className="remove" onClick={() => handleRemove(item.id)}>❌</button>
                  </div>
                </li>
              ))}
            </ul>

            <h3 className="cart-total">Total: ₹{total.toFixed(2)}</h3>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem" }}>
             <button className="checkout-btn" onClick={() => navigate('/checkout')}>
  Proceed to Checkout 🧾
</button>
              <button className="clear-cart-btn" onClick={clearCart}>
                Clear Cart 🗑️
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default CartPageOfOrugallu;