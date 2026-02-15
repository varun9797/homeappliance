import { atom } from "jotai";
import type { Product, Category, ProductFilters } from "@appliences/shared";

export const productsAtom = atom<Product[]>([]);
export const productsTotalAtom = atom(0);
export const categoriesAtom = atom<Category[]>([]);

export const filtersAtom = atom<ProductFilters>({
  page: 1,
  limit: 12,
  sort: "newest",
});
