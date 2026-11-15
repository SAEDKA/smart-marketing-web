"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useI18n } from "@/lib/i18n/context";
import { productsApi } from "@/lib/api/products.api";
import {
  Product,
  ProductStatus,
  CreateProductRequest,
  ApiErrorShape,
} from "@/types/domain";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  ShoppingBag,
  Plus,
  Search,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Star,
  X,
  RefreshCw,
  DollarSign,
  AlertCircle,
  Link2,
} from "lucide-react";

export default function ProductsPage() {
  const { t } = useI18n();

  // Data & loading state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Filters & View mode
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "ALL">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  // Dialog states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const [isFetchingImport, setIsFetchingImport] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form states for Create/Edit
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("Specialty Coffee");
  const [formPrice, setFormPrice] = useState<number | string>(20);
  const [formDiscount, setFormDiscount] = useState<number | string>(0);
  const [formPurchaseUrl, setFormPurchaseUrl] = useState("");
  const [formStatus, setFormStatus] = useState<ProductStatus>("ACTIVE");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [, setIsUploadingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch products from API
  const loadProducts = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const res = await productsApi.getProducts({
        search: searchQuery,
        status: statusFilter,
        category: categoryFilter,
      });
      setProducts(res.data);
    } catch (err) {
      const apiErr = err as ApiErrorShape;
      setStatusMessage({
        type: "error",
        text: apiErr.message || t.common.errorOccurred,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [searchQuery, statusFilter, categoryFilter]);

  // Unique categories derived from current products
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Open Add Product Dialog
  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setFormName("");
    setFormDescription("");
    setFormCategory("Specialty Coffee");
    setFormPrice(20);
    setFormDiscount(0);
    setFormPurchaseUrl("");
    setFormStatus("ACTIVE");
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Import from link: pull a product name out of a product-page URL,
  // then hand off to the regular product form for review and saving.
  const parseNameFromUrl = (raw: string): string | null => {
    try {
      const url = new URL(raw.trim());
      const segments = url.pathname.split("/").filter(Boolean);
      const last = segments[segments.length - 1] || "";
      const cleaned = decodeURIComponent(last)
        .replace(/\.[a-z0-9]+$/i, "")
        .replace(/[-_]+/g, " ")
        .trim();
      if (cleaned) {
        return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
      }
      return url.hostname.replace(/^www\./, "");
    } catch {
      return null;
    }
  };

  const handleFetchFromLink = async () => {
    const name = parseNameFromUrl(importUrl);
    if (!name) {
      setImportError(t.products.importInvalidUrl);
      return;
    }
    setImportError(null);
    setIsFetchingImport(true);
    // Simulated catalog fetch: in live mode this resolves through the
    // backend's product-link importer.
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsFetchingImport(false);
    setIsImportModalOpen(false);
    handleOpenAddModal();
    setFormName(name);
    setFormPurchaseUrl(importUrl.trim());
    setImportUrl("");
  };

  // Open Edit Product Dialog
  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product);
    setFormName(product.name);
    setFormDescription(product.description);
    setFormCategory(product.category);
    setFormPrice(product.price);
    setFormDiscount(product.discountPercent || 0);
    setFormPurchaseUrl(product.purchaseUrl || "");
    setFormStatus(product.status);
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Media Manager Dialog
  const handleOpenMediaModal = (product: Product) => {
    setSelectedProduct(product);
    setUploadError(null);
    setIsMediaModalOpen(true);
  };

  // Open Delete Confirmation
  const handleOpenDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Submit Product Form (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const errs: Record<string, string> = {};
    if (!formName.trim()) errs.name = t.validation.fullNameRequired;
    if (formPrice === "" || Number(formPrice) < 0)
      errs.price = "Price must be non-negative";

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setIsSavingProduct(true);
    try {
      const payload: CreateProductRequest = {
        name: formName.trim(),
        description: formDescription.trim(),
        category: formCategory.trim() || "General",
        price: Number(formPrice),
        discountPercent: Number(formDiscount) || 0,
        purchaseUrl: formPurchaseUrl.trim(),
        status: formStatus,
      };

      if (selectedProduct) {
        // Update
        const res = await productsApi.updateProduct(selectedProduct.id, payload);
        setProducts((prev) =>
          prev.map((p) => (p.id === selectedProduct.id ? res.data : p))
        );
      } else {
        // Create
        const res = await productsApi.createProduct(payload);
        setProducts((prev) => [res.data, ...prev]);
      }

      setIsFormModalOpen(false);
      setStatusMessage({
        type: "success",
        text: t.products.productSaved,
      });
    } catch (err) {
      const apiErr = err as ApiErrorShape;
      setFormErrors({ api: apiErr.message || t.common.errorOccurred });
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      await productsApi.deleteProduct(selectedProduct.id);
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
      setIsDeleteModalOpen(false);
      setStatusMessage({
        type: "success",
        text: t.products.productDeleted,
      });
    } catch (err) {
      const apiErr = err as ApiErrorShape;
      setStatusMessage({
        type: "error",
        text: apiErr.message || t.common.errorOccurred,
      });
    }
  };

  // Handle Media File Selection (WEB-02-02)
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !selectedProduct) return;
    const file = files[0];
    setUploadError(null);
    setIsUploadingMedia(true);

    try {
      const res = await productsApi.uploadMedia(selectedProduct.id, {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || "image/jpeg",
        simulateFailure: false,
      });

      // Update local state
      const updatedMedia = [...selectedProduct.media, res.data];
      const updatedProduct = { ...selectedProduct, media: updatedMedia };
      setSelectedProduct(updatedProduct);
      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProduct.id ? updatedProduct : p))
      );
    } catch (err) {
      const apiErr = err as ApiErrorShape;
      setUploadError(apiErr.message || t.common.errorOccurred);
    } finally {
      setIsUploadingMedia(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Set Media as Primary Cover
  const handleSetPrimaryMedia = async (mediaId: string) => {
    if (!selectedProduct) return;
    const mediaIds = selectedProduct.media.map((m) => m.id);
    try {
      const res = await productsApi.reorderMedia(selectedProduct.id, {
        mediaIds,
        primaryMediaId: mediaId,
      });
      setSelectedProduct(res.data);
      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProduct.id ? res.data : p))
      );
    } catch (err) {
      console.error("Failed to set primary media", err);
    }
  };

  // Move Media Order (Order sequence determines carousel in posts)
  const handleMoveMedia = async (index: number, direction: "up" | "down") => {
    if (!selectedProduct) return;
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= selectedProduct.media.length) return;

    const nextMedia = [...selectedProduct.media];
    const [moved] = nextMedia.splice(index, 1);
    nextMedia.splice(targetIdx, 0, moved);

    const mediaIds = nextMedia.map((m) => m.id);
    try {
      const res = await productsApi.reorderMedia(selectedProduct.id, {
        mediaIds,
        primaryMediaId: nextMedia[0]?.id,
      });
      setSelectedProduct(res.data);
      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProduct.id ? res.data : p))
      );
    } catch (err) {
      console.error("Failed to reorder media", err);
    }
  };

  // Remove Media from Product
  const handleRemoveMedia = async (mediaId: string) => {
    if (!selectedProduct) return;
    const nextMedia = selectedProduct.media.filter((m) => m.id !== mediaId);
    const mediaIds = nextMedia.map((m) => m.id);
    try {
      const res = await productsApi.reorderMedia(selectedProduct.id, {
        mediaIds,
        primaryMediaId: nextMedia[0]?.id,
      });
      setSelectedProduct(res.data);
      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProduct.id ? res.data : p))
      );
    } catch (err) {
      console.error("Failed to remove media", err);
    }
  };

  // Format file size helper
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Workspace Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {t.products.title}
          </h1>
          <p className="text-sm text-txt-secondary mt-1">{t.products.subtitle}</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={loadProducts}
            title="Refresh from API"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Sync
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              setImportError(null);
              setIsImportModalOpen(true);
            }}
            leftIcon={<Link2 className="w-4 h-4" />}
          >
            {t.products.importFromLink}
          </Button>

          <Button
            variant="primary"
            onClick={handleOpenAddModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            {t.products.addProduct}
          </Button>
        </div>
      </div>

      {/* Global Status Message */}
      {statusMessage && (
        <div
          role="alert"
          className={`p-3.5 rounded-2xl text-xs sm:text-sm flex items-center gap-3 animate-in fade-in ${
            statusMessage.type === "success"
              ? "bg-semantic-success/15 border border-semantic-success/40 text-semantic-success"
              : "bg-semantic-error/15 border border-semantic-error/40 text-semantic-error"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="ms-auto p-1 hover:opacity-70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search, Filters, and View Controls */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Field */}
          <div className="w-full lg:w-80">
            <Input
              placeholder={t.products.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftElement={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Filters & View Toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Filter */}
            <div className="w-36">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as ProductStatus | "ALL")
                }
                className="glass-input w-full h-11 px-3 text-xs text-white bg-navy-900 focus:outline-none"
              >
                <option value="ALL">{t.products.filterAll}</option>
                <option value="ACTIVE">{t.products.filterActive}</option>
                <option value="DRAFT">{t.products.filterDraft}</option>
                <option value="ARCHIVED">{t.products.filterArchived}</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="w-40">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="glass-input w-full h-11 px-3 text-xs text-white bg-navy-900 focus:outline-none"
              >
                <option value="ALL">{t.products.allCategories}</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 ms-auto lg:ms-2">
              <button
                type="button"
                onClick={() => setViewMode("card")}
                title={t.products.cardView}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "card"
                    ? "bg-accent-violet/20 text-white shadow-glow-violet/20"
                    : "text-txt-muted hover:text-white"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                title={t.products.tableView}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "table"
                    ? "bg-accent-violet/20 text-white shadow-glow-violet/20"
                    : "text-txt-muted hover:text-white"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-5 space-y-4">
              <Skeleton className="h-44 w-full rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && products.length === 0 && (
        <Card className="text-center p-10 sm:p-14 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-txt-muted flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8 opacity-40" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            {t.products.noProductsFound}
          </h3>
          <p className="text-xs sm:text-sm text-txt-secondary max-w-md mx-auto leading-relaxed">
            {t.products.emptyStateDesc}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            {(searchQuery || statusFilter !== "ALL" || categoryFilter !== "ALL") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                  setCategoryFilter("ALL");
                }}
              >
                {t.common.reset}
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenAddModal}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              {t.products.addProduct}
            </Button>
          </div>
        </Card>
      )}

      {/* 1. CARD VIEW (Grid) */}
      {!isLoading && products.length > 0 && viewMode === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => {
            const primaryMedia =
              product.media.find((m) => m.isPrimary) || product.media[0];

            return (
              <Card
                key={product.id}
                interactive
                className="flex flex-col justify-between p-5 group"
              >
                {/* Media Preview Area */}
                <div>
                  <div className="relative h-48 rounded-2xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 border border-white/15 overflow-hidden mb-4 flex items-center justify-center text-txt-muted">
                    <div
                      className="absolute -top-10 -end-10 w-36 h-36 rounded-full bg-accent-violet/25 blur-2xl pointer-events-none"
                      aria-hidden="true"
                    />
                    <div
                      className="absolute -bottom-10 -start-10 w-36 h-36 rounded-full bg-accent-cyan/20 blur-2xl pointer-events-none"
                      aria-hidden="true"
                    />
                    {primaryMedia ? (
                      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-2.5 shadow-glow-violet group-hover:scale-105 transition-transform">
                          <ShoppingBag className="w-7 h-7 text-accent-cyan" />
                        </div>
                        <span className="text-xs font-semibold text-white truncate max-w-full">
                          {product.name}
                        </span>
                        <span className="text-[10px] font-mono text-txt-muted mt-0.5 tabular-nums-metric">
                          {primaryMedia.fileName} &bull; {formatFileSize(primaryMedia.fileSize)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 opacity-40">
                        <ImageIcon className="w-8 h-8" />
                        <span className="text-xs">No media uploaded</span>
                      </div>
                    )}

                    {/* Media Count & Primary Badge */}
                    <div className="absolute top-2.5 start-2.5 flex items-center gap-1.5">
                      <Badge
                        variant={
                          product.status === "ACTIVE"
                            ? "mint"
                            : product.status === "DRAFT"
                            ? "warning"
                            : "outline"
                        }
                        size="sm"
                      >
                        {product.status}
                      </Badge>
                      {product.discountPercent && product.discountPercent > 0 ? (
                        <Badge variant="cyan" size="sm" className="tabular-nums-metric">
                          {product.discountPercent}% OFF
                        </Badge>
                      ) : null}
                    </div>

                    {/* Manage Media Action Trigger */}
                    <button
                      type="button"
                      onClick={() => handleOpenMediaModal(product)}
                      className="absolute bottom-2.5 end-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy-950/80 hover:bg-navy-950 backdrop-blur-md border border-white/15 text-[11px] text-white transition-colors tabular-nums-metric"
                      title={t.products.mediaManagement}
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-accent-cyan" />
                      <span>{product.media.length} images</span>
                    </button>
                  </div>

                  {/* Product Header & Pricing */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-accent-cyan uppercase tracking-wider font-semibold">
                        {product.category}
                      </span>
                      <div className="text-base font-bold text-white tabular-nums-metric">
                        ${product.price.toFixed(2)}
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-accent-violet transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    <p className="text-xs text-txt-secondary line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {product.purchaseUrl && (
                      <a
                        href={product.purchaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-txt-secondary hover:text-white transition-colors"
                        title="Open external purchase page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleOpenMediaModal(product)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-txt-secondary hover:text-accent-cyan transition-colors"
                      title="Manage Media & Images (WEB-02-02)"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEditModal(product)}
                      leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                    >
                      Edit
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleOpenDeleteModal(product)}
                      className="p-2 rounded-xl text-txt-muted hover:text-semantic-error hover:bg-semantic-error/10 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* 2. TABLE VIEW */}
      {!isLoading && products.length > 0 && viewMode === "table" && (
        <Card className="overflow-hidden p-0 border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-txt-muted uppercase font-semibold">
                <tr>
                  <th className="p-4 text-start">Product</th>
                  <th className="p-4 text-start">Category</th>
                  <th className="p-4 text-start">Status</th>
                  <th className="p-4 text-start">Price</th>
                  <th className="p-4 text-start">Media</th>
                  <th className="p-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <ShoppingBag className="w-4 h-4 text-accent-cyan" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate max-w-[200px]">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-txt-muted truncate max-w-[220px]">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-txt-secondary">{product.category}</td>
                    <td className="p-4">
                      <Badge
                        variant={
                          product.status === "ACTIVE"
                            ? "mint"
                            : product.status === "DRAFT"
                            ? "warning"
                            : "outline"
                        }
                        size="sm"
                      >
                        {product.status}
                      </Badge>
                    </td>
                    <td className="p-4 font-bold text-white">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => handleOpenMediaModal(product)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-txt-secondary hover:text-white transition-colors"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-accent-violet" />
                        <span>{product.media.length} files</span>
                      </button>
                    </td>
                    <td className="p-4 text-end">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditModal(product)}
                          leftIcon={<Edit2 className="w-3 h-3" />}
                        >
                          Edit
                        </Button>
                        <button
                          type="button"
                          onClick={() => handleOpenDeleteModal(product)}
                          className="p-1.5 text-txt-muted hover:text-semantic-error rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* IMPORT FROM LINK MODAL */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title={t.products.importTitle}
        description={t.products.importDesc}
        maxWidth="md"
      >
        <div className="space-y-4">
          {importError && (
            <div className="p-3 rounded-xl bg-semantic-error/15 border border-semantic-error/30 text-semantic-error text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          <Input
            label={t.products.importFromLink}
            type="url"
            value={importUrl}
            onChange={(e) => setImportUrl(e.target.value)}
            placeholder={t.products.importUrlPlaceholder}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsImportModalOpen(false)}
            >
              {t.common.cancel}
            </Button>
            <Button
              type="button"
              variant="primary"
              isLoading={isFetchingImport}
              onClick={handleFetchFromLink}
              leftIcon={<Link2 className="w-4 h-4" />}
            >
              {isFetchingImport
                ? t.products.importFetching
                : t.products.importFetchBtn}
            </Button>
          </div>
        </div>
      </Modal>

      {/* CREATE / EDIT PRODUCT MODAL (WEB-02-01) */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedProduct ? t.products.editProduct : t.products.addProduct}
        description="Fill product specifications and pricing verified against NestJS API contracts."
        maxWidth="lg"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          {formErrors.api && (
            <div className="p-3 rounded-xl bg-semantic-error/15 border border-semantic-error/30 text-semantic-error text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{formErrors.api}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t.products.nameLabel}
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              error={formErrors.name}
              placeholder="e.g. Ethiopia Yirgacheffe G1"
              required
            />

            <Input
              label={t.products.categoryLabel}
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              placeholder="e.g. Specialty Coffee"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label={t.products.priceLabel}
              type="number"
              step="0.1"
              value={formPrice}
              onChange={(e) => setFormPrice(e.target.value)}
              error={formErrors.price}
              leftElement={<DollarSign className="w-4 h-4" />}
              required
            />

            <Input
              label={t.products.discountLabel}
              type="number"
              min="0"
              max="100"
              value={formDiscount}
              onChange={(e) => setFormDiscount(e.target.value)}
            />

            <div>
              <label className="block text-xs font-medium text-txt-secondary mb-1.5">
                {t.products.statusLabel}
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as ProductStatus)}
                className="glass-input w-full h-11 px-3 text-xs text-white bg-navy-900 focus:outline-none"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="DRAFT">DRAFT</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
          </div>

          <Textarea
            label={t.products.descriptionLabel}
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            rows={3}
            placeholder="Detailed tasting notes, craftsmanship, or ingredients..."
          />

          <Input
            label={t.products.purchaseUrlLabel}
            type="url"
            value={formPurchaseUrl}
            onChange={(e) => setFormPurchaseUrl(e.target.value)}
            placeholder="https://yourstore.com/products/item"
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsFormModalOpen(false)}
            >
              {t.common.cancel}
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSavingProduct}
            >
              {isSavingProduct ? t.common.saving : t.common.save}
            </Button>
          </div>
        </form>
      </Modal>

      {/* MEDIA MANAGEMENT MODAL (WEB-02-02) */}
      <Modal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        title={`${t.products.mediaManagement} — ${selectedProduct?.name}`}
        description={t.products.uploadAreaDesc}
        maxWidth="xl"
      >
        <div className="space-y-6">
          {/* Upload Error Banner */}
          {uploadError && (
            <div className="p-3 rounded-xl bg-semantic-error/15 border border-semantic-error/40 text-semantic-error text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Drag & Drop Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-8 border-2 border-dashed border-white/20 hover:border-accent-violet/60 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-center cursor-pointer space-y-2 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
            <div className="w-12 h-12 rounded-2xl bg-accent-violet/20 text-accent-violet flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-white">
              {t.products.uploadAreaTitle}
            </p>
            <p className="text-[11px] text-txt-muted max-w-sm mx-auto">
              {t.products.uploadAreaDesc}
            </p>
          </div>

          {/* Current Media List & Reordering Controls */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-txt-muted">
              Current Media Sequence ({selectedProduct?.media.length || 0} Assets)
            </h4>

            {selectedProduct?.media.length === 0 ? (
              <p className="text-xs text-txt-muted text-center py-4">
                No images associated with this product yet.
              </p>
            ) : (
              <div className="space-y-2">
                {selectedProduct?.media.map((med, idx) => (
                  <div
                    key={med.id}
                    className="p-3 rounded-2xl glass-card flex items-center justify-between gap-3 text-xs"
                  >
                    {/* Media Thumbnail & Meta */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-navy-950 border border-white/10 flex items-center justify-center text-accent-cyan shrink-0">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white truncate">
                            {med.fileName}
                          </span>
                          {med.isPrimary && (
                            <Badge variant="mint" size="sm">
                              <Star className="w-3 h-3 fill-accent-mint me-0.5" />
                              {t.products.primaryBadge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-txt-muted">
                          {formatFileSize(med.fileSize)} &bull; {med.mimeType}
                        </p>
                      </div>
                    </div>

                    {/* Actions: Primary toggle, Reordering, Delete */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!med.isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryMedia(med.id)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-accent-cyan font-medium border border-white/10"
                        >
                          {t.products.setPrimary}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleMoveMedia(idx, "up")}
                        disabled={idx === 0}
                        title={t.products.moveUp}
                        className="p-1.5 rounded-lg text-txt-muted hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveMedia(idx, "down")}
                        disabled={idx === (selectedProduct.media.length - 1)}
                        title={t.products.moveDown}
                        className="p-1.5 rounded-lg text-txt-muted hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(med.id)}
                        title={t.products.removeMedia}
                        className="p-1.5 rounded-lg text-txt-muted hover:text-semantic-error hover:bg-semantic-error/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <Button
              variant="primary"
              onClick={() => setIsMediaModalOpen(false)}
            >
              {t.common.close}
            </Button>
          </div>
        </div>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t.products.deleteProduct}
        description={t.products.confirmDelete}
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-txt-secondary leading-relaxed">
            Deleting <strong className="text-white">{selectedProduct?.name}</strong> will remove it from the product catalog and all AI campaign generators.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              {t.common.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              {t.common.confirmAction}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
