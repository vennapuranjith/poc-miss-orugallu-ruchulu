import React, { lazy, Suspense, useEffect, useState } from "react";
import { useAuth } from "../orugallu-components/AuthContext";
import { useNavigate } from "react-router-dom";
import "./AdminOrdersPage.css";

const GuestBanner = lazy(() => import("../orugallu-components/GuestBanner"));

function AdminOrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate("/login");
      return;
    }
    fetch("http://localhost:5000/api/orders/all", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
  }, [user, navigate]);

  // Separate guest and logged-in user orders
  const guestOrders = orders.filter(order => order.UserID === null);
  const userOrders = orders.filter(order => order.UserID !== null);

  return (
    <>
      <Suspense fallback={null}>
        <GuestBanner />
      </Suspense>
      <div className="admin-orders-wrapper">
        <button onClick={() => navigate("/home")} style={{ marginBottom: "1rem" }}>
          ← Back to Home
        </button>
        <h2>All Orders (Admin)</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <section>
              <h3>Logged-in User Orders</h3>
              {userOrders.length === 0 ? <p>No user orders.</p> : (
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Total</th>
                      <th>Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userOrders.map(order => (
                      <tr key={order.OrderID}>
                        <td>{order.OrderID}</td>
                        <td>{order.OrderDate ? new Date(order.OrderDate).toLocaleString("en-GB", { timeZone: "Asia/Kolkata" }) : ""}</td>
                        <td>{order.CustomerName}</td>
                        <td>{order.CustomerPhone}</td>
                        <td>₹{order.TotalAmount}</td>
                        <td>
                          <ul>
                            {(order.items || []).map(item => (
                              <li key={item.ItemID}>
                                {item.Name} × {item.Quantity} — ₹{item.Price}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
            <section>
              <h3>Guest Orders</h3>
              {guestOrders.length === 0 ? <p>No guest orders.</p> : (
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Total</th>
                      <th>Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guestOrders.map(order => (
                      <tr key={order.OrderID}>
                        <td>{order.OrderID}</td>
                        <td>{order.OrderDate ? new Date(order.OrderDate).toLocaleString("en-GB", { timeZone: "Asia/Kolkata" }) : ""}</td>
                        <td>{order.CustomerName}</td>
                        <td>{order.CustomerPhone}</td>
                        <td>₹{order.TotalAmount}</td>
                        <td>
                          <ul>
                            {(order.items || []).map(item => (
                              <li key={item.ItemID}>
                                {item.Name} × {item.Quantity} — ₹{item.Price}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
}

export default AdminOrdersPage;