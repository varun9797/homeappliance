import { useEffect, useState } from "react";
import { getProductsApi, createProductApi, updateProductApi, deleteProductApi, getCategoriesApi } from "../api/products";
import type { Product, Category } from "@appliences/shared";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
  isActive: boolean;
  specifications: Record<string, string>;
}

const emptyForm: ProductForm = { name: "", description: "", price: "", category: "", isActive: true, specifications: {} };

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");

  async function load() {
    const [prodData, catData] = await Promise.all([
      getProductsApi({ limit: 100 }),
      getCategoriesApi(),
    ]);
    setProducts(prodData.data);
    setCategories(catData);
  }

  useEffect(() => { load(); }, []);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError("");
  }

  function openEditForm(product: Product) {
    setEditingId(product._id);
    const catId = typeof product.category === "string" ? product.category : (product.category as Category)?._id || "";
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: catId,
      isActive: product.isActive,
      specifications: product.specifications ? { ...product.specifications } : {},
    });
    setShowForm(true);
    setError("");
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  function addSpecification() {
    if (specKey.trim()) {
      setForm({ ...form, specifications: { ...form.specifications, [specKey.trim()]: specValue.trim() } });
      setSpecKey("");
      setSpecValue("");
    }
  }

  function removeSpecification(key: string) {
    const updated = { ...form.specifications };
    delete updated[key];
    setForm({ ...form, specifications: updated });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        isActive: form.isActive,
        specifications: form.specifications,
      };

      if (editingId) {
        await updateProductApi(editingId, payload);
      } else {
        await createProductApi(payload);
      }
      closeForm();
      load();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Operation failed";
      setError(msg);
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this product?")) {
      await deleteProductApi(id);
      load();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Manage Products</h1>
          <p className="text-sm text-slate-600">Create, update, and manage product listings.</p>
        </div>
        <button
          onClick={showForm ? closeForm : openCreateForm}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">{editingId ? "Edit Product" : "New Product"}</h3>
            {error && <p className="rounded-xl bg-red-50 px-3 py-1 text-sm text-red-600">{error}</p>}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            />
            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            >
              <option value="">Select Category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              Active
            </label>
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={4}
              className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            />

            <fieldset className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <legend className="px-2 text-sm font-semibold text-slate-700">Specifications</legend>
              <div className="mt-3 space-y-3">
                {Object.entries(form.specifications).map(([key, value]) => (
                  <div key={key} className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-slate-700">{key}:</span>
                    <input
                      value={value}
                      onChange={(e) => setForm({ ...form, specifications: { ...form.specifications, [key]: e.target.value } })}
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
                    <button type="button" onClick={() => removeSpecification(key)} className="text-xs font-semibold text-red-500 hover:text-red-600">Remove</button>
                  </div>
                ))}
                <div className="flex flex-wrap gap-2">
                  <input
                    placeholder="Key (e.g. brand)"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="Value (e.g. Bosch)"
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                  <button type="button" onClick={addSpecification} className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white">+ Add</button>
                </div>
              </div>
            </fieldset>

            <div className="md:col-span-2">
              <button type="submit" className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
                {editingId ? "Update Product" : "Create Product"}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                <td className="px-4 py-3 text-slate-600">{typeof p.category === "object" && p.category ? (p.category as Category).name : "-"}</td>
                <td className="px-4 py-3 text-slate-600">&#8377;{p.price.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${p.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => openEditForm(p)} className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
