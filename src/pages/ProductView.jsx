import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  FileText,
  FileDown,
  BadgeCheck,
  Leaf,
  Package,
  BookOpen,
  Star,
  Sparkles,
  Eye,
  Download,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { Button } from "@/components/ui/button";

const infoChipStyles = {
  slug: {
    iconBg:
      "bg-gradient-to-r from-fuchsia-500 to-pink-500 dark:from-fuchsia-700 dark:to-pink-700",
    icon: BadgeCheck,
    label: "Slug",
  },
  plant: {
    iconBg:
      "bg-gradient-to-r from-emerald-500 to-green-500 dark:from-emerald-700 dark:to-green-700",
    icon: Leaf,
    label: "Plant",
  },
  nature: {
    iconBg:
      "bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-700 dark:to-red-700",
    icon: BookOpen,
    label: "Nature",
  },
};

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(true);

  useEffect(() => {
    api
      .getProduct(id)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch product");
      });
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50/30 dark:from-red-950 dark:via-zinc-900 dark:to-red-950 flex items-center justify-center">
        <div className="text-center p-12 rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-2xl border border-red-100 dark:border-red-900">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-red-600 dark:text-red-200">{error}</p>
        </div>
      </div>
    );
  }
  if (!product) return null;

  // Find primary image
  const primaryImage =
    product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const allImages = product.images || [];
  const currentImage = allImages[selectedImage] || primaryImage;

  // Helper for status badge
  const statusBadge = (status) => {
    let color = "bg-gray-200 text-gray-800";
    if (status === "In Stock") color = "bg-green-100 text-green-700";
    else if (status === "Limited Stock")
      color = "bg-yellow-100 text-yellow-700";
    else if (status === "Out of Stock") color = "bg-red-100 text-red-700";
    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${color}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020817]">
      <div className="relative z-10 max-w-7xl mx-auto py-8 px-4 lg:px-8">
        {/* Back Button with Glassmorphism */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group relative overflow-hidden bg-white dark:bg-[#020817] backdrop-blur-md border border-slate-200 dark:border-[#232a36] hover:bg-slate-100 dark:hover:bg-[#232a36] text-slate-700 dark:text-slate-200 hover:text-blue-900 dark:hover:text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 rounded-2xl px-6 py-3 flex items-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30 dark:from-blue-600/10 dark:to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <ArrowLeft className="mr-2 h-5 w-5 transform group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="relative font-medium">Back to Products</span>
          </button>
        </div>

        {/* Hero Header with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#020817] backdrop-blur-xl border border-slate-200 dark:border-[#232a36] shadow-2xl mb-12 group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-100/30 to-emerald-100/30 dark:from-blue-600/10 dark:via-purple-600/10 dark:to-emerald-600/10 opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/40 to-transparent dark:via-white/5 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

          <div className="relative p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <Package className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight">
                    {product.name}
                  </h1>
                  <div className="relative">
                    {product.isActive ? (
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-400 to-green-400 dark:from-emerald-700 dark:to-green-700 text-white rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-semibold text-sm">Active</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-200 to-green-200 dark:from-emerald-800 dark:to-green-800 rounded-full blur-md opacity-40 -z-10"></div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-400 to-pink-400 dark:from-red-700 dark:to-pink-700 text-white rounded-full shadow-lg">
                        <XCircle className="h-4 w-4" />
                        <span className="font-semibold text-sm">Inactive</span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Info Chips Row */}
                <div className="flex flex-wrap gap-6">
                  {/* Slug Chip */}
                  <div className="flex min-w-0 items-center gap-3 px-5 py-3 rounded-2xl shadow bg-white dark:bg-[#020817] border border-slate-200 dark:border-[#232a36]">
                    <span
                      className={`flex items-center justify-center h-10 w-10 rounded-xl ${infoChipStyles.slug.iconBg}`.replace(
                        "bg-gradient-to-r from-fuchsia-500 to-pink-500",
                        "bg-gradient-to-r from-fuchsia-300 to-pink-300"
                      )}
                    >
                      <BadgeCheck className="h-5 w-5 text-white" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase mb-0.5">
                        {infoChipStyles.slug.label}
                      </div>
                      <div className="font-bold text-lg text-slate-900 dark:text-slate-100 break-words whitespace-normal">
                        {product.slug}
                      </div>
                    </div>
                  </div>
                  {/* Plant Chip */}
                  <div className="flex min-w-0 items-center gap-3 px-5 py-3 rounded-2xl shadow bg-white dark:bg-[#020817] border border-slate-200 dark:border-[#232a36]">
                    <span
                      className={`flex items-center justify-center h-10 w-10 rounded-xl ${infoChipStyles.plant.iconBg}`.replace(
                        "bg-gradient-to-r from-emerald-500 to-green-500",
                        "bg-gradient-to-r from-emerald-300 to-green-300"
                      )}
                    >
                      <Leaf className="h-5 w-5 text-white" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase mb-0.5">
                        {infoChipStyles.plant.label}
                      </div>
                      <div className="font-bold text-lg text-slate-900 dark:text-slate-100 break-words whitespace-normal">
                        {product.plantId?.name || "-"}
                      </div>
                    </div>
                  </div>
                  {/* Nature Chip */}
                  <div className="flex min-w-0 items-center gap-3 px-5 py-3 rounded-2xl shadow bg-white dark:bg-[#020817] border border-slate-200 dark:border-[#232a36]">
                    <span
                      className={`flex items-center justify-center h-10 w-10 rounded-xl ${infoChipStyles.nature.iconBg}`.replace(
                        "bg-gradient-to-r from-orange-500 to-red-500",
                        "bg-gradient-to-r from-orange-300 to-red-300"
                      )}
                    >
                      <BookOpen className="h-5 w-5 text-white" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase mb-0.5">
                        {infoChipStyles.nature.label}
                      </div>
                      <div className="font-bold text-lg text-slate-900 dark:text-slate-100 break-words whitespace-normal">
                        {product.natureId?.name || "-"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Enhanced Image Gallery */}
            <div className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-white dark:bg-[#020817] backdrop-blur-xl rounded-3xl p-2 shadow-2xl border border-slate-200 dark:border-[#232a36]">
                  {currentImage ? (
                    <div
                      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-[#020817]
                     dark:to-[#232a36]"
                    >
                      <img
                        src={currentImage.url}
                        alt={currentImage.alt}
                        className={`w-full h-96 object-contain transition-all duration-700 ${
                          imageLoaded
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-95"
                        }`}
                        onLoad={() => setImageLoaded(true)}
                      />
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-900 dark:to-purple-900 text-white rounded-full text-xs font-semibold shadow-lg">
                          <Star className="h-3 w-3" />
                          {currentImage === primaryImage
                            ? "Primary"
                            : `Image ${selectedImage + 1}`}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-96 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 dark:from-[#020817] dark:to-[#232a36] rounded-2xl text-slate-500">
                      <Eye className="h-16 w-16 mb-4 opacity-50" />
                      <p className="font-medium">No image available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Image Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 px-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedImage(idx);
                        setImageLoaded(false);
                      }}
                      className={`flex-shrink-0 relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                        selectedImage === idx
                          ? "ring-4 ring-blue-400 shadow-xl"
                          : "hover:shadow-lg opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="h-20 w-24 object-contain bg-white dark:bg-zinc-900/80 backdrop-blur-sm border border-slate-200 dark:border-zinc-800"
                      />
                      {selectedImage === idx && (
                        <div
                          className="absolute inset-0 bg-gradient-to-br
                         from-blue-100/30 to-purple-100/30 dark:from-blue-900/20 dark:to-purple-900/20"
                        ></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Info Section */}
            <div className="space-y-8">
              <div className="relative overflow-hidden bg-white dark:bg-[#020817] backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-[#232a36]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-purple-100/30 dark:from-blue-600/10 dark:to-purple-600/10 rounded-full blur-2xl"></div>

                <div className="relative space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-900 dark:to-purple-900 rounded-xl text-white shadow-lg">
                        <FileText className="h-5 w-5" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        Product Overview
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wide mb-2">
                          Short Description
                        </p>
                        <p className="text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-200 dark:text-slate-200 dark:bg-[#020817] dark:border-[#232a36] break-words whitespace-normal">
                          {product.shortDescription}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wide mb-2">
                          Detailed Description
                        </p>
                        <p className="text-slate-700 leading-relaxed whitespace-normal bg-slate-50 rounded-xl p-4 border border-slate-200 dark:text-slate-200 dark:bg-[#020817] dark:border-[#232a36] break-words">
                          {product.description}
                        </p>
                      </div>
                      {/* Technical Specifications */}
                      {product.technicalSpecifications &&
                        product.technicalSpecifications.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wide mb-2 mt-4">
                              Technical Specifications
                            </p>
                            <table className="w-full text-sm border rounded-xl overflow-hidden">
                              <thead>
                                <tr className="bg-slate-100 dark:bg-zinc-900">
                                  <th className="px-3 py-2 text-left font-semibold">
                                    Key
                                  </th>
                                  <th className="px-3 py-2 text-left font-semibold">
                                    Value
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {product.technicalSpecifications.map(
                                  (ts, idx) => (
                                    <tr
                                      key={idx}
                                      className="border-b last:border-0"
                                    >
                                      <td className="px-3 py-2 font-medium">
                                        {ts.key}
                                      </td>
                                      <td className="px-3 py-2">{ts.value}</td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                      {/* Plant Availability */}
                      {product.plantAvailability &&
                        product.plantAvailability.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wide mb-2">
                              Plant Availability
                            </p>
                            <ul className="flex flex-wrap gap-2">
                              {product.plantAvailability.map((pa, idx) => (
                                <li
                                  key={idx}
                                  className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-800"
                                >
                                  {pa.state}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      {/* Applications */}
                      {product.applications &&
                        product.applications.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wide mb-2">
                              Applications
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {(Array.isArray(product.applications)
                                ? product.applications
                                : product.applications.split(",")
                              ).map((app, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200 rounded-full text-xs font-medium border border-purple-200 dark:border-purple-800"
                                >
                                  {app.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      {/* Status */}
                      <div className="mt-4">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wide mb-2">
                          Status
                        </p>
                        {statusBadge(product.status)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gradient-to-r from-emerald-400 to-green-400 dark:from-emerald-800 dark:to-green-800 rounded-xl text-white shadow-lg">
                        <Download className="h-5 w-5" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        Downloads
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button
                        asChild
                        className="group relative overflow-hidden bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 dark:from-blue-900 dark:to-blue-950 dark:hover:from-blue-800 dark:hover:to-blue-900 text-white rounded-2xl p-6 h-auto shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!product.brochure?.url}
                      >
                        <a
                          href={product.brochure?.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-3"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <FileDown className="h-8 w-8 transform group-hover:scale-110 transition-transform duration-300" />
                          <div className="text-center">
                            <p className="font-bold text-sm">Brochure</p>
                            <p className="text-xs opacity-90">
                              {product.brochure?.title || "Product Information"}
                            </p>
                          </div>
                        </a>
                      </Button>

                      <Button
                        asChild
                        className="group relative overflow-hidden bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 dark:from-purple-900 dark:to-purple-950 dark:hover:from-purple-800 dark:hover:to-purple-900 text-white rounded-2xl p-6 h-auto shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!product.tds?.url}
                      >
                        <a
                          href={product.tds?.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-3"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <FileDown className="h-8 w-8 transform group-hover:scale-110 transition-transform duration-300" />
                          <div className="text-center">
                            <p className="font-bold text-sm">TDS</p>
                            <p className="text-xs opacity-90">
                              {product.tds?.title || "Technical Data Sheet"}
                            </p>
                          </div>
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced SEO Section */}
          <div className="relative overflow-hidden bg-white dark:bg-[#020817] backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-[#232a36]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 via-blue-100/30 to-purple-100/30 dark:from-emerald-600/10 dark:via-blue-600/10 dark:to-purple-600/10"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 dark:from-emerald-600 dark:via-blue-600 dark:to-purple-600"></div>

            <div className="relative p-8 lg:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-r from-emerald-400 to-blue-400 dark:from-emerald-900 dark:to-blue-900 rounded-2xl text-white shadow-lg">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                  SEO & Marketing Details
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-slate-50 dark:bg-[#020817] backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-[#232a36] hover:shadow-lg transition-all duration-300">
                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-2">
                      SEO Title
                    </p>
                    <p className="text-slate-900 dark:text-slate-100 font-medium break-words whitespace-normal">
                      {product.seoTitle}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-[#020817] backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-[#232a36] hover:shadow-lg transition-all duration-300">
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">
                      SEO Description
                    </p>
                    <p className="text-blue-900 dark:text-blue-200 leading-relaxed break-words whitespace-normal">
                      {product.seoDescription}
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-[#020817] backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-[#232a36] hover:shadow-lg transition-all duration-300">
                  <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-4">
                    SEO Keywords
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(product.seoKeywords)
                      ? product.seoKeywords
                      : product.seoKeywords?.split(",") || []
                    ).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-200 rounded-full text-sm font-medium border border-purple-200 dark:border-purple-800 hover:shadow-md transition-shadow duration-300 break-words whitespace-normal"
                      >
                        {keyword.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
