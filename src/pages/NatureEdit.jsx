import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NatureForm from "@/components/NatureForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { toast } from "react-hot-toast";

const NatureEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [plantOptions, setPlantOptions] = useState([]);
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

  // Fetch nature for editing
  useEffect(() => {
    setLoading(true);
    api
      .getNature(id)
      .then((res) => {
        const nature = res.data;
        setInitialValues({
          ...nature,
          applications: Array.isArray(nature.applications)
            ? nature.applications.join(", ")
            : nature.applications,
          keyFeatures: Array.isArray(nature.keyFeatures)
            ? nature.keyFeatures.join(", ")
            : nature.keyFeatures,
          relatedIndustries: Array.isArray(nature.relatedIndustries)
            ? nature.relatedIndustries.join(", ")
            : nature.relatedIndustries,
          seoKeywords: Array.isArray(nature.seoKeywords)
            ? nature.seoKeywords.join(", ")
            : nature.seoKeywords,
        });
        // Set selected plant from nature
        const plantId = nature.plantId?._id || nature.plantId || "";
        setSelectedPlantId(plantId);
        setLoading(false);
      })
      .catch((err) => {
        setFetchError(err.message || "Failed to fetch nature");
        setLoading(false);
      });
  }, [id]);

  const editMutation = useMutation({
    mutationFn: async (formData) => {
      return await api.updateNature(id, formData);
    },
    onSuccess: () => {
      toast.success("Nature updated successfully");
      queryClient.invalidateQueries(["natures"]);
      navigate("/natures");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update nature");
    },
  });

  // Handler for plant change from NatureForm
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
          <CardTitle className="text-2xl font-bold mb-2">Edit Nature</CardTitle>
        </CardHeader>
        <CardContent>
          <NatureForm
            initialValues={initialValues}
            onSubmit={(formData) => editMutation.mutate(formData)}
            onCancel={() => navigate(-1)}
            loading={editMutation.isLoading}
            isEdit
            plantOptions={plantOptions}
            selectedPlantId={selectedPlantId}
            onPlantChange={handlePlantChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NatureEdit;
