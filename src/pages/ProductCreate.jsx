import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "@/components/ProductForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { toast } from "react-hot-toast";

const ProductCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

  const addMutation = useMutation({
    mutationFn: async (formData) => {
      return await api.createProduct(formData);
    },
    onSuccess: () => {
      toast.success("Product added successfully");
      queryClient.invalidateQueries(["products"]);
      navigate("/products");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to add product");
    },
  });

  // Handler for plant change from ProductForm
  const handlePlantChange = (plantId) => {
    setSelectedPlantId(plantId);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-2">Add Product</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            onSubmit={(formData) => addMutation.mutate(formData)}
            onCancel={() => navigate(-1)}
            loading={addMutation.isLoading}
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

export default ProductCreate;
