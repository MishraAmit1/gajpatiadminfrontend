import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { toast } from "react-hot-toast";

const Blogs = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await api.getBlogs();
      return res;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.deleteBlog(id);
    },
    onSuccess: () => {
      toast.success("Blog deleted");
      queryClient.invalidateQueries(["blogs"]);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete blog");
    },
  });

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
          <p className="text-muted-foreground">Manage blog posts</p>
        </div>
        <Button onClick={() => navigate("/blogs/create")}>Add Blog</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-2 text-left font-semibold">Title</th>
                  <th className="px-4 py-2 text-left font-semibold">Image</th>
                  <th className="px-4 py-2 text-left font-semibold">
                    SEO Title
                  </th>
                  <th className="px-4 py-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={4} className="px-4 py-2">
                        <Skeleton className="h-6 w-full" />
                      </td>
                    </tr>
                  ))
                ) : isError ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-2 text-center text-destructive"
                    >
                      Failed to load blogs.
                    </td>
                  </tr>
                ) : data && data.data && data.data.length > 0 ? (
                  data.data.map((blog) => (
                    <tr key={blog._id} className="border-b last:border-0">
                      <td className="px-4 py-2 font-medium">{blog.title}</td>
                      <td className="px-4 py-2">
                        {blog.image ? (
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="h-10 w-16 object-contain rounded border"
                          />
                        ) : (
                          <span className="text-muted-foreground">
                            No image
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2">{blog.seoTitle}</td>
                      <td className="px-4 py-2 flex gap-1 flex-wrap">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => navigate(`/blogs/${blog._id}/edit`)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(blog._id)}
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
                      colSpan={4}
                      className="px-4 py-2 text-center text-muted-foreground"
                    >
                      No blogs found.
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

export default Blogs;
