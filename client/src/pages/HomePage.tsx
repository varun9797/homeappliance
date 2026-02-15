import SearchBar from "../components/product/SearchBar";
import ProductFilters from "../components/product/ProductFilters";
import ProductList from "../components/product/ProductList";

export default function HomePage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Home Appliances</h1>
      <SearchBar />
      <ProductFilters />
      <ProductList />
    </div>
  );
}
