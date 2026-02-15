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
    <form onSubmit={handleSearch} className="flex flex-col gap-3 md:flex-row">
      <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <span className="text-slate-400">🔍</span>
        <input
          type="text"
          placeholder="Search products, brands, or categories"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-700 outline-none"
        />
      </div>
      <button
        type="submit"
        className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
      >
        Search
      </button>
    </form>
  );
}
