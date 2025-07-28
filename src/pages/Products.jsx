import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit,
  RefreshCw,
  EllipsisVertical,
  Eye,
  Trash2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import ProductForm from "@/components/ProductForm";
import { toast } from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 10;
const statusOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

const Products = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [permanentDeleteId, setPermanentDeleteId] = useState(null);
  const [toggleId, setToggleId] = useState(null);
  const [natureOptions, setNatureOptions] = useState([]);
  const [plantOptions, setPlantOptions] = useState([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset page to 1 when search or status changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  // Fetch nature and plant options for dropdowns
  useEffect(() => {
    api
      .getNatures({ isActive: "true", limit: 1000 })
      .then((res) => {
        if (res && res.data && res.data.natures)
          setNatureOptions(res.data.natures);
      })
      .catch(() => setNatureOptions([]));
    api
      .getPlants({ isActive: "true", limit: 1000 })
      .then((res) => {
        if (res && res.data && res.data.plants)
          setPlantOptions(res.data.plants);
      })
      .catch(() => setPlantOptions([]));
  }, []);

  // Fetch products with search, filter, pagination
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["products", { debouncedSearch, status, page }],
    queryFn: async () => {
      const params = {
        page,
        limit: PAGE_SIZE,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (status !== "all") params.isActive = status;
      // Use searchProducts instead of getProducts
      const res = await api.searchProducts(params);
      return res;
    },
    keepPreviousData: true,
  });

  // Add Product
  const addMutation = useMutation({
    mutationFn: async (formData) => {
      return await api.createProduct(formData);
    },
    onSuccess: () => {
      toast.success("Product added successfully");
      queryClient.invalidateQueries(["products"]);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to add product");
    },
  });

  // Edit Product
  const editMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      return await api.updateProduct(id, formData);
    },
    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries(["products"]);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update product");
    },
  });

  // Permanent Delete
  const permanentDeleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.permanentDeleteProduct(id);
    },
    onSuccess: () => {
      setPermanentDeleteId(null);
      toast.success("Product permanently deleted");
      queryClient.invalidateQueries(["products"]);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to permanently delete product");
    },
  });

  // Toggle Status
  const toggleMutation = useMutation({
    mutationFn: async (id) => {
      return await api.toggleProductStatus(id);
    },
    onSuccess: () => {
      setToggleId(null);
      toast.success("Product status toggled");
      queryClient.invalidateQueries(["products"]);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to toggle status");
    },
  });

  // Handlers
  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleStatusChange = useCallback((val) => {
    setStatus(val);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  // New handlers for navigation
  const handleAddProduct = () => navigate("/products/create");
  const handleEditProduct = (id) => navigate(`/products/${id}/edit`);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Product Management</CardTitle>
            <CardDescription>
              View, edit, and manage all products
            </CardDescription>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <div className="relative">
              <Input
                placeholder="Search products..."
                value={search}
                onChange={handleSearchChange}
                className="w-48 pr-8"
              />
              <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            <Select value={status} onValueChange={handleStatusChange}>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-2 text-left font-semibold">Name</th>
                  <th className="px-4 py-2 text-left font-semibold">Abbr.</th>
                  <th className="px-4 py-2 text-left font-semibold">Nature</th>
                  <th className="px-4 py-2 text-left font-semibold">Plant</th>
                  <th className="px-4 py-2 text-left font-semibold">Status</th>
                  <th className="px-4 py-2 text-left font-semibold">Image</th>
                  <th className="px-4 py-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? (
                  Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={7} className="px-4 py-2">
                        <Skeleton className="h-6 w-full" />
                      </td>
                    </tr>
                  ))
                ) : isError ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-2 text-center text-destructive"
                    >
                      Failed to load products.
                    </td>
                  </tr>
                ) : data.data &&
                  data.data.products &&
                  data.data.products.length > 0 ? (
                  data.data.products.map((product) => (
                    <tr key={product._id} className="border-b last:border-0">
                      <td className="px-4 py-2 font-medium">{product.name}</td>
                      <td className="px-4 py-2">{product.abbreviation}</td>
                      <td className="px-4 py-2">
                        {product.natureId?.name || "-"}
                      </td>
                      <td className="px-4 py-2">
                        {product.plantId?.name || "-"}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            product.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={
                              product.images.find((img) => img.isPrimary)
                                ?.url || product.images[0].url
                            }
                            alt={
                              product.images.find((img) => img.isPrimary)
                                ?.alt || product.name
                            }
                            className="h-10 w-16 object-contain rounded border"
                          />
                        ) : (
                          <span className="text-muted-foreground">
                            No image
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 flex gap-1 flex-wrap">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="outline">
                              <EllipsisVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/products/${product._id}`)
                              }
                            >
                              <Eye className="h-4 w-4 mr-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditProduct(product._id)}
                            >
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setToggleId(product._id)}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              {product.isActive ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setPermanentDeleteId(product._id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Permanent
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-2 text-center text-muted-foreground"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Permanent Delete Confirm */}
          {permanentDeleteId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-sm relative">
                <h2 className="text-lg font-bold mb-4">
                  Permanently Delete Product?
                </h2>
                <p className="mb-4">
                  This will remove the product from the database. This action
                  cannot be undone.
                </p>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="destructive"
                    onClick={() =>
                      permanentDeleteMutation.mutate(permanentDeleteId)
                    }
                    loading={permanentDeleteMutation.isLoading}
                  >
                    Delete Permanently
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPermanentDeleteId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Toggle Status Confirm */}
          {toggleId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-sm relative">
                <h2 className="text-lg font-bold mb-4">
                  Toggle Product Status?
                </h2>
                <p className="mb-4">
                  Are you sure you want to activate/deactivate this product?
                </p>
                <div className="flex gap-2 justify-end">
                  <Button
                    onClick={() => toggleMutation.mutate(toggleId)}
                    loading={toggleMutation.isLoading}
                  >
                    Yes
                  </Button>
                  <Button variant="outline" onClick={() => setToggleId(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              {data && data.data && data.data.total
                ? `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(
                    page * PAGE_SIZE,
                    data.data.total
                  )} of ${data.data.total}`
                : ""}
            </div>
            <div className="flex gap-2 items-center">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1 || isLoading}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                Page {page}
                {data && data.data && data.data.total
                  ? ` of ${Math.ceil(data.data.total / PAGE_SIZE)}`
                  : ""}
              </span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  if (data && data.data && data.data.total) {
                    const maxPage = Math.ceil(data.data.total / PAGE_SIZE);
                    handlePageChange(page < maxPage ? page + 1 : page);
                  }
                }}
                disabled={
                  isLoading ||
                  (data &&
                    data.data &&
                    page >= Math.ceil(data.data.total / PAGE_SIZE))
                }
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
