// src/components/Stars.jsx - renders a star rating like a real store
export default function Stars({ rating = 0, reviews }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const stars = "★".repeat(full) + (half ? "⯨" : "") + "☆".repeat(5 - full - (half ? 1 : 0));
  return (
    <div className="rating-row">
      <span className="stars">{stars}</span>
      <span className="num">{rating.toFixed(1)}{reviews !== undefined ? ` (${reviews.toLocaleString()})` : ""}</span>
    </div>
  );
}
