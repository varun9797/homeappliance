import api from "./client";
import type { AuthResponse, LoginRequest, RegisterRequest } from "@appliences/shared";

export async function loginApi(data: LoginRequest) {
  const res = await api.post<{ data: AuthResponse }>("/auth/login", data);
  return res.data.data;
}

export async function registerApi(data: RegisterRequest) {
  const res = await api.post<{ data: AuthResponse }>("/auth/register", data);
  return res.data.data;
}

export async function getMeApi() {
  const res = await api.get("/auth/me");
  return res.data.data;
}

export async function logoutApi() {
  await api.post("/auth/logout");
}
