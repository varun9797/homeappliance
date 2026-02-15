import { useEffect, useState } from "react";
import { getCategoriesApi, createCategoryApi, deleteCategoryApi } from "../api/products";
import type { Category } from "@appliences/shared";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  async function load() {
    const data = await getCategoriesApi();
    setCategories(data);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await createCategoryApi({ name: form.name, description: form.description });
    setForm({ name: "", description: "" });
    setShowForm(false);
    load();
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this category?")) {
      await deleteCategoryApi(id);
      load();
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Manage Categories</h1>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "8px 16px" }}>
          {showForm ? "Cancel" : "+ Add Category"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8, marginBottom: 24 }}>
          <div style={{ display: "grid", gap: 12 }}>
            <input placeholder="Category Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={{ padding: 8 }} />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ padding: 8 }} />
            <button type="submit" style={{ padding: "8px 16px" }}>Create Category</button>
          </div>
        </form>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
            <th style={{ padding: 8 }}>Name</th>
            <th style={{ padding: 8 }}>Slug</th>
            <th style={{ padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c._id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 8 }}>{c.name}</td>
              <td style={{ padding: 8 }}>{c.slug}</td>
              <td style={{ padding: 8 }}>
                <button onClick={() => handleDelete(c._id)} style={{ color: "red" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
