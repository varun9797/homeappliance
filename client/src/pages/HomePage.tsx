import SearchBar from "../components/product/SearchBar";
import ProductFilters from "../components/product/ProductFilters";
import ProductList from "../components/product/ProductList";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-soft md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Home essentials</p>
            <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">Trusted appliances for every home</h1>
            <p className="text-base text-slate-600">
              Shop verified brands, clear pricing, and reliable delivery. Everything you need to upgrade your kitchen and living space.
            </p>
            <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-600">
              <span className="rounded-full bg-slate-100 px-3 py-1">Secure checkout</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">Genuine warranty</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">Fast delivery</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase text-slate-400">In stock</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">2,000+ items</p>
              <p className="text-xs">Updated daily</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase text-slate-400">Support</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">7 days</p>
              <p className="text-xs">On-call help</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase text-slate-400">Payments</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">Secure</p>
              <p className="text-xs">Multiple modes</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase text-slate-400">Returns</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">Easy</p>
              <p className="text-xs">Hassle-free</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Browse products</h2>
            <span className="text-xs font-medium text-slate-500">Curated for quality</span>
          </div>
          <SearchBar />
          <ProductFilters />
          <ProductList />
        </div>
      </section>
    </div>
  );
}
