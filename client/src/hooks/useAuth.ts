import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { userAtom } from "../atoms/authAtom";
import { loginApi, registerApi, logoutApi, getMeApi } from "../api/auth";
import type { LoginRequest, RegisterRequest } from "@appliences/shared";

export function useAuth() {
  const [user, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  async function login(data: LoginRequest) {
    const result = await loginApi(data);
    localStorage.setItem("accessToken", result.accessToken);
    localStorage.setItem("refreshToken", result.refreshToken);
    setUser(result.user);
    navigate("/");
  }

  async function register(data: RegisterRequest) {
    const result = await registerApi(data);
    localStorage.setItem("accessToken", result.accessToken);
    localStorage.setItem("refreshToken", result.refreshToken);
    setUser(result.user);
    navigate("/");
  }

  async function logout() {
    try {
      await logoutApi();
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      navigate("/login");
    }
  }

  async function loadUser() {
    const token = localStorage.getItem("accessToken");
    if (token && !user) {
      try {
        const userData = await getMeApi();
        setUser(userData);
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
  }

  return { user, login, register, logout, loadUser };
}
