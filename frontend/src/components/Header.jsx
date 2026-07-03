// src/components/Header.jsx - marketplace-style header with search + categories
import { useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const CATEGORIES = [
  "All", "Electronics", "Computers", "Wearables",
  "Photography", "Fashion", "Home"
];

export default function Header() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [term, setTerm] = useState("");
  const activeCat = params.get("category") || "All";

  const search = () => {
    navigate(term.trim() ? `/?search=${encodeURIComponent(term.trim())}` : "/");
  };
  const pickCategory = (c) => {
    navigate(c === "All" ? "/" : `/?category=${encodeURIComponent(c)}`);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-top-inner">
          <NavLink to="/" className="logo">
            Shop<span>Hub</span>
          </NavLink>

          <div className="search">
            <input
              placeholder="Search for products, brands and more"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
            />
            <button onClick={search}>Search</button>
          </div>

          <div className="header-actions">
            {user ? (
              <>
                <button onClick={() => navigate("/orders")}>
                  <span className="top-line">Hello, {user.name.split(" ")[0]}</span>
                  Your Orders
                </button>
                {user.role === "admin" && (
                  <NavLink to="/admin">
                    <span className="top-line">Manage</span>
                    Admin
                  </NavLink>
                )}
                <button onClick={() => { logout(); navigate("/"); }}>
                  <span className="top-line">Sign out</span>
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login">
                <span className="top-line">Hello, sign in</span>
                Account
              </NavLink>
            )}
            <NavLink to="/cart" className="cart-link">
              <span style={{ fontSize: "1.3rem" }}>🛒</span>
              Cart<span className="cart-count">{totalItems}</span>
            </NavLink>
          </div>
        </div>
      </div>

      <div className="header-sub">
        <div className="header-sub-inner">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={activeCat === c ? "active" : ""}
              onClick={() => pickCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
