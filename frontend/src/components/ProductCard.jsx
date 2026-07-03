// src/components/ProductCard.jsx - marketplace product tile
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Stars from "./Stars";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const outOfStock = product.countInStock <= 0;

  const hasDiscount = product.originalPrice > product.price;
  const pctOff = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const open = () => navigate(`/product/${product._id}`);

  return (
    <div className="product" onClick={open}>
      <div className="product-imgwrap">
        {hasDiscount && <span className="discount-tag">-{pctOff}%</span>}
        <img
          className="product-img"
          src={product.image || "https://placehold.co/300x300?text=Product"}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/300x300/eef2f7/64748b?text=${encodeURIComponent(product.brand || "Product")}`;
          }}
        />
      </div>
      <div className="product-body">
        <span className="brand">{product.brand}</span>
        <h3>{product.name}</h3>
        <Stars rating={product.rating} reviews={product.numReviews} />
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
          {outOfStock ? "Out of stock" : "In stock"}
        </span>
        <button
          className="btn block"
          style={{ marginTop: 8 }}
          disabled={outOfStock}
          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
