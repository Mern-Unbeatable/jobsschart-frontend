import React, { memo, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import BlogHeader from "./sections/BlogHeader";
import BlogCategories from "./sections/BlogCategories";
import BlogGrid from "./sections/BlogGrid";
import CommonAdsSection from "../../components/CommonAdsSection";
import {
  useGetBlogsQuery,
  useGetAllBlogCategoriesQuery,
} from "../../features/api/blogApi";
import { resolveI18n } from "../../utils/resolveI18n";

const BlogContent = memo(() => {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: categoriesData } = useGetAllBlogCategoriesQuery();
  const { data: blogsData, isLoading: isBlogsLoading } = useGetBlogsQuery();

  const blogCategories = useMemo(() => {
    return categoriesData?.categories || [];
  }, [categoriesData]);

  const categories = useMemo(() => {
    return [
      { value: "all", label: t("blog.page.categories.all") },
      ...blogCategories.map((c) => ({
        value: c.id,
        label: resolveI18n(c.name, i18n.language),
      })),
    ];
  }, [blogCategories, t, i18n.language]);

  const filteredBlogs = useMemo(() => {
    const rawBlogs = blogsData?.blogs || [];
    const normalized = rawBlogs.map((b) => ({
      id: b.id,
      image: Array.isArray(b.image) ? b.image[0] || null : b.image || null,
      date: b.createdAt
        ? new Date(b.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "N/A",
      author: b.user?.name || "Admin",
      title: resolveI18n(b.title, i18n.language),
      desc: resolveI18n(b.excerpt, i18n.language) || resolveI18n(b.content, i18n.language),
      categoryId: b.categoryId,
      slug: b.slug,
    }));

    if (activeCategory === "all") return normalized;
    return normalized.filter((blog) => blog.categoryId === activeCategory);
  }, [blogsData, activeCategory, i18n.language]);

  return (
    <div className="bg-[#FBFDFF] py-14 md:py-20   ">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <BlogHeader />

        {/* Category Tabs */}
        <BlogCategories
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Blog Grid */}
        {isBlogsLoading ? (
          <div className="py-24 text-center text-base text-gray-400 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-green-500/60 border-t-transparent rounded-full animate-spin" />
            <span>Loading blogs...</span>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="py-24 text-center text-base text-gray-400">
            No blogs found in this category.
          </div>
        ) : (
          <BlogGrid blogs={filteredBlogs} />
        )}

        <CommonAdsSection
          wrapperClassName="mt-16"
          containerClassName="container mx-auto"
          boxClassName="w-full h-44 bg-[#F1F5F9] rounded-xl border border-dashed border-gray-300 flex items-center justify-center group hover:bg-gray-50 transition-colors"
          title={t("blog.page.adsTitle")}
          titleClassName="text-xl font-semibold text-gray-600"
          placement="GLOBAL"
        />
      </div>
    </div>
  );
});

BlogContent.displayName = "BlogContent";

export default BlogContent;
