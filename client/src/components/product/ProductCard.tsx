import { Link } from "react-router-dom";
import type { Product } from "@appliences/shared";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, width: 250 }}>
      {product.images[0] ? (
        <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 4 }} />
      ) : (
        <div style={{ width: "100%", height: 180, background: "#f0f0f0", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
          No Image
        </div>
      )}
      <h3 style={{ margin: "12px 0 4px" }}>{product.name}</h3>
      <p style={{ color: "#666", fontSize: 14, margin: "0 0 8px" }}>{product.description.slice(0, 80)}...</p>
      <p style={{ fontWeight: "bold", fontSize: 18 }}>&#8377;{product.price.toLocaleString()}</p>
      <Link to={`/product/${product.slug}`}>View Details</Link>
    </div>
  );
}
