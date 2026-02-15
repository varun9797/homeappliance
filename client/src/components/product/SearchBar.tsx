import { useState } from "react";
import { useProducts } from "../../hooks/useProducts";

export default function SearchBar() {
  const { fetchProducts } = useProducts();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchProducts({ search: query || undefined, page: 1 });
  }

  return (
    <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: 8, flex: 1 }}
      />
      <button type="submit" style={{ padding: "8px 16px" }}>Search</button>
    </form>
  );
}
