import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import {
  ArrowLeft,
  Leaf,
  BadgeCheck,
  CheckCircle,
  XCircle,
  BookOpen,
  Sparkles,
} from "lucide-react";

const NatureView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nature, setNature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .getNature(id)
      .then((res) => {
        setNature(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch nature");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-xl p-8 rounded-3xl bg-white/80 dark:bg-zinc-900/80 shadow-2xl border border-slate-100 dark:border-zinc-900 animate-pulse">
          <div className="h-8 w-1/2 mb-6 bg-slate-200 dark:bg-zinc-800 rounded"></div>
          <div className="h-64 w-full mb-6 bg-slate-100 dark:bg-zinc-900 rounded-2xl"></div>
          <div className="h-6 w-1/3 mb-2 bg-slate-100 dark:bg-zinc-800 rounded"></div>
          <div className="h-6 w-1/3 mb-2 bg-slate-100 dark:bg-zinc-800 rounded"></div>
          <div className="h-6 w-1/3 mb-2 bg-slate-100 dark:bg-zinc-800 rounded"></div>
        </div>
      </div>
    );
  }
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
  if (!nature) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#020817]">
      <div className="relative z-10 max-w-7xl mx-auto py-8 px-4 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group relative overflow-hidden bg-white dark:bg-[#020817] backdrop-blur-md border border-slate-200 dark:border-[#232a36] hover:bg-slate-100 dark:hover:bg-[#232a36] text-slate-700 dark:text-slate-200 hover:text-blue-900 dark:hover:text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 rounded-2xl px-6 py-3 flex items-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30 dark:from-blue-600/10 dark:to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <ArrowLeft className="mr-2 h-5 w-5 transform group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="relative font-medium">Back to Natures</span>
          </button>
        </div>

        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#020817] backdrop-blur-xl border border-slate-200 dark:border-[#232a36] shadow-2xl mb-12 group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-100/30 to-emerald-100/30 dark:from-blue-600/10 dark:via-purple-600/10 dark:to-emerald-600/10 opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/40 to-transparent dark:via-white/5 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

          <div className="relative p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <BookOpen className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight">
                    {nature.name}
                  </h1>
                  <div className="relative">
                    {nature.isActive ? (
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
                  {/* Plant Chip */}
                  <div className="flex min-w-0 items-center gap-3 px-5 py-3 rounded-2xl shadow bg-white dark:bg-[#020817] border border-slate-200 dark:border-[#232a36]">
                    <span className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 dark:from-emerald-700 dark:to-green-700">
                      <Leaf className="h-5 w-5 text-white" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase mb-0.5">
                        Plant
                      </div>
                      <div className="font-bold text-lg text-slate-900 dark:text-slate-100 break-words ">
                        {nature.plantId?.name || "-"}
                      </div>
                    </div>
                  </div>
                  {/* Status Chip */}
                  <div className="flex min-w-0 items-center gap-3 px-5 py-3 rounded-2xl shadow bg-white dark:bg-[#020817] border border-slate-200 dark:border-[#232a36]">
                    <span className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-700 dark:to-purple-700">
                      <BadgeCheck className="h-5 w-5 text-white" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase mb-0.5">
                        Status
                      </div>
                      <div className="font-bold text-lg text-slate-900 dark:text-slate-100 break-words ">
                        {nature.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Image Card */}
            <div className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-white dark:bg-[#020817] backdrop-blur-xl rounded-3xl p-2 shadow-2xl border border-slate-200 dark:border-[#232a36] flex items-center justify-center min-h-[300px]">
                  {nature.image ? (
                    <img
                      src={nature.image}
                      alt={nature.name}
                      className="w-full h-64 object-contain rounded-2xl"
                    />
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 dark:from-[#020817] dark:to-[#232a36] rounded-2xl text-slate-500">
                      <BookOpen className="h-16 w-16 mb-4 opacity-50" />
                      <p className="font-medium">No image available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-8">
              <div className="relative overflow-hidden bg-white dark:bg-[#020817] backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-[#232a36]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-purple-100/30 dark:from-blue-600/10 dark:to-purple-600/10 rounded-full blur-2xl"></div>
                <div className="relative space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-900 dark:to-purple-900 rounded-xl text-white shadow-lg">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        Nature Overview
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wide mb-2">
                          Description
                        </p>
                        <p className="text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-200 dark:text-slate-200 dark:bg-[#020817] dark:border-[#232a36] break-words ">
                          {nature.description}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wide mb-2">
                          Technical Overview
                        </p>
                        <p className="text-slate-700 leading-relaxed  bg-slate-50 rounded-xl p-4 border border-slate-200 dark:text-slate-200 dark:bg-[#020817] dark:border-[#232a36] break-words">
                          {nature.technicalOverview}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wide mb-2">
                          Applications
                        </p>
                        <p className="text-slate-700 leading-relaxed  bg-slate-50 rounded-xl p-4 border border-slate-200 dark:text-slate-200 dark:bg-[#020817] dark:border-[#232a36] break-words ">
                          {Array.isArray(nature.applications)
                            ? nature.applications.join(", ")
                            : nature.applications}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wide mb-2">
                          Key Features
                        </p>
                        <p className="text-slate-700 leading-relaxed  bg-slate-50 rounded-xl p-4 border border-slate-200 dark:text-slate-200 dark:bg-[#020817] dark:border-[#232a36] break-words ">
                          {Array.isArray(nature.keyFeatures)
                            ? nature.keyFeatures.join(", ")
                            : nature.keyFeatures}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wide mb-2">
                          Related Industries
                        </p>
                        <p className="text-slate-700 leading-relaxed  bg-slate-50 rounded-xl p-4 border border-slate-200 dark:text-slate-200 dark:bg-[#020817] dark:border-[#232a36] break-words ">
                          {Array.isArray(nature.relatedIndustries)
                            ? nature.relatedIndustries.join(", ")
                            : nature.relatedIndustries}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Section */}
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
                    <p className="text-slate-900 dark:text-slate-100 font-medium break-words ">
                      {nature.seoTitle}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-[#020817] backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-[#232a36] hover:shadow-lg transition-all duration-300">
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">
                      SEO Description
                    </p>
                    <p className="text-blue-900 dark:text-blue-200 leading-relaxed break-words ">
                      {nature.seoDescription}
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-[#020817] backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-[#232a36] hover:shadow-lg transition-all duration-300">
                  <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-4">
                    SEO Keywords
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(nature.seoKeywords)
                      ? nature.seoKeywords
                      : nature.seoKeywords?.split(",") || []
                    ).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-200 rounded-full text-sm font-medium border border-purple-200 dark:border-purple-800 hover:shadow-md transition-shadow duration-300 break-words "
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

export default NatureView;
