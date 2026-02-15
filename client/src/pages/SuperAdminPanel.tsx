import { useEffect, useState } from "react";
import { getUsersApi, promoteUserApi, demoteAdminApi, approveAdminApi, deleteUserApi } from "../api/admin";
import type { User } from "@appliences/shared";

export default function SuperAdminPanel() {
  const [users, setUsers] = useState<User[]>([]);

  async function load() {
    const data = await getUsersApi();
    setUsers(data);
  }

  useEffect(() => { load(); }, []);

  async function handlePromote(id: string) {
    await promoteUserApi(id);
    load();
  }

  async function handleDemote(id: string) {
    await demoteAdminApi(id);
    load();
  }

  async function handleApprove(id: string) {
    await approveAdminApi(id);
    load();
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this user?")) {
      await deleteUserApi(id);
      load();
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">User Management</h1>
        <p className="text-sm text-slate-600">Approve admins and manage roles with confidence.</p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Approved</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
                <td className="px-4 py-3 text-slate-500">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{u.role}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${u.isApproved ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                    {u.isApproved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {u.role === "user" && (
                      <button onClick={() => handlePromote(u._id)} className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                        Promote to Admin
                      </button>
                    )}
                    {u.role === "admin" && (
                      <button onClick={() => handleDemote(u._id)} className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                        Demote to User
                      </button>
                    )}
                    {!u.isApproved && (
                      <button onClick={() => handleApprove(u._id)} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                        Approve
                      </button>
                    )}
                    {u.role !== "super_admin" && (
                      <button onClick={() => handleDelete(u._id)} className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                        Delete
                      </button>
                    )}
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
