import api from "./client";
import type { Product, Category, ProductFilters, PaginatedResponse } from "@appliences/shared";

export async function getProductsApi(filters: ProductFilters) {
  const res = await api.get<{ data: PaginatedResponse<Product> }>("/products", { params: filters });
  return res.data.data;
}

export async function getProductBySlugApi(slug: string) {
  const res = await api.get<{ data: Product }>(`/products/${slug}`);
  return res.data.data;
}

export async function createProductApi(data: Partial<Product>) {
  const res = await api.post<{ data: Product }>("/products", data);
  return res.data.data;
}

export async function updateProductApi(id: string, data: Partial<Product>) {
  const res = await api.put<{ data: Product }>(`/products/${id}`, data);
  return res.data.data;
}

export async function deleteProductApi(id: string) {
  await api.delete(`/products/${id}`);
}

export async function uploadProductImagesApi(id: string, files: FormData) {
  const res = await api.post<{ data: Product }>(`/products/${id}/images`, files, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

export async function getCategoriesApi() {
  const res = await api.get<{ data: Category[] }>("/categories");
  return res.data.data;
}

export async function createCategoryApi(data: Partial<Category>) {
  const res = await api.post<{ data: Category }>("/categories", data);
  return res.data.data;
}

export async function updateCategoryApi(id: string, data: Partial<Category>) {
  const res = await api.put<{ data: Category }>(`/categories/${id}`, data);
  return res.data.data;
}

export async function deleteCategoryApi(id: string) {
  await api.delete(`/categories/${id}`);
}
