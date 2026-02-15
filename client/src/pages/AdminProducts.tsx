import { useEffect, useState } from "react";
import { getProductsApi, createProductApi, deleteProductApi, getCategoriesApi } from "../api/products";
import type { Product, Category } from "@appliences/shared";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "" });
  const [error, setError] = useState("");

  async function load() {
    const [prodData, catData] = await Promise.all([
      getProductsApi({ limit: 100 }),
      getCategoriesApi(),
    ]);
    setProducts(prodData.data);
    setCategories(catData);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await createProductApi({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
      });
      setForm({ name: "", description: "", price: "", category: "" });
      setShowForm(false);
      load();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create";
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
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Manage Products</h1>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "8px 16px" }}>
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8, marginBottom: 24 }}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div style={{ display: "grid", gap: 12 }}>
            <input placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={{ padding: 8 }} />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required style={{ padding: 8 }} />
            <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required style={{ padding: 8 }} />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required style={{ padding: 8 }}>
              <option value="">Select Category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <button type="submit" style={{ padding: "8px 16px" }}>Create Product</button>
          </div>
        </form>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
            <th style={{ padding: 8 }}>Name</th>
            <th style={{ padding: 8 }}>Price</th>
            <th style={{ padding: 8 }}>Active</th>
            <th style={{ padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 8 }}>{p.name}</td>
              <td style={{ padding: 8 }}>&#8377;{p.price.toLocaleString()}</td>
              <td style={{ padding: 8 }}>{p.isActive ? "Yes" : "No"}</td>
              <td style={{ padding: 8 }}>
                <button onClick={() => handleDelete(p._id)} style={{ color: "red" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
