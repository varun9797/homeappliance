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

  if (loading) return <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Loading...</p>;
  if (!product) return <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Product not found.</p>;

  return (
    <div className="space-y-6">
      <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900">&larr; Back to Products</Link>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={product.name}
                className="h-48 w-full rounded-2xl object-cover"
              />
            ))}
          </div>
          {product.images.length === 0 && (
            <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">
              No images available
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">{product.name}</h1>
          <p className="mt-3 text-2xl font-semibold text-slate-900">&#8377;{product.price.toLocaleString()}</p>
          <p className="mt-4 text-sm leading-6 text-slate-600">{product.description}</p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1">Warranty included</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">Verified seller</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">Easy returns</span>
          </div>
        </div>
      </div>

      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Specifications</h3>
          <div className="mt-4 grid gap-2">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b border-slate-100 py-2 text-sm">
                <span className="font-medium text-slate-700">{key}</span>
                <span className="text-slate-600">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
