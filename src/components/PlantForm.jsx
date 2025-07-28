import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialFormState = {
  name: "",
  description: "",
  capacity: "",
  location: "",
  established: "",
  machinery: "",
  certifications: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
};

// Helper to ensure string for input fields
const arrToString = (val) => (Array.isArray(val) ? val.join(", ") : val || "");

const validate = (values) => {
  const errors = {};
  // Always treat as string for validation
  if (!String(values.name).trim()) errors.name = "Name is required";
  if (!String(values.description).trim())
    errors.description = "Description is required";
  if (!String(values.capacity).trim()) errors.capacity = "Capacity is required";
  if (!String(values.location).trim()) errors.location = "Location is required";
  if (!String(values.established))
    errors.established = "Established date is required";
  if (!String(values.machinery).trim())
    errors.machinery = "At least one machinery is required";
  if (!String(values.certifications).trim())
    errors.certifications = "At least one certification is required";
  if (!String(values.seoTitle).trim())
    errors.seoTitle = "SEO Title is required";
  if (!String(values.seoDescription).trim())
    errors.seoDescription = "SEO Description is required";
  if (!String(values.seoKeywords).trim())
    errors.seoKeywords = "At least one SEO keyword is required";
  return errors;
};

const PlantForm = ({
  initialValues = {},
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
}) => {
  // Always convert array fields to string for input
  const [values, setValues] = useState({
    ...initialFormState,
    ...initialValues,
    machinery: arrToString(initialValues.machinery),
    certifications: arrToString(initialValues.certifications),
    seoKeywords: arrToString(initialValues.seoKeywords),
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // If initialValues change (e.g. when opening edit), update state
  useEffect(() => {
    setValues({
      ...initialFormState,
      ...initialValues,
      machinery: arrToString(initialValues.machinery),
      certifications: arrToString(initialValues.certifications),
      seoKeywords: arrToString(initialValues.seoKeywords),
    });
  }, [initialValues?._id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouched(
      Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
    if (Object.keys(validationErrors).length === 0) {
      // Prepare data for backend (arrays as comma-separated strings)
      const payload = {
        ...values,
        machinery: String(values.machinery)
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean),
        certifications: String(values.certifications)
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        seoKeywords: String(values.seoKeywords)
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
      };
      onSubmit(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {/* Row 1: name, capacity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label className="block font-medium mb-0.5">Name *</label>
          <Input
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            placeholder="Plant name"
            className="py-1"
          />
          {touched.name && errors.name && (
            <div className="text-red-600 text-xs mt-1">{errors.name}</div>
          )}
        </div>
        <div>
          <label className="block font-medium mb-0.5">Capacity *</label>
          <Input
            name="capacity"
            value={values.capacity}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            placeholder="e.g. 1000 tons/year"
            className="py-1"
          />
          {touched.capacity && errors.capacity && (
            <div className="text-red-600 text-xs mt-1">{errors.capacity}</div>
          )}
        </div>
      </div>
      {/* Row 2: location, established */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label className="block font-medium mb-0.5">Location *</label>
          <Input
            name="location"
            value={values.location}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            placeholder="e.g. Vapi, Gujarat"
            className="py-1"
          />
          {touched.location && errors.location && (
            <div className="text-red-600 text-xs mt-1">{errors.location}</div>
          )}
        </div>
        <div>
          <label className="block font-medium mb-0.5">Established *</label>
          <Input
            name="established"
            type="date"
            value={values.established}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            className="py-1"
          />
          {touched.established && errors.established && (
            <div className="text-red-600 text-xs mt-1">
              {errors.established}
            </div>
          )}
        </div>
      </div>
      {/* Row 3: description (full width, compact) */}
      <div>
        <label className="block font-medium mb-0.5">Description *</label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          placeholder="Description"
          className="w-full rounded-md border border-input px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-transparent dark:bg-transparent"
          rows={1}
          style={{ background: "transparent" }}
        />
        {touched.description && errors.description && (
          <div className="text-red-600 text-xs mt-1">{errors.description}</div>
        )}
      </div>
      <hr className="my-1 border-muted" />
      {/* Row 4: machinery, certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label className="block font-medium mb-0.5">Machinery *</label>
          <Input
            name="machinery"
            value={values.machinery}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            placeholder="Comma separated (e.g. Solar Panels, Inverters)"
            className="py-1"
          />
          {touched.machinery && errors.machinery && (
            <div className="text-red-600 text-xs mt-1">{errors.machinery}</div>
          )}
        </div>
        <div>
          <label className="block font-medium mb-0.5">Certifications *</label>
          <Input
            name="certifications"
            value={values.certifications}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            placeholder="Comma separated (e.g. ISO 9001, Green Energy)"
            className="py-1"
          />
          {touched.certifications && errors.certifications && (
            <div className="text-red-600 text-xs mt-1">
              {errors.certifications}
            </div>
          )}
        </div>
      </div>
      <hr className="my-1 border-muted" />
      {/* Row 5: seoTitle, seoKeywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label className="block font-medium mb-0.5">SEO Title *</label>
          <Input
            name="seoTitle"
            value={values.seoTitle}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            placeholder="SEO Title"
            className="py-1"
          />
          {touched.seoTitle && errors.seoTitle && (
            <div className="text-red-600 text-xs mt-1">{errors.seoTitle}</div>
          )}
        </div>
        <div>
          <label className="block font-medium mb-0.5">SEO Keywords *</label>
          <Input
            name="seoKeywords"
            value={values.seoKeywords}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            placeholder="Comma separated (e.g. solar, energy, green)"
            className="py-1"
          />
          {touched.seoKeywords && errors.seoKeywords && (
            <div className="text-red-600 text-xs mt-1">
              {errors.seoKeywords}
            </div>
          )}
        </div>
      </div>
      {/* Row 6: seoDescription (full width, compact) */}
      <div>
        <label className="block font-medium mb-0.5">SEO Description *</label>
        <textarea
          name="seoDescription"
          value={values.seoDescription}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          placeholder="SEO Description"
          className="w-full rounded-md border border-input px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-transparent dark:bg-transparent"
          rows={1}
          style={{ background: "transparent" }}
        />
        {touched.seoDescription && errors.seoDescription && (
          <div className="text-red-600 text-xs mt-1">
            {errors.seoDescription}
          </div>
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
            : "Add Plant"}
        </Button>
      </div>
    </form>
  );
};

export default PlantForm;
