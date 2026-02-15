import { atom } from "jotai";
import type { User } from "@appliences/shared";

export const userAtom = atom<User | null>(null);
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null);
export const isAdminAtom = atom((get) => {
  const user = get(userAtom);
  return user?.role === "admin" || user?.role === "super_admin";
});
export const isSuperAdminAtom = atom((get) => get(userAtom)?.role === "super_admin");
