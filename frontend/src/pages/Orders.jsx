// src/pages/Orders.jsx - the logged-in user's order history
import { useState, useEffect } from "react";
import API from "../api/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/orders/mine");
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="container">Loading orders...</div>;

  return (
    <div className="container">
      <h2 className="section-title">Your orders</h2>
      <p className="section-sub">A record of everything you've ordered.</p>
      {error && <p className="error">{error}</p>}

      {orders.length === 0 ? (
        <div className="empty">You haven't placed any orders yet.</div>
      ) : (
        orders.map((order) => (
          <div className="card" key={order._id} style={{ marginBottom: 16, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>Order #{order._id.slice(-6)}</strong>
                <p style={{ color: "var(--slate)", fontSize: "0.85rem" }}>
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <span className="badge">{order.status}</span>
            </div>
            <ul style={{ margin: "12px 0", paddingLeft: 18 }}>
              {order.items.map((it, idx) => (
                <li key={idx} style={{ fontSize: "0.9rem" }}>
                  {it.name} × {it.quantity} — ${(it.price * it.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
            <strong>Total: ${order.totalPrice.toFixed(2)}</strong>
          </div>
        ))
      )}
    </div>
  );
}
