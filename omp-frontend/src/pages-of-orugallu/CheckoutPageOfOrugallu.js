// src/pages-of-orugallu/CheckoutPageOfOrugallu.js
import React, { lazy, Suspense, useState } from 'react';
import './CheckoutPageOfOrugallu.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../orugallu-components/AuthContext';
import { useCart } from '../orugallu-components/CartContext';

const GuestBanner = lazy(() => import('../orugallu-components/GuestBanner'));

function CheckoutPageOfOrugallu() {
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { cart, clearCart } = useCart(); // ✅ Use context directly

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !/^\d{10}$/.test(form.phone)) {
      alert('Please enter valid name and 10-digit phone number');
      return;
    }

    const order = {
      customer: form,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      userId: user?.userId,
    };

    try {
      const res = await fetch('http://localhost:5000/api/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(order),
      });

      const data = await res.json();

      if (res.ok) {
        clearCart();
        navigate(`/thankyou/${data.orderId}`);
      } else {
        alert(`❌ Order failed: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Network error placing order!');
    }
  };

  return (
    <>
      <Suspense fallback={null}>
        <GuestBanner />
      </Suspense>

      <div className="checkout-wrapper">
        <h2>Checkout 🧾</h2>

        {cart.length > 0 && (
          <div className="cart-summary">
            <h3>Order Summary:</h3>
            <ul>
              {cart.map((item) => (
                <li key={item.id}>
                  {item.name} × {item.quantity} — ₹{item.price * item.quantity}
                </li>
              ))}
            </ul>
            <strong>
              Total: ₹
              {cart
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toFixed(2)}
            </strong>
          </div>
        )}

        <form className="checkout-form" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <textarea
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            rows={4}
          />
          <button type="submit">Place Order</button>
        </form>
      </div>
    </>
  );
}

export default CheckoutPageOfOrugallu;