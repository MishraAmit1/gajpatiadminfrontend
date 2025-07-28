import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select"; // Import only Select and SelectItem

const initialFormState = {
  title: "",
  excerpt: "",
  description: "",
  content: "",
  category: "",
  author: "",
  readTime: "",
  featured: false,
  tags: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  image: null,
};

const arrToString = (val) => (Array.isArray(val) ? val.join(", ") : val || "");

const generateSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

const validate = (values, isEdit) => {
  const errors = {};
  if (!String(values.title).trim()) errors.title = "Title is required";
  if (String(values.title).length < 3)
    errors.title = "Title must be at least 3 characters";
  if (String(values.title).length > 100)
    errors.title = "Title cannot exceed 100 characters";
  if (!String(values.excerpt).trim()) errors.excerpt = "Excerpt is required";
  if (String(values.excerpt).length < 10)
    errors.excerpt = "Excerpt must be at least 10 characters";
  if (String(values.excerpt).length > 300)
    errors.excerpt = "Excerpt cannot exceed 300 characters";
  if (!String(values.description).trim())
    errors.description = "Description is required";
  if (String(values.description).length < 10)
    errors.description = "Description must be at least 10 characters";
  if (String(values.description).length > 500)
    errors.description = "Description cannot exceed 500 characters";
  if (!String(values.content).trim()) errors.content = "Content is required";
  if (String(values.content).length < 50)
    errors.content = "Content must be at least 50 characters";
  if (!String(values.category).trim()) errors.category = "Category is required";
  if (!String(values.author).trim()) errors.author = "Author is required";
  if (String(values.author).length < 2)
    errors.author = "Author name must be at least 2 characters";
  if (String(values.author).length > 50)
    errors.author = "Author name cannot exceed 50 characters";
  if (!String(values.readTime).trim())
    errors.readTime = "Read time is required";
  if (!/^\d+\s+min\s+read$/.test(values.readTime))
    errors.readTime = "Read time must be in format 'X min read'";
  if (!String(values.tags).trim()) errors.tags = "At least one tag is required";
  if (!String(values.seoTitle).trim())
    errors.seoTitle = "SEO Title is required";
  if (String(values.seoTitle).length < 3)
    errors.seoTitle = "SEO Title must be at least 3 characters";
  if (String(values.seoTitle).length > 60)
    errors.seoTitle = "SEO Title cannot exceed 60 characters";
  if (!String(values.seoDescription).trim())
    errors.seoDescription = "SEO Description is required";
  if (String(values.seoDescription).length < 10)
    errors.seoDescription = "SEO Description must be at least 10 characters";
  if (String(values.seoDescription).length > 160)
    errors.seoDescription = "SEO Description cannot exceed 160 characters";
  if (!String(values.seoKeywords).trim())
    errors.seoKeywords = "At least one SEO keyword is required";
  if (!isEdit && !values.image) errors.image = "Image is required";
  return errors;
};

const BlogForm = ({
  initialValues = {},
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
}) => {
  const [values, setValues] = useState({
    ...initialFormState,
    ...initialValues,
    seoKeywords: arrToString(initialValues.seoKeywords),
    tags: arrToString(initialValues.tags),
    featured: initialValues.featured || false,
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [imagePreview, setImagePreview] = useState(initialValues.image || null);

  useEffect(() => {
    setValues({
      ...initialFormState,
      ...initialValues,
      seoKeywords: arrToString(initialValues.seoKeywords),
      tags: arrToString(initialValues.tags),
      featured: initialValues.featured || false,
      image: null,
    });
    setImagePreview(initialValues.image || null);
  }, [initialValues?._id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setValues((prev) => ({ ...prev, image: file }));
      setImagePreview(file ? URL.createObjectURL(file) : null);
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e) => {
    setValues((prev) => ({ ...prev, featured: e.target.checked }));
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
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("excerpt", values.excerpt);
      formData.append("description", values.description);
      formData.append("content", values.content);
      formData.append("category", values.category);
      formData.append("author", values.author);
      formData.append("readTime", values.readTime);
      formData.append("featured", values.featured);
      formData.append("tags", values.tags);
      formData.append("seoTitle", values.seoTitle);
      formData.append("seoDescription", values.seoDescription);
      formData.append("seoKeywords", values.seoKeywords);
      formData.append("slug", generateSlug(values.title));
      if (values.image) formData.append("image", values.image);
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <label className="block font-medium mb-0.5">Title *</label>
        <Input
          name="title"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          placeholder="Blog title"
          className="py-1"
        />
        {touched.title && errors.title && (
          <div className="text-red-600 text-xs mt-1">{errors.title}</div>
        )}
      </div>
      <div>
        <label className="block font-medium mb-0.5">Excerpt *</label>
        <textarea
          name="excerpt"
          value={values.excerpt}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          placeholder="Short excerpt of the blog"
          className="w-full rounded-md border border-input px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-transparent dark:bg-transparent"
          rows={3}
          style={{ background: "transparent" }}
        />
        {touched.excerpt && errors.excerpt && (
          <div className="text-red-600 text-xs mt-1">{errors.excerpt}</div>
        )}
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
          rows={3}
          style={{ background: "transparent" }}
        />
        {touched.description && errors.description && (
          <div className="text-red-600 text-xs mt-1">{errors.description}</div>
        )}
      </div>
      <div>
        <label className="block font-medium mb-0.5">Content *</label>
        <textarea
          name="content"
          value={values.content}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          placeholder="Blog content"
          className="w-full rounded-md border border-input px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-transparent dark:bg-transparent"
          rows={6}
          style={{ background: "transparent" }}
        />
        {touched.content && errors.content && (
          <div className="text-red-600 text-xs mt-1">{errors.content}</div>
        )}
      </div>
      <div>
        <label className="block font-medium mb-0.5">Category *</label>
        <Select
          name="category"
          value={values.category}
          onValueChange={(value) =>
            setValues((prev) => ({ ...prev, category: value }))
          }
          disabled={loading}
        >
          <option value="" disabled>
            Select category
          </option>
          {[
            "Technical Guide",
            "Application",
            "Product Innovation",
            "Sustainability",
            "Quality Assurance",
            "Case Study",
          ].map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </Select>
        {touched.category && errors.category && (
          <div className="text-red-600 text-xs mt-1">{errors.category}</div>
        )}
      </div>
      <div>
        <label className="block font-medium mb-0.5">Author *</label>
        <Input
          name="author"
          value={values.author}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          placeholder="Author name"
          className="py-1"
        />
        {touched.author && errors.author && (
          <div className="text-red-600 text-xs mt-1">{errors.author}</div>
        )}
      </div>
      <div>
        <label className="block font-medium mb-0.5">Read Time *</label>
        <Input
          name="readTime"
          value={values.readTime}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          placeholder="e.g. 5 min read"
          className="py-1"
        />
        {touched.readTime && errors.readTime && (
          <div className="text-red-600 text-xs mt-1">{errors.readTime}</div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="featured"
          checked={values.featured}
          onChange={handleCheckboxChange}
          disabled={loading}
          className="h-4 w-4"
        />
        <label htmlFor="featured" className="font-medium">
          Featured
        </label>
      </div>
      <div>
        <label className="block font-medium mb-0.5">Tags *</label>
        <Input
          name="tags"
          value={values.tags}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          placeholder="Comma separated (e.g. tech, eco-friendly)"
          className="py-1"
        />
        {touched.tags && errors.tags && (
          <div className="text-red-600 text-xs mt-1">{errors.tags}</div>
        )}
      </div>
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
      <div>
        <label className="block font-medium mb-0.5">SEO Keywords *</label>
        <Input
          name="seoKeywords"
          value={values.seoKeywords}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          placeholder="Comma separated (e.g. blog, eco-friendly)"
          className="py-1"
        />
        {touched.seoKeywords && errors.seoKeywords && (
          <div className="text-red-600 text-xs mt-1">{errors.seoKeywords}</div>
        )}
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
          disabled={loading}
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
            : "Add Blog"}
        </Button>
      </div>
    </form>
  );
};

export default BlogForm;
