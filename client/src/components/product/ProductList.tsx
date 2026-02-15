import { useEffect } from "react";
import { useProducts } from "../../hooks/useProducts";
import ProductCard from "./ProductCard";

export default function ProductList() {
  const { products, total, filters, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalPages = Math.ceil(total / (filters.limit || 12));

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((p) => <ProductCard key={p._id} product={p} />)
        )}
      </div>
      {totalPages > 1 && (
        <div style={{ marginTop: 24, display: "flex", gap: 8, justifyContent: "center" }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => fetchProducts({ page: i + 1 })}
              style={{ padding: "4px 12px", fontWeight: filters.page === i + 1 ? "bold" : "normal" }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
