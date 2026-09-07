import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import BlogHeader from "../../admin/blog/components/BlogHeader";
import CategoryFilters from "../../admin/blog/components/CategoryFilters";
import BlogCard from "../../admin/blog/components/BlogCard";
import BlogModal from "../../admin/blog/components/BlogModal";
import Pagination from "../../../../components/Pagination";
import {
  useGetMyBlogsQuery,
  useGetAllBlogCategoriesQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from "../../../../features/api/blogApi";
import { resolveI18n } from "../../../../utils/resolveI18n";
import { Loader2 } from "lucide-react";

const PAGE_LIMIT = 12;

const EMPTY_FORM = {
  title: "",
  slug: "",
  categoryId: "",
  content: "",
  image: "",
  imageFile: null,
};

const MODAL_CLOSE_ANIMATION_MS = 280;

// Maps UI tab key to the API status value
const TAB_STATUS = {
  PENDING_APPROVAL: "PENDING_APPROVAL",
  PUBLISHED: "PUBLISHED",
};

const Blog = () => {
  const [activeTab, setActiveTab] = useState("PENDING_APPROVAL");
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [pendingReset, setPendingReset] = useState(false);
  const [lastError, setLastError] = useState(null);
  const closeTimerRef = useRef(null);

  const { data: blogsData, isLoading } = useGetMyBlogsQuery({
    status: TAB_STATUS[activeTab],
    page,
    limit: PAGE_LIMIT,
  });

  const { data: categoriesData } = useGetAllBlogCategoriesQuery();
  const [createBlog] = useCreateBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();

  const blogCategories = useMemo(
    () => categoriesData?.categories || [],
    [categoriesData],
  );

  const filterCategoriesList = useMemo(
    () => ["All", ...blogCategories.map((c) => resolveI18n(c.name, "en"))],
    [blogCategories],
  );

  const normalizedBlogs = useMemo(() => {
    return (blogsData?.blogs || []).map((b) => ({
      id: b.id,
      category: resolveI18n(b.category?.name, "en") || "Uncategorized",
      categoryId: b.categoryId,
      title: resolveI18n(b.title, "en"),
      i18nTitle: b.title,
      description: resolveI18n(b.content, "en"),
      i18nContent: b.content,
      slug: b.slug,
      status: b.status,
      date: b.createdAt
        ? new Date(b.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "N/A",
      author: b.user?.name || "You",
      image: Array.isArray(b.image) ? b.image[0] || null : b.image || null,
    }));
  }, [blogsData]);

  const totalPages = blogsData?.meta?.totalPages || 1;

  const filteredBlogs = useMemo(() => {
    if (activeCategory === "All") return normalizedBlogs;
    return normalizedBlogs.filter((b) => b.category === activeCategory);
  }, [activeCategory, normalizedBlogs]);

  const handleCloseModal = useCallback(() => {
    if (!isModalOpen || isModalClosing) return;
    setIsModalClosing(true);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setIsModalOpen(false);
      setIsModalClosing(false);
      if (pendingReset) {
        setEditingBlogId(null);
        setEditingBlog(null);
        setFormData(EMPTY_FORM);
        setPendingReset(false);
      }
      closeTimerRef.current = null;
    }, MODAL_CLOSE_ANIMATION_MS);
  }, [isModalClosing, isModalOpen, pendingReset]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    [],
  );

  const handleOpenCreate = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsModalClosing(false);
    setPendingReset(false);
    setEditingBlogId(null);
    setEditingBlog(null);
    setFormData(EMPTY_FORM);
    setLastError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (blog) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsModalClosing(false);
    setPendingReset(false);
    setEditingBlogId(blog.id);
    setEditingBlog(blog);
    setFormData({
      title: resolveI18n(blog.i18nTitle, "en") || blog.title || "",
      slug: blog.slug || "",
      categoryId: blog.categoryId || "",
      content: resolveI18n(blog.i18nContent, "en") || blog.description || "",
      image: blog.image || "",
      imageFile: null,
    });
    setLastError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteBlog(id).unwrap();
      toast.success("Blog deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete blog");
    }
  };

  const handleFieldChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, imageFile: file }));
    const reader = new FileReader();
    reader.onload = () =>
      setFormData((prev) => ({ ...prev, image: String(reader.result || "") }));
    reader.readAsDataURL(file);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setLastError(null);

    const preparedTitle = formData.title.trim();
    const preparedContent = formData.content.trim();
    const preparedSlug = formData.slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!preparedTitle || !preparedContent || !formData.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    const fd = new FormData();

    if (editingBlogId) {
      let hasChanges = false;
      const origTitle =
        resolveI18n(editingBlog?.i18nTitle, "en") || editingBlog?.title || "";
      const origContent =
        resolveI18n(editingBlog?.i18nContent, "en") ||
        editingBlog?.description ||
        "";

      if (preparedTitle !== origTitle) {
        fd.append("title", preparedTitle);
        hasChanges = true;
      }
      if (preparedSlug !== editingBlog?.slug) {
        fd.append("slug", preparedSlug);
        hasChanges = true;
      }
      if (formData.categoryId !== editingBlog?.categoryId) {
        fd.append("categoryId", formData.categoryId);
        hasChanges = true;
      }
      if (preparedContent !== origContent) {
        fd.append("content", preparedContent);
        hasChanges = true;
      }
      if (formData.imageFile) {
        fd.append("image", formData.imageFile);
        hasChanges = true;
      }

      if (!hasChanges) {
        toast.error("No changes detected");
        handleCloseModal();
        return;
      }

      try {
        await updateBlog({ id: editingBlogId, body: fd }).unwrap();
        toast.success("Blog updated and resubmitted for approval");
        setPendingReset(true);
        handleCloseModal();
      } catch (err) {
        const msg = err?.data?.message || "Failed to update blog";
        setLastError(msg);
        toast.error(msg);
      }
    } else {
      fd.append("title", preparedTitle);
      fd.append("slug", preparedSlug);
      fd.append("categoryId", formData.categoryId);
      fd.append("content", preparedContent);
      if (formData.imageFile) fd.append("image", formData.imageFile);

      try {
        await createBlog(fd).unwrap();
        toast.success("Blog submitted for admin approval");
        setPendingReset(true);
        handleCloseModal();
        setActiveTab("PENDING_APPROVAL");
        setActiveCategory("All");
      } catch (err) {
        const msg = err?.data?.message || "Failed to submit blog";
        setLastError(msg);
        toast.error(msg);
      }
    }
  };

  const isEditMode = Boolean(editingBlogId);

  return (
    <section className="space-y-8">
      <BlogHeader onAddClick={handleOpenCreate} />

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-white border border-[#E8E8E8] rounded-lg px-2 py-2 w-full sm:w-fit">
        {[
          { key: "PENDING_APPROVAL", label: "Pending Approval" },
          { key: "PUBLISHED", label: "Published" },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setActiveTab(key);
              setPage(1);
              setActiveCategory("All");
            }}
            className={`flex-1 sm:flex-none px-5 py-1.5 rounded-md text-base font-medium transition-colors ${
              activeTab === key
                ? "bg-green-500/60 text-white"
                : "text-[#545454] hover:bg-gray-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Category filters */}
      <CategoryFilters
        categories={filterCategoriesList}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setPage(1);
        }}
      />

      {/* Blog grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <Loader2 size={32} className="animate-spin text-[#9B59D6]" />
          <p className="text-sm text-[#8A8AAA]">Loading blogs…</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="py-24 text-center text-base text-gray-400">
          {activeTab === "PENDING_APPROVAL"
            ? "No blogs waiting for approval."
            : "No published blogs yet. Submit a blog for admin approval to get started."}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {filteredBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onEdit={
                  activeTab === "PENDING_APPROVAL" ? handleOpenEdit : undefined
                }
                onDelete={handleDelete}
                draftStatusLabel="Pending Approval"
              />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <BlogModal
        isOpen={isModalOpen}
        isClosing={isModalClosing}
        isEditMode={isEditMode}
        formData={formData}
        onChangeField={handleFieldChange}
        onChangeImage={handleImageChange}
        onSave={handleSave}
        onClose={handleCloseModal}
        categories={blogCategories}
        requireApproval
        lastError={lastError}
      />
    </section>
  );
};

export default Blog;
