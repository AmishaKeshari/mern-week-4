// src/pages/ProductDetail.jsx - single product page (like a real store)
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { useCart } from "../context/CartContext";
import Stars from "../components/Stars";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || "Product not found");
      }
    })();
  }, [id]);

  if (error) return <div className="container"><div className="empty">{error}</div></div>;
  if (!product) return <div className="container">Loading...</div>;

  const hasDiscount = product.originalPrice > product.price;
  const pctOff = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const outOfStock = product.countInStock <= 0;

  const buyNow = () => {
    addToCart(product);
    navigate("/cart");
  };

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/">Home</Link> › <Link to={`/?category=${product.category}`}>{product.category}</Link> › {product.name}
      </div>

      <div className="detail">
        <div className="detail-img">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/500x500/eef2f7/64748b?text=${encodeURIComponent(product.brand || "Product")}`;
            }}
          />
        </div>
        <div>
          <span className="brand">{product.brand}</span>
          <h1>{product.name}</h1>
          <Stars rating={product.rating} reviews={product.numReviews} />
          <div className="divider" />
          <div className="price-row">
            <span className="price">${product.price.toFixed(2)}</span>
            {hasDiscount && (
              <>
                <span className="price-old">${product.originalPrice.toFixed(2)}</span>
                <span className="price-off">{pctOff}% off</span>
              </>
            )}
          </div>
          <span className={`stock-note ${outOfStock ? "out" : ""}`}>
            {outOfStock ? "Currently unavailable" : `In stock (${product.countInStock} available)`}
          </span>
          <p className="desc">{product.description}</p>
          <div className="divider" />
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" disabled={outOfStock} onClick={() => addToCart(product)}>
              Add to Cart
            </button>
            <button className="btn blue" disabled={outOfStock} onClick={buyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
