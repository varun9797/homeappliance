import api from "./client";
import type { User } from "@appliences/shared";

export async function getUsersApi() {
  const res = await api.get<{ data: User[] }>("/admin/users");
  return res.data.data;
}

export async function getPendingAdminsApi() {
  const res = await api.get<{ data: User[] }>("/admin/pending");
  return res.data.data;
}

export async function promoteUserApi(userId: string) {
  const res = await api.post<{ data: User }>(`/admin/promote/${userId}`);
  return res.data.data;
}

export async function approveAdminApi(userId: string) {
  const res = await api.post<{ data: User }>(`/admin/approve/${userId}`);
  return res.data.data;
}

export async function demoteAdminApi(userId: string) {
  const res = await api.post<{ data: User }>(`/admin/demote/${userId}`);
  return res.data.data;
}

export async function deleteUserApi(userId: string) {
  await api.delete(`/admin/users/${userId}`);
}
