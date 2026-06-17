import React, { memo, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  User,
  ArrowLeft,
  Facebook,
  Linkedin,
  Twitter,
} from "lucide-react";
import AdsSection from "./sections/AdsSection";
import { useGetBlogBySlugQuery } from "../../features/api/blogApi";

const BlogDetail = memo(() => {
  const { blogId } = useParams(); // Contains the slug
  const navigate = useNavigate();

  const { data: blogData, isLoading, error } = useGetBlogBySlugQuery(blogId);

  const blogImg = useMemo(() => {
    const img = blogData?.blog?.image;
    return Array.isArray(img) ? img[0] || null : img || null;
  }, [blogData]);

  const blogDate = useMemo(() => {
    const date = blogData?.blog?.createdAt;
    return date
      ? new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "N/A";
  }, [blogData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500/60"></div>
      </div>
    );
  }

  if (error || !blogData?.blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500 font-semibold text-lg">
          {error?.data?.message || "Failed to fetch blog details."}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-green-500/60 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>
      </div>
    );
  }

  const blog = blogData.blog;

  return (
    <div className="bg-white min-h-screen py-14 md:py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-green-500/60 mb-10 transition-colors text-base font-medium"
        >
          <ArrowLeft size={18} />
          Back to Blog
        </button>

        {/* 1. Blog Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl text-gray-800 mb-6 leading-tight font-medium">
          {blog.title}
        </h1>

        {/* 2. Meta Information */}
        <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-500">
          <div className="flex items-center gap-2">
            <User size={16} className="text-gray-400" />
            <span className="text-base">{blog.user?.name || "Admin"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <span className="text-base">{blog.readTime || 1} min read</span>
          </div>
          <div className="text-base">{blogDate}</div>
        </div>

        {/* 3. Featured Image */}
        <div className="rounded-xl overflow-hidden mb-10">
          {blogImg ? (
            <img
              src={blogImg}
              alt={blog.title}
              className="w-full h-auto md:h-150 object-cover"
            />
          ) : (
            <div className="w-full h-48 md:h-96 bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-400 border border-dashed border-gray-300 rounded-xl">
              No Image
            </div>
          )}
        </div>

        {/* 4. Social Share Icons */}
        <div className="flex items-center gap-4 mb-6">
          <Facebook
            size={20}
            className="text-gray-400 hover:text-green-500/60 cursor-pointer transition-colors"
          />
          <Linkedin
            size={20}
            className="text-gray-400 hover:text-green-500/60 cursor-pointer transition-colors"
          />
          <Twitter
            size={20}
            className="text-gray-400 hover:text-green-500/60 cursor-pointer transition-colors"
          />
        </div>
        <hr className="border-gray-100 mb-10" />

        {/* 5. Blog Content Area */}
        <div className="max-w-none text-gray-600 text-base leading-relaxed whitespace-pre-wrap pb-12">
          {blog.content}
        </div>
      </div>
      {/* 6. Ads Section */}
      <AdsSection />
    </div>
  );
});

BlogDetail.displayName = "BlogDetail";

export default BlogDetail;
