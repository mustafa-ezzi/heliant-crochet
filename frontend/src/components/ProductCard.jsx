import { Link } from "react-router-dom";
import { formatMoney } from "../lib/money";

const STICKER_TONE = {
  "New drop": "rose",
  "Made to order": "peach",
  "Last one": "butter",
  Custom: "sky",
};

export default function ProductCard({ product }) {
  const tone = STICKER_TONE[product.sticker] || "butter";

  return (
    <Link className="product-card" to={`/shop/${product.slug}`}>
      <div className="media">
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className={`sticker fill-${tone}`}>{product.sticker}</span>
      </div>
      <div className="body">
        <h3>{product.name}</h3>
        <p className="meta">{product.meta}</p>
        <p className="price">{formatMoney(product.price)}</p>
      </div>
    </Link>
  );
}
