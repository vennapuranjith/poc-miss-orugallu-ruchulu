import { lazy, Suspense, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ThankYouPageOfOrugallu.css';

const GuestBanner = lazy(() => import('../orugallu-components/GuestBanner'));

function ThankYouPageOfOrugallu() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/${orderId}/details`)
      .then(res => res.json())
      .then(data => setOrder(data))
      .catch(err => console.error('Error loading order:', err));
  }, [orderId]);

  if (!order) return <p>Loading...</p>;

  return (
    <>
      <Suspense fallback={null}>
        <GuestBanner />
      </Suspense>
      <div className="thankyou-wrapper">
        <img
          src="/orugallu-logo.png"
          alt="Orugallu Logo"
          className="thankyou-logo"
        />

        <h2>🎉 Hurray! Your Order is Placed</h2>
        <p>Order ID: #{order.orderId}</p>
        <p><strong>Name:</strong> {order.customer.Name}</p>
        <p><strong>Phone:</strong> {order.customer.Phone}</p>

        <h3>Items Ordered:</h3>
        <ul>
          {order.items.map((item, idx) => (
            <li key={idx}>
              {item.name} × {item.quantity} = ₹{item.total}
            </li>
          ))}
        </ul>

        <p><strong>Total:</strong> ₹{order.totalAmount}</p>

        <Link to="/items" className="back-button">🛒 Continue Shopping</Link>
      </div>
    </>
  );
}

export default ThankYouPageOfOrugallu;