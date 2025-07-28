import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import BlogForm from "@/components/BlogForm";
import api from "@/services/api";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await api.getBlog(id);
      return res.data;
    },
  });

  const editMutation = useMutation({
    mutationFn: async (formData) => {
      return await api.updateBlog(id, formData);
    },
    onSuccess: () => {
      toast.success("Blog updated successfully");
      queryClient.invalidateQueries(["blogs"]);
      navigate("/blogs");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update blog");
    },
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-1/3 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>
        <div className="text-red-600">Failed to load blog data.</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Edit Blog</h1>
        <Button
          variant="outline"
          onClick={() => navigate("/blogs")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blogs
        </Button>
      </div>
      <BlogForm
        initialValues={{
          ...data,
          seoKeywords: Array.isArray(data.seoKeywords)
            ? data.seoKeywords.join(", ")
            : data.seoKeywords,
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : data.tags,
        }}
        onSubmit={(formData) => editMutation.mutate(formData)}
        onCancel={() => navigate("/blogs")}
        loading={editMutation.isLoading}
        isEdit={true}
      />
    </div>
  );
};

export default BlogEdit;
