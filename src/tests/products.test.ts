import { describe, it, expect } from "vitest";
import { productsApi } from "@/lib/api/products.api";

describe("R2 Products & Media Management API (WEB-02-01, WEB-02-02)", () => {
  it("fetches the list of products for the authorized company (BE-03-01)", async () => {
    const res = await productsApi.getProducts();
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data[0].companyId).toBe("cmp_lumiere_01");
    expect(res.meta.mode).toBe("mock");
  });

  it("filters products by search keyword and category (BE-03-07)", async () => {
    const searchRes = await productsApi.getProducts({ search: "Yirgacheffe" });
    expect(searchRes.data.length).toBe(1);
    expect(searchRes.data[0].name).toContain("Yirgacheffe");

    const catRes = await productsApi.getProducts({ category: "Artisanal Bakery" });
    expect(catRes.data.every((p) => p.category === "Artisanal Bakery")).toBe(true);
  });

  it("filters products by status (ACTIVE / DRAFT / ARCHIVED)", async () => {
    const activeRes = await productsApi.getProducts({ status: "ACTIVE" });
    expect(activeRes.data.every((p) => p.status === "ACTIVE")).toBe(true);

    const draftRes = await productsApi.getProducts({ status: "DRAFT" });
    expect(draftRes.data.every((p) => p.status === "DRAFT")).toBe(true);
  });

  it("retrieves product by ID (BE-03-02)", async () => {
    const res = await productsApi.getProductById("prd_yirgacheffe_01");
    expect(res.data.id).toBe("prd_yirgacheffe_01");
    expect(res.data.price).toBe(24.5);
  });

  it("throws 404 for non-existent product ID", async () => {
    await expect(
      productsApi.getProductById("non_existent_id")
    ).rejects.toMatchObject({
      code: "NOT_FOUND",
      status: 404,
    });
  });

  it("validates product creation rules (BE-03-03)", async () => {
    // Rejects empty name
    await expect(
      productsApi.createProduct({
        name: "",
        description: "Test desc",
        category: "Coffee",
        price: 20,
      })
    ).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      status: 400,
    });

    // Rejects negative price
    await expect(
      productsApi.createProduct({
        name: "Test Product",
        description: "Desc",
        category: "Coffee",
        price: -5,
      })
    ).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      status: 400,
    });
  });

  it("creates, updates, and deletes a product (BE-03-03, BE-03-04)", async () => {
    // Create
    const created = await productsApi.createProduct({
      name: "Organic Cascara Tea Infusion",
      description: "Dried coffee cherry skins with notes of rosehip and red currant.",
      category: "Specialty Tea",
      price: 18.0,
      status: "DRAFT",
    });
    expect(created.data.id).toBeDefined();
    expect(created.data.name).toBe("Organic Cascara Tea Infusion");

    // Update
    const updated = await productsApi.updateProduct(created.data.id, {
      price: 19.5,
      status: "ACTIVE",
    });
    expect(updated.data.price).toBe(19.5);
    expect(updated.data.status).toBe("ACTIVE");

    // Delete
    const deleted = await productsApi.deleteProduct(created.data.id);
    expect(deleted.data.id).toBe(created.data.id);

    // Verify deleted
    await expect(
      productsApi.getProductById(created.data.id)
    ).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
  });

  it("handles media upload validation: rejects files > 5MB (WEB-02-02, BE-03-05)", async () => {
    await expect(
      productsApi.uploadMedia("prd_yirgacheffe_01", {
        fileName: "huge-poster.jpg",
        fileSize: 6 * 1024 * 1024, // 6MB > 5MB limit
        mimeType: "image/jpeg",
      })
    ).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      status: 400,
    });
  });

  it("handles media upload validation: rejects invalid MIME format", async () => {
    await expect(
      productsApi.uploadMedia("prd_yirgacheffe_01", {
        fileName: "document.pdf",
        fileSize: 500000,
        mimeType: "application/pdf",
      })
    ).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      status: 400,
    });
  });

  it("handles simulated storage service failure for robust error recovery", async () => {
    await expect(
      productsApi.uploadMedia("prd_yirgacheffe_01", {
        fileName: "photo.jpg",
        fileSize: 1000000,
        mimeType: "image/jpeg",
        simulateFailure: true,
      })
    ).rejects.toMatchObject({
      code: "SERVER_ERROR",
      status: 500,
    });
  });

  it("uploads valid media and reorders image sequence (WEB-02-02, BE-03-06)", async () => {
    const uploadRes = await productsApi.uploadMedia("prd_yirgacheffe_01", {
      fileName: "new-harvest-bag.webp",
      fileSize: 1200000,
      mimeType: "image/webp",
    });
    expect(uploadRes.data.id).toBeDefined();

    const product = await productsApi.getProductById("prd_yirgacheffe_01");
    const mediaIds = product.data.media.map((m) => m.id);

    // Reorder: set newly uploaded image as primary
    const reorderedRes = await productsApi.reorderMedia("prd_yirgacheffe_01", {
      mediaIds: [uploadRes.data.id, ...mediaIds.filter((id) => id !== uploadRes.data.id)],
      primaryMediaId: uploadRes.data.id,
    });

    expect(reorderedRes.data.media[0].id).toBe(uploadRes.data.id);
    expect(reorderedRes.data.media[0].isPrimary).toBe(true);
  });
});
