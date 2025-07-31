import React, { lazy, Suspense, useEffect, useState } from "react";
import { useAuth } from "../orugallu-components/AuthContext";
import { useNavigate } from "react-router-dom";
import './MyOrdersOfOrugallu.css';

const GuestBanner = lazy(() => import("../orugallu-components/GuestBanner"));

function formatIST(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).replace(",", "");
}

function MyOrdersOfOrugallu() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestMode, setGuestMode] = useState(false);
  const [sortBy, setSortBy] = useState("desc"); // "desc" or "asc"

  useEffect(() => {
    if (!user || !token) return; // Don't auto-fetch for guests

    setLoading(true);
    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/user/${user.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          alert("Session expired. Please login again.");
          logout();
          navigate('/login');
          setLoading(false);
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Could not load your orders. Try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token, logout, navigate]);

  // Guest order fetch
  const handleGuestSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrders([]);
    try {
      const res = await fetch(`http://localhost:5000/api/orders/guest?phone=${encodeURIComponent(guestPhone)}`);
      if (!res.ok) {
        throw new Error("No orders found for this phone number.");
      }
      const data = await res.json();
      setOrders(data);
      setGuestMode(true);
    } catch (err) {
      setError("Could not load orders for this phone number.");
    } finally {
      setLoading(false);
    }
  };

  // Sort orders based on sortBy state
  const sortedOrders = [...orders].sort(
    (a, b) =>
      sortBy === "desc"
        ? new Date(b.orderDate) - new Date(a.orderDate)
        : new Date(a.orderDate) - new Date(b.orderDate)
  );
  const latestOrder = sortedOrders.length > 0 ? sortedOrders[0] : null;
  const previousOrders = sortedOrders.length > 1 ? sortedOrders.slice(1) : [];

  return (
    <>
      <Suspense fallback={null}>
        <GuestBanner />
      </Suspense>
      <div className="my-orders-wrapper">
        <h2>
          📦 My Orders
          {orders.length > 0 && orders[0].customerName
            ? ` (${orders[0].customerName}, ${guestPhone})`
            : " (Guest)"}
        </h2>
        {!user && (
          <form onSubmit={handleGuestSubmit} style={{ marginBottom: "1rem" }}>
            <input
              type="tel"
              placeholder="Enter your 10 digit phn no"
              value={guestPhone}
              onChange={e => setGuestPhone(e.target.value)}
              required
              pattern="[0-9]{10,15}"
              style={{ marginRight: "1rem" }}
            />
            <button type="submit">Submit to View Your Orders</button>
          </form>
        )}
        <div style={{ margin: "1rem 0" }}>
          <label>
            Sort by date:&nbsp;
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </label>
        </div>
        {loading && <div>Loading your orders...</div>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {guestMode && (
          <>
            {latestOrder && (
              <section className="latest-order-section">
                <h3>🆕 Your Latest Order</h3>
                <OrderCard order={latestOrder} highlight />
              </section>
            )}

            <hr />

            <h3>🗂️ All Previous Orders</h3>
            {previousOrders.length === 0 ? (
              <p>No previous orders.</p>
            ) : (
              <div className="order-list">
                {previousOrders.map((order) => (
                  <OrderCard key={order.orderId} order={order} />
                ))}
              </div>
            )}
          </>
        )}
        {user && (
          <>
            {latestOrder && (
              <section className="latest-order-section">
                <h3>🆕 Your Latest Order</h3>
                <OrderCard order={latestOrder} highlight />
              </section>
            )}

            <hr />

            <h3>🗂️ All Previous Orders</h3>
            {previousOrders.length === 0 ? (
              <p>No previous orders.</p>
            ) : (
              <div className="order-list">
                {previousOrders.map((order) => (
                  <OrderCard key={order.orderId} order={order} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

// OrderCard component with optional highlight for latest order
function OrderCard({ order, highlight }) {
  return (
    <div className={`order-card${highlight ? " latest" : ""}`}>
      <h4>Order #{order.orderId}</h4>
      <p><strong>Date:</strong> {formatIST(order.orderDate)}</p>
      <p><strong>Total:</strong> ₹{order.totalAmount}</p>
      {order.items?.length > 0 && (
        <>
          <h5>Items:</h5>
          <ul>
            {order.items.map((item, idx) => (
              <li key={idx}>
                {item.name} × {item.quantity} — ₹{item.price}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default MyOrdersOfOrugallu;