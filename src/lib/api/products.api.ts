import {
  CreateProductRequest,
  Product,
  ProductFilterParams,
  ProductMedia,
} from "@/types/domain";
import { apiRequest, getApiMode } from "./client";

interface NestJsProductRecord {
  id: string;
  businessId?: string;
  companyId?: string;
  name: string;
  description?: string | null;
  category?: string;
  price?: number | string | null;
  currency?: string;
  discountPercent?: number;
  purchaseUrl?: string;
  imageUrl?: string | null;
  status?: "ACTIVE" | "DRAFT" | "ARCHIVED";
  media?: ProductMedia[];
  createdAt?: string;
  updatedAt?: string;
}

function normalizeProduct(raw: NestJsProductRecord | Product): Product {
  if ("media" in raw && Array.isArray(raw.media)) {
    return raw as Product;
  }
  const rec = raw as NestJsProductRecord;
  const mediaList: ProductMedia[] = rec.imageUrl
    ? [
        {
          id: `med_${rec.id}`,
          url: rec.imageUrl,
          fileName: "product-cover.jpg",
          fileSize: 245000,
          mimeType: "image/jpeg",
          isPrimary: true,
          orderIndex: 0,
        },
      ]
    : [];

  return {
    id: rec.id,
    companyId: rec.companyId || rec.businessId || "cmp_live_01",
    name: rec.name,
    description: rec.description || "",
    category: rec.category || "General",
    price: Number(rec.price ?? 0),
    currency: rec.currency || "USD",
    discountPercent: rec.discountPercent ?? 0,
    purchaseUrl: rec.purchaseUrl || "",
    status: rec.status || "ACTIVE",
    media: mediaList,
    createdAt: rec.createdAt || new Date().toISOString(),
    updatedAt: rec.updatedAt || new Date().toISOString(),
  };
}

export const productsApi = {
  getProducts: async (params?: ProductFilterParams) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status && params.status !== "ALL")
      searchParams.append("status", params.status);
    if (params?.category && params.category !== "ALL")
      searchParams.append("category", params.category);

    const query = searchParams.toString();
    const endpoint = query ? `/products?${query}` : "/products";
    const res = await apiRequest<(NestJsProductRecord | Product)[]>(
      "GET",
      endpoint
    );
    return {
      ...res,
      data: res.data.map(normalizeProduct),
    };
  },

  getProductById: async (id: string) => {
    const res = await apiRequest<NestJsProductRecord | Product>(
      "GET",
      `/products/${id}`
    );
    return {
      ...res,
      data: normalizeProduct(res.data),
    };
  },

  createProduct: async (payload: CreateProductRequest) => {
    const requestBody =
      getApiMode() === "live"
        ? {
            name: payload.name,
            description: payload.description,
            price: payload.price,
            currency: payload.currency || "USD",
            imageUrl: payload.media?.[0]?.url || undefined,
          }
        : payload;

    const res = await apiRequest<NestJsProductRecord | Product>(
      "POST",
      "/products",
      requestBody
    );
    return {
      ...res,
      data: normalizeProduct(res.data),
    };
  },

  updateProduct: async (id: string, payload: Partial<CreateProductRequest>) => {
    const method = getApiMode() === "live" ? "PATCH" : "PUT";
    const requestBody =
      getApiMode() === "live"
        ? {
            name: payload.name,
            description: payload.description,
            price: payload.price,
            currency: payload.currency || "USD",
            imageUrl: payload.media?.[0]?.url || undefined,
          }
        : payload;

    const res = await apiRequest<NestJsProductRecord | Product>(
      method,
      `/products/${id}`,
      requestBody
    );
    return {
      ...res,
      data: normalizeProduct(res.data),
    };
  },

  deleteProduct: async (id: string) => {
    const res = await apiRequest<NestJsProductRecord | Product>(
      "DELETE",
      `/products/${id}`
    );
    return {
      ...res,
      data: normalizeProduct(res.data),
    };
  },

  uploadMedia: (
    productId: string,
    payload: {
      fileName: string;
      fileSize: number;
      mimeType: string;
      simulateFailure?: boolean;
    }
  ) =>
    apiRequest<ProductMedia>("POST", `/products/${productId}/media`, payload),

  reorderMedia: (
    productId: string,
    payload: { mediaIds: string[]; primaryMediaId?: string }
  ) =>
    apiRequest<Product>("PUT", `/products/${productId}/media/reorder`, payload),
};
