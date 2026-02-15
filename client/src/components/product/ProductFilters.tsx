import { useProducts } from "../../hooks/useProducts";
import { useEffect } from "react";

export default function ProductFilters() {
  const { categories, filters, fetchProducts, fetchCategories } = useProducts();

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
      <select
        value={filters.category || ""}
        onChange={(e) => fetchProducts({ category: e.target.value || undefined, page: 1 })}
        style={{ padding: 8 }}
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>
      <select
        value={filters.sort || "newest"}
        onChange={(e) => fetchProducts({ sort: e.target.value as "newest" | "price_asc" | "price_desc" | "name", page: 1 })}
        style={{ padding: 8 }}
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="name">Name</option>
      </select>
      <input
        type="number"
        placeholder="Min Price"
        value={filters.minPrice || ""}
        onChange={(e) => fetchProducts({ minPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
        style={{ padding: 8, width: 120 }}
      />
      <input
        type="number"
        placeholder="Max Price"
        value={filters.maxPrice || ""}
        onChange={(e) => fetchProducts({ maxPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
        style={{ padding: 8, width: 120 }}
      />
    </div>
  );
}
