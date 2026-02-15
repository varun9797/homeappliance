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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            No products found. Try adjusting your filters.
          </div>
        ) : (
          products.map((p) => <ProductCard key={p._id} product={p} />)
        )}
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => fetchProducts({ page: i + 1 })}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filters.page === i + 1 ? "bg-slate-900 text-white" : "bg-white text-slate-700 hover:bg-slate-100"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
