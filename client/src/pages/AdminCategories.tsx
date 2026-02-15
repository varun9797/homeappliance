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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Manage Categories</h1>
          <p className="text-sm text-slate-600">Keep categories tidy and easy to browse.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          {showForm ? "Cancel" : "+ Add Category"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              placeholder="Category Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            />
            <button type="submit" className="w-fit rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
              Create Category
            </button>
          </div>
        </form>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                <td className="px-4 py-3 text-slate-500">{c.slug}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(c._id)} className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
