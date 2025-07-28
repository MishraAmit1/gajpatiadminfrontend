import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import BlogForm from "@/components/BlogForm";
import api from "@/services/api";
import { toast } from "react-hot-toast";

const BlogCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: async (formData) => {
      return await api.createBlog(formData);
    },
    onSuccess: () => {
      toast.success("Blog added successfully");
      queryClient.invalidateQueries(["blogs"]);
      navigate("/blogs");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to add blog");
    },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Create Blog</h1>
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
        onSubmit={(formData) => addMutation.mutate(formData)}
        onCancel={() => navigate("/blogs")}
        loading={addMutation.isLoading}
        isEdit={false}
      />
    </div>
  );
};

export default BlogCreate;
