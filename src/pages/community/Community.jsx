import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Pagination from "../../components/Pagination";
import CommonAdsSection from "../../components/CommonAdsSection";
import CategoriesSidebar from "./sections/CategoriesSidebar";
import TabFilter from "./sections/TabFilter";
import PostsList from "./sections/PostsList";
import ShareExperienceModal from "./sections/ShareExperienceModal";
import { ROUTES } from "../../config";
import { selectIsAuthenticated } from "../../features/slices/authSlice";
import { useGetPostsQuery } from "../../features/api/postApi";

const CommunityContent = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [activeTab, setActiveTab] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const postsPerPage = 5;

  const { data: postsData, isLoading } = useGetPostsQuery({
    page: currentPage,
    limit: postsPerPage,
    category: activeCategory === "all" ? undefined : activeCategory,
    subCategory: activeTab === "all" ? undefined : activeTab,
  });

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleShareExperience = () => {
    if (!isAuthenticated) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to share your experience.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#22c55e",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(ROUTES.LOGIN);
        }
      });
      return;
    }
    setIsModalOpen(true);
  };

  const tabs = [
    { value: "all", label: "All" },
    { value: "meditation", label: t("community.tabs.meditation") },
    { value: "mindfulness", label: t("community.tabs.mindfulness") },
    { value: "awakening", label: t("community.tabs.awakening") },
  ];

  const categories = [
    {
      value: "all",
      label: "All",
      isOpen: true,
    },
    {
      value: "spiritual-development",
      label: t("community.categories.spiritualDevelopment"),
      isOpen: false,
    },
    {
      value: "meditation",
      label: t("community.categories.meditation"),
      isOpen: false,
    },
    {
      value: "love-life",
      label: t("community.categories.loveLife"),
      isOpen: false,
    },
    {
      value: "energy-healing",
      label: t("community.categories.energyHealing"),
      isOpen: false,
    },
  ];

  const posts = postsData?.posts || [];
  const totalPages = postsData?.meta?.totalPages || 1;

  return (
    <div className="bg-[#FBFDFF] min-h-screen">
      {/* Top Header Section */}
      <div className="container mx-auto px-4 lg:px-6 pt-8 md:pt-12 pb-14 mb:pb-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start border-b border-gray-200 pb-8">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
              {t("community.page.title")}
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              {t("community.page.description")}
            </p>
          </div>
          <button
            onClick={handleShareExperience}
            className="self-start bg-green-500/60 text-white px-5 py-2 rounded-lg text-base transition-all"
          >
            {t("community.page.shareExperience")}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 mt-10">
          {/* Left Sidebar - Categories */}
          <CategoriesSidebar
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* Right Content - Posts List */}
          <div className="w-full lg:w-3/4">
            {/* Top Tabs */}
            <TabFilter
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />

            {/* Post Cards / Loading State */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="border bg-white border-gray-100 rounded-lg p-6 animate-pulse flex flex-col gap-4"
                  >
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-2/3 mt-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <PostsList posts={posts} />
            ) : (
              <div className="bg-white border border-gray-100 rounded-lg p-10 text-center text-gray-500 font-medium">
                No posts found in this community yet.
              </div>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>

        {/* Ads Section */}
        <CommonAdsSection
          wrapperClassName="mt-16"
          containerClassName="px-0"
          boxClassName="w-full h-44 bg-[#F1F5F9] rounded-xl border border-dashed border-gray-300 flex items-center justify-center group hover:bg-gray-50 transition-colors"
          title={t("community.page.adsTitle")}
          titleClassName="text-xl font-semibold text-gray-600"
          placement="GLOBAL"
        />
      </div>

      {/* Share Experience Modal */}
      <ShareExperienceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
});

CommunityContent.displayName = "CommunityContent";

export default CommunityContent;
