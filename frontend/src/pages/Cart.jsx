// src/pages/Cart.jsx - cart with order summary sidebar (marketplace layout)
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const checkout = async () => {
    setError("");
    if (!user) return navigate("/login");
    try {
      setPlacing(true);
      await API.post("/orders", {
        items: items.map((i) => ({ product: i._id, quantity: i.quantity }))
      });
      clearCart();
      navigate("/orders");
    } catch (err) {
      const msg = err.response?.data?.message || "Checkout failed";
      // A "Product not found" means a cart item points to a product that no
      // longer exists (e.g. the catalog was reseeded). Drop the stale item.
      if (msg.startsWith("Product not found")) {
        const staleId = msg.split(":")[1]?.trim();
        if (staleId) removeFromCart(staleId);
        setError(
          "One item in your cart is no longer available and was removed. Please review your cart and try again."
        );
      } else {
        setError(msg);
      }
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="empty">
          Your ShopHub cart is empty. <Link className="link" to="/">Continue shopping</Link>
        </div>
      </div>
    );
  }

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="container">
      <h1 className="section-title">Shopping Cart</h1>
      <p className="section-sub">{items.length} product(s)</p>

      <div className="cart-layout">
        <div>
          {items.map((item) => (
            <div className="cart-item" key={item._id}>
              <img
                src={item.image}
                alt={item.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/100x100/eef2f7/64748b?text=${encodeURIComponent(item.brand || "Product")}`;
                }}
              />
              <div className="grow">
                <h3>{item.name}</h3>
                <span className="brand" style={{ fontSize: "0.76rem", color: "#6b7280" }}>
                  {item.brand}
                </span>
                <div className="price" style={{ fontSize: "1.05rem", marginTop: 4 }}>
                  ${item.price.toFixed(2)}
                </div>
              </div>
              <input
                className="qty"
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item._id, e.target.value)}
              />
              <button className="btn danger sm" onClick={() => removeFromCart(item._id)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="summary">
          <h3>Order Summary</h3>
          <div className="line">
            <span>Items ({totalItems})</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="line">
            <span>Delivery</span>
            <span style={{ color: "#16a34a", fontWeight: 700 }}>FREE</span>
          </div>
          <div className="line total">
            <span>Order Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          {error && <p className="error">{error}</p>}
          <button
            className="btn block blue"
            style={{ marginTop: 14 }}
            onClick={checkout}
            disabled={placing}
          >
            {placing ? "Placing order..." : user ? "Proceed to Checkout" : "Sign in to Checkout"}
          </button>
          <button
            className="btn block outline"
            style={{ marginTop: 8 }}
            onClick={clearCart}
          >
            Clear cart
          </button>
        </div>
      </div>
    </div>
  );
}
