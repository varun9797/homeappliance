import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductBySlugApi } from "../api/products";
import type { Product } from "@appliences/shared";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      getProductBySlugApi(slug)
        .then(setProduct)
        .catch(() => setProduct(null))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;
  if (!product) return <p style={{ padding: 24 }}>Product not found.</p>;

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <Link to="/">&larr; Back to Products</Link>
      <h1 style={{ marginTop: 16 }}>{product.name}</h1>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", margin: "16px 0" }}>
        {product.images.map((img, i) => (
          <img key={i} src={img} alt={product.name} style={{ width: 200, height: 200, objectFit: "cover", borderRadius: 4 }} />
        ))}
      </div>
      <p style={{ fontSize: 24, fontWeight: "bold" }}>&#8377;{product.price.toLocaleString()}</p>
      <p style={{ lineHeight: 1.6, marginTop: 16 }}>{product.description}</p>
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3>Specifications</h3>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <tbody>
              {Object.entries(product.specifications).map(([key, value]) => (
                <tr key={key} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: 8, fontWeight: "bold" }}>{key}</td>
                  <td style={{ padding: 8 }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
