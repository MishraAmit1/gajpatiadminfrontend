import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NatureForm from "@/components/NatureForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { toast } from "react-hot-toast";

const NatureCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [plantOptions, setPlantOptions] = useState([]);
  const [selectedPlantId, setSelectedPlantId] = useState("");

  // Fetch all plants on mount
  useEffect(() => {
    api
      .getPlants({ isActive: "true", limit: 1000 })
      .then((res) => {
        if (res && res.data && res.data.plants) {
          setPlantOptions(res.data.plants);
          // Optionally set a default plant if available
          if (res.data.plants.length > 0) {
            setSelectedPlantId(res.data.plants[0]._id);
          }
        }
      })
      .catch(() => setPlantOptions([]));
  }, []);

  const addMutation = useMutation({
    mutationFn: async (formData) => {
      return await api.createNature(formData);
    },
    onSuccess: () => {
      toast.success("Nature added successfully");
      queryClient.invalidateQueries(["natures"]);
      navigate("/natures");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to add nature");
    },
  });

  // Handler for plant change
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
          <CardTitle className="text-2xl font-bold mb-2">Add Nature</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Plant selection */}
          <div className="mb-4">
            <label className="block font-medium mb-0.5">Plant *</label>
            <select
              value={selectedPlantId}
              onChange={(e) => handlePlantChange(e.target.value)}
              className="w-full rounded-md border border-input px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            >
              <option value="">Select Plant</option>
              {plantOptions.map((plant) => (
                <option key={plant._id} value={plant._id}>
                  {plant.name}
                </option>
              ))}
            </select>
          </div>
          {/* Render NatureForm only if a plant is selected */}
          {selectedPlantId && (
            <NatureForm
              onSubmit={(formData) => addMutation.mutate(formData)}
              onCancel={() => navigate(-1)}
              loading={addMutation.isLoading}
              plantOptions={plantOptions}
              selectedPlantId={selectedPlantId}
              onPlantChange={handlePlantChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NatureCreate;
