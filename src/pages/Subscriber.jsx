import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2 } from "lucide-react"; // Removed Edit since no editing is needed
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { toast } from "react-hot-toast";

const Subscriber = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["subscribers"],
    queryFn: async () => {
      const res = await api.getSubscribers(); // New endpoint for subscribers
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.deleteSubscriber(id); // New delete endpoint
    },
    onSuccess: () => {
      toast.success("Subscriber deleted");
      queryClient.invalidateQueries(["subscribers"]);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete subscriber");
    },
  });

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscribers</h1>
          <p className="text-muted-foreground">Manage subscriber list</p>
        </div>

        {/* Disabled as per no CRUD beyond save/delete */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscriber Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-2 text-left font-semibold">Email</th>
                  <th className="px-4 py-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={2} className="px-4 py-2">
                        <Skeleton className="h-6 w-full" />
                      </td>
                    </tr>
                  ))
                ) : isError ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-4 py-2 text-center text-destructive"
                    >
                      Failed to load subscribers.
                    </td>
                  </tr>
                ) : data && data.length > 0 ? (
                  data.map((subscriber) => (
                    <tr key={subscriber._id} className="border-b last:border-0">
                      <td className="px-4 py-2 font-medium">
                        {subscriber.email}
                      </td>
                      <td className="px-4 py-2 flex gap-1 flex-wrap">
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(subscriber._id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-4 py-2 text-center text-muted-foreground"
                    >
                      No subscribers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscriber;
