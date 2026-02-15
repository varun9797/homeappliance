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
    <div style={{ padding: 24 }}>
      <h1>User Management</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
            <th style={{ padding: 8 }}>Name</th>
            <th style={{ padding: 8 }}>Email</th>
            <th style={{ padding: 8 }}>Role</th>
            <th style={{ padding: 8 }}>Approved</th>
            <th style={{ padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 8 }}>{u.name}</td>
              <td style={{ padding: 8 }}>{u.email}</td>
              <td style={{ padding: 8 }}>{u.role}</td>
              <td style={{ padding: 8 }}>{u.isApproved ? "Yes" : "No"}</td>
              <td style={{ padding: 8, display: "flex", gap: 8 }}>
                {u.role === "user" && (
                  <button onClick={() => handlePromote(u._id)}>Promote to Admin</button>
                )}
                {u.role === "admin" && (
                  <button onClick={() => handleDemote(u._id)}>Demote to User</button>
                )}
                {!u.isApproved && (
                  <button onClick={() => handleApprove(u._id)} style={{ color: "green" }}>Approve</button>
                )}
                {u.role !== "super_admin" && (
                  <button onClick={() => handleDelete(u._id)} style={{ color: "red" }}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
