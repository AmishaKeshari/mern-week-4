// src/pages/Home.jsx - marketplace listing driven by URL search/category
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [params] = useSearchParams();

  const search = params.get("search") || "";
  const category = params.get("category") || "";

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const q = {};
        if (search) q.search = search;
        if (category) q.category = category;
        const { data } = await API.get("/products", { params: q });
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, [search, category]);

  const heading = search
    ? `Results for "${search}"`
    : category
    ? category
    : "Today's picks for you";

  return (
    <div className="container">
      {!search && !category && (
        <div className="hero">
          <div>
            <span className="deal-badge">🔥 MEGA DEALS</span>
            <h1>Up to 40% off top brands</h1>
            <p>Electronics, fashion, home essentials and more — shopped daily.</p>
          </div>
        </div>
      )}

      <div className="grid-head">
        <h2>{heading}</h2>
        <span className="count">
          {loading ? "Loading..." : `${products.length} products`}
        </span>
      </div>

      {error && <p className="error">{error}</p>}

      {!loading && products.length === 0 ? (
        <div className="empty">
          No products found. If this is a fresh install, run{" "}
          <code>npm run seed</code> in the backend to load the catalog.
        </div>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
