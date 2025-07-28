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
  Trash2,
  RefreshCw,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import PlantForm from "@/components/PlantForm";
import { toast } from "react-hot-toast";

const PAGE_SIZE = 10;

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

const Plants = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPlant, setEditPlant] = useState(null);
  const [permanentDeleteId, setPermanentDeleteId] = useState(null);
  const [toggleId, setToggleId] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

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

  // Fetch plants with search, filter, pagination
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["plants", { debouncedSearch, status, page }],
    queryFn: async () => {
      const params = {
        page,
        limit: PAGE_SIZE,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (status !== "all") params.isActive = status;
      const queryString = new URLSearchParams(params).toString();
      const res = await api.request(`/plants/allPlants?${queryString}`);
      return res;
    },
    keepPreviousData: true,
  });

  // Add Plant
  const addMutation = useMutation({
    mutationFn: async (values) => {
      return await api.createPlant(values);
    },
    onSuccess: () => {
      setShowAddModal(false);
      toast.success("Plant added successfully");
      queryClient.invalidateQueries(["plants"]);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to add plant");
    },
  });

  // Edit Plant
  const editMutation = useMutation({
    mutationFn: async ({ id, values }) => {
      return await api.updatePlant(id, values);
    },
    onSuccess: () => {
      setShowEditModal(false);
      setEditPlant(null);
      toast.success("Plant updated successfully");
      queryClient.invalidateQueries(["plants"]);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update plant");
    },
  });

  // Permanent Delete
  const permanentDeleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.request(`/plants/permanent/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      setPermanentDeleteId(null);
      setFeedback({ type: "success", message: "Plant permanently deleted" });
      queryClient.invalidateQueries(["plants"]);
    },
    onError: (err) => {
      setFeedback({
        type: "error",
        message: err.message || "Failed to permanently delete plant",
      });
    },
  });

  // Toggle Status
  const toggleMutation = useMutation({
    mutationFn: async (id) => {
      return await api.request(`/plants/${id}/toggle-status`, {
        method: "PATCH",
      });
    },
    onSuccess: () => {
      setToggleId(null);
      setFeedback({ type: "success", message: "Plant status toggled" });
      queryClient.invalidateQueries(["plants"]);
    },
    onError: (err) => {
      setFeedback({
        type: "error",
        message: err.message || "Failed to toggle status",
      });
    },
  });

  // Fetch single plant for edit
  const handleEdit = async (plant) => {
    setEditPlant({
      ...plant,
      established: plant.established ? plant.established.slice(0, 10) : "",
    });
    setShowEditModal(true);
  };

  // Feedback auto-dismiss
  React.useEffect(() => {
    if (feedback.message) {
      const t = setTimeout(() => setFeedback({ type: "", message: "" }), 4000);
      return () => clearTimeout(t);
    }
  }, [feedback]);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plants</h1>
          <p className="text-muted-foreground">Manage manufacturing plants</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Plant
        </Button>
      </div>

      {/* Feedback handled by toast, so remove inline feedback */}

      {/* Add Plant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-0 w-full max-w-2xl relative">
            <div className="p-6">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setShowAddModal(false)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4">Add Plant</h2>
              <hr className="mb-4" />
              <PlantForm
                onSubmit={(values) => addMutation.mutate(values)}
                onCancel={() => setShowAddModal(false)}
                loading={addMutation.isLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Plant Modal */}
      {showEditModal && editPlant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-0 w-full max-w-2xl relative">
            <div className="p-6">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                onClick={() => {
                  setShowEditModal(false);
                  setEditPlant(null);
                }}
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4">Edit Plant</h2>
              <hr className="mb-4" />
              <PlantForm
                initialValues={editPlant}
                onSubmit={(values) =>
                  editMutation.mutate({ id: editPlant._id, values })
                }
                onCancel={() => {
                  setShowEditModal(false);
                  setEditPlant(null);
                }}
                loading={editMutation.isLoading}
                isEdit
              />
            </div>
          </div>
        </div>
      )}

      {/* Permanent Delete Confirm */}
      {permanentDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-sm relative">
            <h2 className="text-lg font-bold mb-4">
              Permanently Delete Plant?
            </h2>
            <p className="mb-4">
              This will remove the plant from the database. This action cannot
              be undone.
            </p>
            <div className="flex gap-2">
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
            <h2 className="text-lg font-bold mb-4">Toggle Plant Status?</h2>
            <p className="mb-4">
              Are you sure you want to activate/deactivate this plant?
            </p>
            <div className="flex gap-2">
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

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Plant Management</CardTitle>
            <CardDescription>
              View, edit, and manage all manufacturing plants
            </CardDescription>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <div className="relative">
              <Input
                placeholder="Search plants..."
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
                  <th className="px-4 py-2 text-left font-semibold">
                    Location
                  </th>
                  <th className="px-4 py-2 text-left font-semibold">
                    Capacity
                  </th>
                  <th className="px-4 py-2 text-left font-semibold">
                    Established
                  </th>
                  <th className="px-4 py-2 text-left font-semibold">Status</th>
                  <th className="px-4 py-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? (
                  Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="px-4 py-2">
                        <Skeleton className="h-6 w-full" />
                      </td>
                    </tr>
                  ))
                ) : isError ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-2 text-center text-destructive"
                    >
                      Failed to load plants.
                    </td>
                  </tr>
                ) : data &&
                  data.data &&
                  data.data.plants &&
                  data.data.plants.length > 0 ? (
                  data.data.plants.map((plant) => (
                    <tr key={plant._id} className="border-b last:border-0">
                      <td className="px-4 py-2 font-medium">{plant.name}</td>
                      <td className="px-4 py-2">{plant.location}</td>
                      <td className="px-4 py-2">{plant.capacity}</td>
                      <td className="px-4 py-2">
                        {plant.established
                          ? new Date(plant.established).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            plant.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {plant.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-2 flex gap-1 flex-wrap">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleEdit(plant)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setToggleId(plant._id)}
                          title={plant.isActive ? "Deactivate" : "Activate"}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => setPermanentDeleteId(plant._id)}
                          title="Permanent Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-2 text-center text-muted-foreground"
                    >
                      No plants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
            <div className="flex gap-2">
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

export default Plants;
