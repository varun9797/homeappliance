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
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Manage Products</h1>
        <button onClick={showForm ? closeForm : openCreateForm} style={{ padding: "8px 16px" }}>
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8, marginBottom: 24 }}>
          <h3>{editingId ? "Edit Product" : "New Product"}</h3>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div style={{ display: "grid", gap: 12 }}>
            <input placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={{ padding: 8 }} />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={4} style={{ padding: 8 }} />
            <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required style={{ padding: 8 }} />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required style={{ padding: 8 }}>
              <option value="">Select Category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              Active
            </label>

            {/* Specifications */}
            <fieldset style={{ border: "1px solid #ddd", padding: 12, borderRadius: 4 }}>
              <legend>Specifications</legend>
              {Object.entries(form.specifications).map(([key, value]) => (
                <div key={key} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <strong>{key}:</strong>
                  <input
                    value={value}
                    onChange={(e) => setForm({ ...form, specifications: { ...form.specifications, [key]: e.target.value } })}
                    style={{ padding: 4, flex: 1 }}
                  />
                  <button type="button" onClick={() => removeSpecification(key)} style={{ color: "red" }}>x</button>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input placeholder="Key (e.g. brand)" value={specKey} onChange={(e) => setSpecKey(e.target.value)} style={{ padding: 4, flex: 1 }} />
                <input placeholder="Value (e.g. Bosch)" value={specValue} onChange={(e) => setSpecValue(e.target.value)} style={{ padding: 4, flex: 1 }} />
                <button type="button" onClick={addSpecification} style={{ padding: "4px 12px" }}>+ Add</button>
              </div>
            </fieldset>

            <button type="submit" style={{ padding: "8px 16px" }}>
              {editingId ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
            <th style={{ padding: 8 }}>Name</th>
            <th style={{ padding: 8 }}>Category</th>
            <th style={{ padding: 8 }}>Price</th>
            <th style={{ padding: 8 }}>Active</th>
            <th style={{ padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 8 }}>{p.name}</td>
              <td style={{ padding: 8 }}>{typeof p.category === "object" && p.category ? (p.category as Category).name : "-"}</td>
              <td style={{ padding: 8 }}>&#8377;{p.price.toLocaleString()}</td>
              <td style={{ padding: 8 }}>{p.isActive ? "Yes" : "No"}</td>
              <td style={{ padding: 8, display: "flex", gap: 8 }}>
                <button onClick={() => openEditForm(p)}>Edit</button>
                <button onClick={() => handleDelete(p._id)} style={{ color: "red" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
