import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductForm from "@/components/ProductForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { toast } from "react-hot-toast";

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [plantOptions, setPlantOptions] = useState([]);
  const [natureOptions, setNatureOptions] = useState([]);
  const [selectedPlantId, setSelectedPlantId] = useState("");

  // Fetch all plants on mount
  useEffect(() => {
    api
      .getPlants({ isActive: "true", limit: 1000 })
      .then((res) => {
        if (res && res.data && res.data.plants)
          setPlantOptions(res.data.plants);
      })
      .catch(() => setPlantOptions([]));
  }, []);

  // Fetch product for editing
  useEffect(() => {
    setLoading(true);
    api
      .getProduct(id)
      .then((res) => {
        setInitialValues(res.data);
        // Set selected plant from product
        const plantId = res.data.plantId?._id || res.data.plantId || "";
        setSelectedPlantId(plantId);
        setLoading(false);
      })
      .catch((err) => {
        setFetchError(err.message || "Failed to fetch product");
        setLoading(false);
      });
  }, [id]);

  // Fetch natures for selected plant
  useEffect(() => {
    if (selectedPlantId) {
      api
        .getNatures({ isActive: "true", plantId: selectedPlantId, limit: 1000 })
        .then((res) => {
          if (res && res.data && res.data.natures)
            setNatureOptions(res.data.natures);
        })
        .catch(() => setNatureOptions([]));
    } else {
      setNatureOptions([]);
    }
  }, [selectedPlantId]);

  const editMutation = useMutation({
    mutationFn: async (formData) => {
      return await api.updateProduct(id, formData);
    },
    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries(["products"]);
      navigate("/products");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update product");
    },
  });

  // Handler for plant change from ProductForm
  const handlePlantChange = (plantId) => {
    setSelectedPlantId(plantId);
  };

  if (loading) {
    return <div className="text-center py-16">Loading...</div>;
  }
  if (fetchError) {
    return <div className="text-center text-red-600 py-16">{fetchError}</div>;
  }
  if (!initialValues) return null;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-2">
            Edit Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            initialValues={initialValues}
            onSubmit={(formData) => editMutation.mutate(formData)}
            onCancel={() => navigate(-1)}
            loading={editMutation.isLoading}
            isEdit
            natureOptions={natureOptions}
            plantOptions={plantOptions}
            onPlantChange={handlePlantChange}
            selectedPlantId={selectedPlantId}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductEdit;
