import { useAtom } from "jotai";
import { productsAtom, productsTotalAtom, categoriesAtom, filtersAtom } from "../atoms/productAtom";
import { getProductsApi, getCategoriesApi } from "../api/products";
import type { ProductFilters } from "@appliences/shared";

export function useProducts() {
  const [products, setProducts] = useAtom(productsAtom);
  const [total, setTotal] = useAtom(productsTotalAtom);
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [filters, setFilters] = useAtom(filtersAtom);

  async function fetchProducts(overrides?: Partial<ProductFilters>) {
    const activeFilters = { ...filters, ...overrides };
    const result = await getProductsApi(activeFilters);
    setProducts(result.data);
    setTotal(result.total);
    if (overrides) setFilters(activeFilters);
  }

  async function fetchCategories() {
    const data = await getCategoriesApi();
    setCategories(data);
  }

  return { products, total, categories, filters, setFilters, fetchProducts, fetchCategories };
}
