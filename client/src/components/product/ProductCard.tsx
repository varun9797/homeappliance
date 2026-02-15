import { Link } from "react-router-dom";
import type { Product } from "@appliences/shared";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="overflow-hidden rounded-xl bg-slate-50">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-48 w-full items-center justify-center text-sm text-slate-400">
            No Image
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="text-base font-semibold text-slate-900">{product.name}</h3>
        <p className="mt-2 text-sm text-slate-600">
          {product.description.slice(0, 90)}...
        </p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg font-semibold text-slate-900">&#8377;{product.price.toLocaleString()}</p>
          <Link
            to={`/product/${product.slug}`}
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}
