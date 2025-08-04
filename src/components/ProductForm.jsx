import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const initialFormState = {
  name: "",
  abbreviation: "",
  slug: "",
  natureId: "",
  plantId: "",
  description: "",
  shortDescription: "",
  images: [],
  brochure: null,
  brochureTitle: "",
  tds: null,
  tdsTitle: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  technicalSpecifications: [{ key: "", value: "" }],
  plantAvailability: [{ state: "" }],
  applications: "",
  status: "In Stock",
};

const arrToString = (val) => (Array.isArray(val) ? val.join(", ") : val || "");

const ProductForm = ({
  initialValues = {},
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
  natureOptions = [],
  plantOptions = [],
  onPlantChange,
  selectedPlantId,
}) => {
  const [values, setValues] = useState({
    ...initialFormState,
    ...initialValues,
    natureId: initialValues.natureId?._id || initialValues.natureId || "",
    plantId: initialValues.plantId?._id || initialValues.plantId || "",
    seoKeywords: arrToString(initialValues.seoKeywords),
    images: [],
    brochure: null,
    tds: null,
    brochureTitle:
      initialValues.brochure?.title || initialValues.brochureTitle || "",
    tdsTitle: initialValues.tds?.title || initialValues.tdsTitle || "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  // New: Unified images state for both existing and new images
  const [images, setImages] = useState(
    (initialValues.images || []).map((img) => ({ ...img, file: null }))
  );
  const [brochurePreview, setBrochurePreview] = useState(null);
  const [existingBrochure, setExistingBrochure] = useState(
    initialValues.brochure || null
  );
  const [tdsPreview, setTdsPreview] = useState(null);
  const [existingTds, setExistingTds] = useState(initialValues.tds || null);
  const [imageLimitError, setImageLimitError] = useState("");

  useEffect(() => {
    setImages(
      (initialValues.images || []).map((img) => ({ ...img, file: null }))
    );
    setBrochurePreview(null);
    setExistingBrochure(initialValues.brochure || null);
    setTdsPreview(null);
    setExistingTds(initialValues.tds || null);
  }, [initialValues?._id, isEdit]);

  // When selectedPlantId changes (from parent), update plantId in form state
  useEffect(() => {
    if (selectedPlantId && selectedPlantId !== values.plantId) {
      setValues((prev) => ({
        ...prev,
        plantId: selectedPlantId,
        natureId: "",
      }));
    }
  }, [selectedPlantId]);

  // Defensive filter: only show natures for the selected plant
  const filteredNatureOptions = selectedPlantId
    ? natureOptions.filter(
        (nature) => (nature.plantId?._id || nature.plantId) === selectedPlantId
      )
    : [];

  // Add new image slot (robust: never remove/overwrite old images)
  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageLimitError("");
    setImages((prev) => {
      if (prev.length >= 5) {
        setImageLimitError("Maximum 5 images allowed.");
        return prev;
      }
      // Only add if not exceeding 5
      return [
        ...prev,
        {
          url: URL.createObjectURL(file),
          alt: file.name,
          isPrimary: false,
          file,
        },
      ];
    });
    e.target.value = "";
  };

  // Remove image (only on explicit user action)
  const handleRemoveImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // Set primary image
  const handleSetPrimary = (idx) => {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, isPrimary: i === idx }))
    );
  };

  // Change image (only update that index, never clear array)
  const handleImageChange = (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    setImages((prev) =>
      prev.map((img, i) =>
        i === idx ? { ...img, file, url: URL.createObjectURL(file) } : img
      )
    );
  };

  // Handlers for technicalSpecifications
  const handleTechSpecChange = (idx, field, value) => {
    setValues((prev) => {
      const arr = [...(prev.technicalSpecifications || [])];
      arr[idx][field] = value;
      return { ...prev, technicalSpecifications: arr };
    });
  };
  const handleAddTechSpec = () => {
    setValues((prev) => ({
      ...prev,
      technicalSpecifications: [
        ...(prev.technicalSpecifications || []),
        { key: "", value: "" },
      ],
    }));
  };
  const handleRemoveTechSpec = (idx) => {
    setValues((prev) => {
      const arr = [...(prev.technicalSpecifications || [])];
      arr.splice(idx, 1);
      return { ...prev, technicalSpecifications: arr };
    });
  };

  // Handlers for plantAvailability
  const handlePlantAvailChange = (idx, value) => {
    setValues((prev) => {
      const arr = [...(prev.plantAvailability || [])];
      arr[idx].state = value;
      return { ...prev, plantAvailability: arr };
    });
  };
  const handleAddPlantAvail = () => {
    setValues((prev) => ({
      ...prev,
      plantAvailability: [...(prev.plantAvailability || []), { state: "" }],
    }));
  };
  const handleRemovePlantAvail = (idx) => {
    setValues((prev) => {
      const arr = [...(prev.plantAvailability || [])];
      arr.splice(idx, 1);
      return { ...prev, plantAvailability: arr };
    });
  };

  // Handler for applications (comma separated string)
  const handleApplicationsChange = (e) => {
    setValues((prev) => ({ ...prev, applications: e.target.value }));
  };

  // Handler for status
  const handleStatusChange = (e) => {
    setValues((prev) => ({ ...prev, status: e.target.value }));
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if (name === "images") {
        const filesArr = Array.from(files);
        setValues((prev) => ({ ...prev, images: filesArr }));
        // setImagePreviews(filesArr.map((file) => URL.createObjectURL(file))); // This line was removed as per new_code
        // setExistingImages([]); // If uploading new images, clear existing // This line was removed as per new_code
      } else if (name === "brochure") {
        const file = files[0];
        setValues((prev) => ({ ...prev, brochure: file }));
        setBrochurePreview(file ? file.name : null);
        setExistingBrochure(null); // If uploading new, clear existing
      } else if (name === "tds") {
        const file = files[0];
        setValues((prev) => ({ ...prev, tds: file }));
        setTdsPreview(file ? file.name : null);
        setExistingTds(null); // If uploading new, clear existing
      }
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
      // If plant changes, call onPlantChange and reset natureId
      if (name === "plantId") {
        if (onPlantChange) onPlantChange(value);
        setValues((prev) => ({ ...prev, natureId: "" }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Move validate function inside so it can access images state
  const validate = () => {
    const errors = {};
    if (!String(values.name).trim()) errors.name = "Name is required";
    if (!String(values.abbreviation).trim())
      errors.abbreviation = "Abbreviation is required";
    if (!String(values.natureId).trim()) errors.natureId = "Nature is required";
    if (!String(values.plantId).trim()) errors.plantId = "Plant is required";
    if (!String(values.description).trim())
      errors.description = "Description is required";
    if (!String(values.shortDescription).trim())
      errors.shortDescription = "Short Description is required";
    if (!isEdit && images.length === 0)
      errors.images = "At least one image is required";
    if (!isEdit && !values.brochure)
      errors.brochure = "Brochure file is required";
    if (!isEdit && !values.tds) errors.tds = "TDS file is required";
    if (!String(values.seoTitle).trim())
      errors.seoTitle = "SEO Title is required";
    if (!String(values.seoDescription).trim())
      errors.seoDescription = "SEO Description is required";
    if (!String(values.seoKeywords).trim())
      errors.seoKeywords = "At least one SEO keyword is required";
    // Validate technicalSpecifications
    if (
      !values.technicalSpecifications ||
      values.technicalSpecifications.length === 0 ||
      values.technicalSpecifications.some(
        (ts) => !ts.key.trim() || !ts.value.trim()
      )
    ) {
      errors.technicalSpecifications =
        "At least one technical specification (key and value) is required";
    }
    // Validate plantAvailability
    if (
      !values.plantAvailability ||
      values.plantAvailability.length === 0 ||
      values.plantAvailability.some((pa) => !pa.state.trim())
    ) {
      errors.plantAvailability =
        "At least one plant availability (state) is required";
    }
    // Validate applications
    if (!String(values.applications).trim()) {
      errors.applications = "At least one application is required";
    }
    // Validate status
    if (
      !values.status ||
      !["In Stock", "Limited Stock", "Out of Stock"].includes(values.status)
    ) {
      errors.status = "Status is required";
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched(
      Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
    if (Object.keys(validationErrors).length === 0) {
      // Prepare FormData for backend
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("abbreviation", values.abbreviation);
      if (values.slug) formData.append("slug", values.slug);
      formData.append("natureId", values.natureId);
      formData.append("plantId", values.plantId);
      formData.append("description", values.description);
      formData.append("shortDescription", values.shortDescription);
      // Images
      if (images && images.length > 0) {
        images.forEach((img, idx) => {
          if (img.file) {
            formData.append("images", img.file);
            formData.append(`images[${idx}].alt`, img.alt || img.file.name);
          } else {
            formData.append(`images[${idx}].url`, img.url);
            formData.append(`images[${idx}].alt`, img.alt || "");
          }
          formData.append(
            `images[${idx}].isPrimary`,
            img.isPrimary ? "true" : "false"
          );
        });
      }
      // Brochure
      if (values.brochure) formData.append("brochure", values.brochure);
      if (values.brochureTitle)
        formData.append("brochureTitle", values.brochureTitle);
      // TDS
      if (values.tds) formData.append("tds", values.tds);
      if (values.tdsTitle) formData.append("tdsTitle", values.tdsTitle);
      // SEO
      formData.append("seoTitle", values.seoTitle);
      formData.append("seoDescription", values.seoDescription);
      formData.append("seoKeywords", values.seoKeywords);
      // New fields
      formData.append(
        "technicalSpecifications",
        JSON.stringify(values.technicalSpecifications)
      );
      formData.append(
        "plantAvailability",
        JSON.stringify(values.plantAvailability)
      );
      formData.append("applications", values.applications);
      formData.append("status", values.status);
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label className="block font-medium mb-0.5">Technical Name *</label>
          <Input
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            placeholder="Product name"
            className="py-1"
          />
          {touched.name && errors.name && (
            <div className="text-red-600 text-xs mt-1">{errors.name}</div>
          )}
        </div>
        <div>
          <label className="block font-medium mb-0.5">Company Name *</label>
          <Input
            name="abbreviation"
            value={values.abbreviation}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            placeholder="e.g. BIOPLAST"
            className="py-1"
          />
          {touched.abbreviation && errors.abbreviation && (
            <div className="text-red-600 text-xs mt-1">
              {errors.abbreviation}
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label className="block font-medium mb-0.5">Plant *</label>
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
          </select>
          {touched.plantId && errors.plantId && (
            <div className="text-red-600 text-xs mt-1">{errors.plantId}</div>
          )}
        </div>
        <div>
          <label className="block font-medium mb-0.5">Nature *</label>
          <select
            name="natureId"
            value={values.natureId}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading || !selectedPlantId}
            className="w-full rounded-md border border-input px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
          >
            <option value="">Select Nature</option>
            {filteredNatureOptions.map((nature) => (
              <option key={nature._id} value={nature._id}>
                {nature.name}
              </option>
            ))}
          </select>
          {touched.natureId && errors.natureId && (
            <div className="text-red-600 text-xs mt-1">{errors.natureId}</div>
          )}
        </div>
      </div>
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
          rows={2}
          style={{ background: "transparent" }}
        />
        {touched.description && errors.description && (
          <div className="text-red-600 text-xs mt-1">{errors.description}</div>
        )}
      </div>
      <div>
        <label className="block font-medium mb-0.5">Short Description *</label>
        <textarea
          name="shortDescription"
          value={values.shortDescription}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          placeholder="Short Description"
          className="w-full rounded-md border border-input px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-transparent dark:bg-transparent"
          rows={1}
          style={{ background: "transparent" }}
        />
        {touched.shortDescription && errors.shortDescription && (
          <div className="text-red-600 text-xs mt-1">
            {errors.shortDescription}
          </div>
        )}
      </div>
      {/* Images upload */}
      <div>
        <label className="block font-medium mb-0.5">
          Images {isEdit ? "(at least one required, max 5)" : "* (max 5)"}
        </label>
        <div className="flex gap-2 flex-wrap mt-2">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center relative group"
            >
              <img
                src={img.file ? img.url : img.url}
                alt={img.alt || `Image ${idx + 1}`}
                className="h-16 w-24 rounded border object-contain"
                style={{ maxWidth: 120 }}
              />
              <span className="text-xs mt-1 font-semibold">
                {img.isPrimary ? "Primary" : ""}
              </span>
              <div className="flex gap-1 mt-1">
                <label className="text-xs cursor-pointer bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-700 transition">
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, idx)}
                    disabled={loading}
                  />
                </label>
                <button
                  type="button"
                  className="text-xs text-red-500 hover:text-red-700 px-1"
                  onClick={() => handleRemoveImage(idx)}
                  disabled={loading || images.length === 1}
                  title={
                    images.length === 1
                      ? "At least one image required"
                      : "Remove image"
                  }
                >
                  <X className="h-4 w-4" />
                </button>
                {!img.isPrimary && (
                  <button
                    type="button"
                    className="text-xs text-blue-500 hover:text-blue-700 px-1"
                    onClick={() => handleSetPrimary(idx)}
                    disabled={loading}
                    title="Set as Primary"
                  >
                    Set Primary
                  </button>
                )}
              </div>
            </div>
          ))}
          {/* Add new image */}
          <label
            className={`flex flex-col items-center justify-center h-16 w-24 border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800 transition ${
              images.length >= 5 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span className="text-xs text-slate-400">Add Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAddImage}
              disabled={loading || images.length >= 5}
            />
          </label>
        </div>
        {imageLimitError && (
          <div className="text-red-600 text-xs mt-1">{imageLimitError}</div>
        )}
        {touched.images && errors.images && (
          <div className="text-red-600 text-xs mt-1">{errors.images}</div>
        )}
      </div>
      {/* Brochure upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label className="block font-medium mb-0.5">
            Brochure {isEdit ? "(leave blank to keep current)" : "*"}
          </label>
          <Input
            name="brochure"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            className="py-1"
          />
          {/* Show existing brochure if editing and no new brochure selected */}
          {isEdit && existingBrochure && !brochurePreview && (
            <div className="text-xs mt-1">
              Current:{" "}
              <a
                href={existingBrochure.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                {existingBrochure.title || "Download Brochure"}
              </a>
            </div>
          )}
          {/* Show new brochure preview if selected */}
          {brochurePreview && (
            <div className="text-xs mt-1">Selected: {brochurePreview}</div>
          )}
          {touched.brochure && errors.brochure && (
            <div className="text-red-600 text-xs mt-1">{errors.brochure}</div>
          )}
        </div>
        <div>
          <label className="block font-medium mb-0.5">Brochure Title</label>
          <Input
            name="brochureTitle"
            value={values.brochureTitle}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            placeholder="e.g. Product Brochure"
            className="py-1"
          />
        </div>
      </div>
      {/* TDS upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label className="block font-medium mb-0.5">
            TDS {isEdit ? "(leave blank to keep current)" : "*"}
          </label>
          <Input
            name="tds"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            className="py-1"
          />
          {/* Show existing TDS if editing and no new TDS selected */}
          {isEdit && existingTds && !tdsPreview && (
            <div className="text-xs mt-1">
              Current:{" "}
              <a
                href={existingTds.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                {existingTds.title || "Download TDS"}
              </a>
            </div>
          )}
          {/* Show new TDS preview if selected */}
          {tdsPreview && (
            <div className="text-xs mt-1">Selected: {tdsPreview}</div>
          )}
          {touched.tds && errors.tds && (
            <div className="text-red-600 text-xs mt-1">{errors.tds}</div>
          )}
        </div>
        <div>
          <label className="block font-medium mb-0.5">TDS Title</label>
          <Input
            name="tdsTitle"
            value={values.tdsTitle}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            placeholder="e.g. Technical Data Sheet"
            className="py-1"
          />
        </div>
      </div>
      {/* SEO fields */}
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
        <label className="block font-medium mb-0.5">SEO Description *</label>
        <Input
          name="seoDescription"
          value={values.seoDescription}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          placeholder="SEO Description"
          className="py-1"
        />
        {touched.seoDescription && errors.seoDescription && (
          <div className="text-red-600 text-xs mt-1">
            {errors.seoDescription}
          </div>
        )}
      </div>
      {/* Technical Specifications */}
      <div>
        <label className="block font-medium mb-0.5">
          Technical Specifications *
        </label>
        {values.technicalSpecifications.map((ts, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <Input
              placeholder="Key"
              value={ts.key}
              onChange={(e) => handleTechSpecChange(idx, "key", e.target.value)}
              className="w-1/3"
              disabled={loading}
            />
            <Input
              placeholder="Value"
              value={ts.value}
              onChange={(e) =>
                handleTechSpecChange(idx, "value", e.target.value)
              }
              className="w-1/2"
              disabled={loading}
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => handleRemoveTechSpec(idx)}
              disabled={loading || values.technicalSpecifications.length === 1}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={handleAddTechSpec}
          disabled={loading}
          className="mt-1"
        >
          Add Specification
        </Button>
        {touched.technicalSpecifications && errors.technicalSpecifications && (
          <div className="text-red-600 text-xs mt-1">
            {errors.technicalSpecifications}
          </div>
        )}
      </div>
      {/* Plant Availability */}
      <div>
        <label className="block font-medium mb-0.5">Plant Availability *</label>
        {values.plantAvailability.map((pa, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <Input
              placeholder="State"
              value={pa.state}
              onChange={(e) => handlePlantAvailChange(idx, e.target.value)}
              className="w-2/3"
              disabled={loading}
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => handleRemovePlantAvail(idx)}
              disabled={loading || values.plantAvailability.length === 1}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={handleAddPlantAvail}
          disabled={loading}
          className="mt-1"
        >
          Add State
        </Button>
        {touched.plantAvailability && errors.plantAvailability && (
          <div className="text-red-600 text-xs mt-1">
            {errors.plantAvailability}
          </div>
        )}
      </div>
      {/* Applications */}
      <div>
        <label className="block font-medium mb-0.5">Applications *</label>
        <Input
          name="applications"
          value={values.applications}
          onChange={handleApplicationsChange}
          onBlur={handleBlur}
          disabled={loading}
          placeholder="Comma separated (e.g. packaging, agriculture)"
          className="py-1"
        />
        {touched.applications && errors.applications && (
          <div className="text-red-600 text-xs mt-1">{errors.applications}</div>
        )}
      </div>
      {/* Status */}
      <div>
        <label className="block font-medium mb-0.5">Status *</label>
        <select
          name="status"
          value={values.status}
          onChange={handleStatusChange}
          onBlur={handleBlur}
          disabled={loading}
          className="w-full rounded-md border border-input px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
        >
          <option value="In Stock">In Stock</option>
          <option value="Limited Stock">Limited Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
        {touched.status && errors.status && (
          <div className="text-red-600 text-xs mt-1">{errors.status}</div>
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
            : "Add Product"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
