import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialFormState = {
  name: "",
  plantId: "",
  description: "",
  technicalOverview: "",
  applications: "",
  keyFeatures: "",
  relatedIndustries: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  image: null,
};

const arrToString = (val) => (Array.isArray(val) ? val.join(", ") : val || "");

const validate = (values, isEdit) => {
  const errors = {};
  if (!String(values.name).trim()) errors.name = "Name is required";
  if (!String(values.plantId).trim()) errors.plantId = "Plant is required";
  if (!String(values.description).trim())
    errors.description = "Description is required";
  if (!String(values.technicalOverview).trim())
    errors.technicalOverview = "Technical overview is required";
  if (!String(values.applications).trim())
    errors.applications = "At least one application is required";
  if (!String(values.keyFeatures).trim())
    errors.keyFeatures = "At least one key feature is required";
  if (!String(values.relatedIndustries).trim())
    errors.relatedIndustries = "At least one related industry is required";
  if (!String(values.seoTitle).trim())
    errors.seoTitle = "SEO Title is required";
  if (!String(values.seoDescription).trim())
    errors.seoDescription = "SEO Description is required";
  if (!String(values.seoKeywords).trim())
    errors.seoKeywords = "At least one SEO keyword is required";
  if (!isEdit && !values.image) errors.image = "Image is required";
  return errors;
};

const NatureForm = ({
  initialValues = {},
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
  plantOptions = [],
  selectedPlantId,
  onPlantChange,
}) => {
  const [values, setValues] = useState({
    ...initialFormState,
    ...initialValues,
    plantId: initialValues.plantId?._id || initialValues.plantId || "",
    applications: arrToString(initialValues.applications),
    keyFeatures: arrToString(initialValues.keyFeatures),
    relatedIndustries: arrToString(initialValues.relatedIndustries),
    seoKeywords: arrToString(initialValues.seoKeywords),
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [imagePreview, setImagePreview] = useState(initialValues.image || null);

  useEffect(() => {
    setValues({
      ...initialFormState,
      ...initialValues,
      plantId: initialValues.plantId?._id || initialValues.plantId || "",
      applications: arrToString(initialValues.applications),
      keyFeatures: arrToString(initialValues.keyFeatures),
      relatedIndustries: arrToString(initialValues.relatedIndustries),
      seoKeywords: arrToString(initialValues.seoKeywords),
      image: null,
    });
    setImagePreview(initialValues.image || null);
  }, [initialValues?._id, isEdit]);

  // When selectedPlantId changes (from parent), update plantId in form state
  useEffect(() => {
    if (selectedPlantId && selectedPlantId !== values.plantId) {
      setValues((prev) => ({ ...prev, plantId: selectedPlantId }));
    }
  }, [selectedPlantId]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setValues((prev) => ({ ...prev, image: file }));
      setImagePreview(file ? URL.createObjectURL(file) : null);
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
      // If plant changes, call onPlantChange and reset form fields except plantId
      if (name === "plantId") {
        if (onPlantChange) onPlantChange(value);
        setValues((prev) => ({
          ...initialFormState,
          plantId: value,
        }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(values, isEdit);
    setErrors(validationErrors);
    setTouched(
      Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
    if (Object.keys(validationErrors).length === 0) {
      // Prepare FormData for backend
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("plantId", values.plantId);
      formData.append("description", values.description);
      formData.append("technicalOverview", values.technicalOverview);
      formData.append("applications", values.applications);
      formData.append("keyFeatures", values.keyFeatures);
      formData.append("relatedIndustries", values.relatedIndustries);
      formData.append("seoTitle", values.seoTitle);
      formData.append("seoDescription", values.seoDescription);
      formData.append("seoKeywords", values.seoKeywords);
      if (values.image) formData.append("image", values.image);
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          {/* <label className="block font-medium mb-0.5">Plant *</label>
          <select
            name="plantId"
            value={selectedPlantId || values.plantId}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            className="w-full rounded-md border border-input px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
          >
            <option value="">Select Plant</option>
            {plantOptions.map((plant) => (
              <option key={plant._id} value={plant._id}>
                {plant.name}
              </option>
            ))}
          </select> */}
          {touched.plantId && errors.plantId && (
            <div className="text-red-600 text-xs mt-1">{errors.plantId}</div>
          )}
        </div>
      </div>
      {/* Only show rest of form if plant is selected */}
      {selectedPlantId && (
        <>
          <div>
            <label className="block font-medium mb-0.5">Name *</label>
            <Input
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!selectedPlantId || loading}
              placeholder="Nature name"
              className="py-1"
            />
            {touched.name && errors.name && (
              <div className="text-red-600 text-xs mt-1">{errors.name}</div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-0.5">Description *</label>
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!selectedPlantId || loading}
              placeholder="Description"
              className="w-full rounded-md border border-input px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-transparent dark:bg-transparent"
              rows={1}
              style={{ background: "transparent" }}
            />
            {touched.description && errors.description && (
              <div className="text-red-600 text-xs mt-1">
                {errors.description}
              </div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-0.5">
              Technical Overview *
            </label>
            <textarea
              name="technicalOverview"
              value={values.technicalOverview}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!selectedPlantId || loading}
              placeholder="Technical Overview"
              className="w-full rounded-md border border-input px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-transparent dark:bg-transparent"
              rows={1}
              style={{ background: "transparent" }}
            />
            {touched.technicalOverview && errors.technicalOverview && (
              <div className="text-red-600 text-xs mt-1">
                {errors.technicalOverview}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block font-medium mb-0.5">Applications *</label>
              <Input
                name="applications"
                value={values.applications}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!selectedPlantId || loading}
                placeholder="Comma separated (e.g. Packaging, Agriculture)"
                className="py-1"
              />
              {touched.applications && errors.applications && (
                <div className="text-red-600 text-xs mt-1">
                  {errors.applications}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-0.5">Key Features *</label>
              <Input
                name="keyFeatures"
                value={values.keyFeatures}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!selectedPlantId || loading}
                placeholder="Comma separated (e.g. Eco-friendly, Durable)"
                className="py-1"
              />
              {touched.keyFeatures && errors.keyFeatures && (
                <div className="text-red-600 text-xs mt-1">
                  {errors.keyFeatures}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block font-medium mb-0.5">
                Related Industries *
              </label>
              <Input
                name="relatedIndustries"
                value={values.relatedIndustries}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!selectedPlantId || loading}
                placeholder="Comma separated (e.g. Packaging, Healthcare)"
                className="py-1"
              />
              {touched.relatedIndustries && errors.relatedIndustries && (
                <div className="text-red-600 text-xs mt-1">
                  {errors.relatedIndustries}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-0.5">SEO Title *</label>
              <Input
                name="seoTitle"
                value={values.seoTitle}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!selectedPlantId || loading}
                placeholder="SEO Title"
                className="py-1"
              />
              {touched.seoTitle && errors.seoTitle && (
                <div className="text-red-600 text-xs mt-1">
                  {errors.seoTitle}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block font-medium mb-0.5">
                SEO Description *
              </label>
              <Input
                name="seoDescription"
                value={values.seoDescription}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!selectedPlantId || loading}
                placeholder="SEO Description"
                className="py-1"
              />
              {touched.seoDescription && errors.seoDescription && (
                <div className="text-red-600 text-xs mt-1">
                  {errors.seoDescription}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-0.5">SEO Keywords *</label>
              <Input
                name="seoKeywords"
                value={values.seoKeywords}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!selectedPlantId || loading}
                placeholder="Comma separated (e.g. biodegradable, eco-friendly)"
                className="py-1"
              />
              {touched.seoKeywords && errors.seoKeywords && (
                <div className="text-red-600 text-xs mt-1">
                  {errors.seoKeywords}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block font-medium mb-0.5">
              Image {isEdit ? "(leave blank to keep current)" : "*"}
            </label>
            <Input
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!selectedPlantId || loading}
              className="py-1"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 h-24 rounded border object-contain"
                style={{ maxWidth: 160 }}
              />
            )}
            {touched.image && errors.image && (
              <div className="text-red-600 text-xs mt-1">{errors.image}</div>
            )}
          </div>
          <div className="flex gap-2 justify-end mt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? isEdit
                  ? "Saving..."
                  : "Adding..."
                : isEdit
                ? "Save Changes"
                : "Add Nature"}
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default NatureForm;
