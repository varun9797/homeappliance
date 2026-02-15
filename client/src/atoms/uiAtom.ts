import { atom } from "jotai";

export interface Toast {
  message: string;
  type: "success" | "error" | "info";
}

export const loadingAtom = atom(false);
export const toastAtom = atom<Toast | null>(null);
export const sidebarOpenAtom = atom(false);
