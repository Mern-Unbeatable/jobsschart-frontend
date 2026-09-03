import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import BlogHeader from "./components/BlogHeader";
import CategoryFilters from "./components/CategoryFilters";
import BlogCard from "./components/BlogCard";
import BlogModal from "./components/BlogModal";
import {
  useGetBlogsQuery,
  useGetDraftBlogsQuery,
  useGetAllBlogCategoriesQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from "../../../../features/api/blogApi";
import { resolveI18n } from "../../../../utils/resolveI18n";
import {
  getPendingConsultantBlogs,
  approveConsultantBlog,
  deleteConsultantBlog,
} from "../../../../utils/consultantBlogStorage";
import {
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  Globe,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  title: "",
  slug: "",
  categoryId: "",
  content: "",
  image: "",
  imageFile: null,
  status: "PUBLISHED",
};

const MODAL_CLOSE_ANIMATION_MS = 280;

// ─── Sub-tab config ───────────────────────────────────────────────────────────
const ADMIN_SUB_TABS = [
  { key: "PUBLISHED", label: "Published", icon: Globe },
  { key: "DRAFT", label: "Drafts", icon: FileText },
];

// ─── Empty state component ────────────────────────────────────────────────────
const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-[#E8E0F5] bg-[#FAF8FE] py-20 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F3EAFF]">
      <Icon size={28} className="text-[#9B59D6]" />
    </div>
    <div>
      <p className="text-base font-semibold text-[#333350]">{title}</p>
      <p className="mt-1 text-sm text-[#8A8AAA]">{subtitle}</p>
    </div>
  </div>
);

// ─── Loading state ────────────────────────────────────────────────────────────
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center gap-3 py-20">
    <Loader2 size={32} className="animate-spin text-[#9B59D6]" />
    <p className="text-sm text-[#8A8AAA]">Loading blogs…</p>
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────
const Blog = () => {
  // ── Active top-level tab: "ADMIN" or "CONSULTANT" ──
  const [mainTab, setMainTab] = useState("ADMIN");

  // ── Admin sub-tab: "PUBLISHED" or "DRAFT" ──
  const [adminSubTab, setAdminSubTab] = useState("PUBLISHED");

  // ── Consultant pending local state ──
  const [localPendingTick, setLocalPendingTick] = useState(0);

  // ── Category filter ──
  const [activeCategory, setActiveCategory] = useState("All");

  // ── Modal state ──
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [pendingReset, setPendingReset] = useState(false);
  const [lastError, setLastError] = useState(null);
  const closeTimerRef = useRef(null);

  // ── API hooks ──
  const { data: publishedBlogsData, isLoading: isPublishedLoading } =
    useGetBlogsQuery(undefined, {
      skip: mainTab !== "ADMIN" || adminSubTab !== "PUBLISHED",
    });

  const { data: draftBlogsData, isLoading: isDraftsLoading } =
    useGetDraftBlogsQuery(undefined, {
      skip: mainTab !== "ADMIN" || adminSubTab !== "DRAFT",
    });

  const { data: categoriesData } = useGetAllBlogCategoriesQuery();
  const [createBlog] = useCreateBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();

  // ── Derived: refresh consultant pending ──
  const refreshLocalPending = useCallback(() => {
    setLocalPendingTick((n) => n + 1);
  }, []);

  // ── Blog categories ──
  const blogCategories = useMemo(
    () => categoriesData?.categories || [],
    [categoriesData]
  );

  const filterCategoriesList = useMemo(
    () => ["All", ...blogCategories.map((c) => resolveI18n(c.name, "en"))],
    [blogCategories]
  );

  // ── Admin blogs (normalized) ──
  const adminBlogsData =
    adminSubTab === "PUBLISHED" ? publishedBlogsData : draftBlogsData;
  const isAdminBlogsLoading =
    adminSubTab === "PUBLISHED" ? isPublishedLoading : isDraftsLoading;

  const normalizedAdminBlogs = useMemo(() => {
    const rawBlogs = adminBlogsData?.blogs || [];
    return rawBlogs.map((b) => ({
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
      author: b.user?.name || "Admin",
      image: Array.isArray(b.image) ? b.image[0] || null : b.image || null,
      isLocalConsultant: false,
    }));
  }, [adminBlogsData]);

  // ── Consultant pending blogs (normalized) ──
  const normalizedConsultantBlogs = useMemo(() => {
    return getPendingConsultantBlogs().map((b) => ({
      id: b.id,
      category: b.category || "Uncategorized",
      categoryId: b.categoryId,
      title: b.title,
      i18nTitle: b.title,
      description: b.content,
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
      author: b.author || "Consultant",
      image: b.image || null,
      isLocalConsultant: true,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localPendingTick]);

  const pendingConsultantCount = normalizedConsultantBlogs.length;

  // ── Category filtering ──
  const filteredAdminBlogs = useMemo(() => {
    if (activeCategory === "All") return normalizedAdminBlogs;
    return normalizedAdminBlogs.filter((b) => b.category === activeCategory);
  }, [activeCategory, normalizedAdminBlogs]);

  const filteredConsultantBlogs = useMemo(() => {
    if (activeCategory === "All") return normalizedConsultantBlogs;
    return normalizedConsultantBlogs.filter(
      (b) => b.category === activeCategory
    );
  }, [activeCategory, normalizedConsultantBlogs]);

  // ── Modal helpers ──
  const handleCloseModal = useCallback(() => {
    if (!isModalOpen || isModalClosing) return;
    setIsModalClosing(true);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setIsModalOpen(false);
      setIsModalClosing(false);
      if (pendingReset) {
        setEditingBlogId(null);
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
    []
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
      status: blog.status || "PUBLISHED",
    });
    setLastError(null);
    setIsModalOpen(true);
  };

  // ── Delete ──
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete this blog?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    });
    if (!result.isConfirmed) return;

    const localBlog = normalizedConsultantBlogs.find(
      (b) => String(b.id) === String(id)
    );
    if (localBlog) {
      deleteConsultantBlog(id);
      refreshLocalPending();
      toast.success("Blog deleted");
      return;
    }

    try {
      await deleteBlog(id).unwrap();
      toast.success("Blog deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete blog");
    }
  };

  // ── Approve consultant blog ──
  const handleApprove = async (blog) => {
    const result = await Swal.fire({
      title: "Approve & Publish?",
      text: `"${blog.title}" will be published and visible to everyone.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, approve",
    });
    if (!result.isConfirmed) return;

    if (blog.isLocalConsultant) {
      approveConsultantBlog(blog.id);
      refreshLocalPending();
      toast.success("Blog approved and published!");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("status", "PUBLISHED");
      await updateBlog({ id: blog.id, body: fd }).unwrap();
      toast.success("Blog approved and published!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to approve blog");
    }
  };

  // ── Form field handlers ──
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

  // ── Save ──
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

    const fd = new FormData();

    if (editingBlogId) {
      let hasChanges = false;
      if (preparedTitle !== editingBlog?.title) {
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
      if (preparedContent !== editingBlog?.description) {
        fd.append("content", preparedContent);
        hasChanges = true;
      }
      if (formData.status !== editingBlog?.status) {
        fd.append("status", formData.status);
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
    } else {
      if (!preparedTitle || !preparedContent || !formData.categoryId) {
        toast.error("Please fill in all required fields");
        return;
      }
      fd.append("title", preparedTitle);
      fd.append("slug", preparedSlug);
      fd.append("categoryId", formData.categoryId);
      fd.append("content", preparedContent);
      fd.append("status", formData.status);
      if (formData.imageFile) fd.append("image", formData.imageFile);
    }

    try {
      if (editingBlogId) {
        await updateBlog({ id: editingBlogId, body: fd }).unwrap();
        toast.success("Blog updated successfully");
      } else {
        await createBlog(fd).unwrap();
        toast.success("Blog created successfully");
      }
      setPendingReset(true);
      handleCloseModal();
    } catch (err) {
      console.error("Save blog error:", err);
      const details = err?.data?.errors
        ? Array.isArray(err.data.errors)
          ? err.data.errors
              .map((e) => (typeof e === "object" ? JSON.stringify(e) : String(e)))
              .join(" | ")
          : JSON.stringify(err.data.errors)
        : err?.data?.message || JSON.stringify(err?.data || err);
      setLastError(details);
      toast.error(`Failed: ${details}`);
    }
  };

  const isEditMode = Boolean(editingBlogId);

  // ─── Tab switch helper ─────────────────────────────────────────────────────
  const switchMainTab = (tab) => {
    setMainTab(tab);
    setActiveCategory("All");
  };

  const switchAdminSubTab = (tab) => {
    setAdminSubTab(tab);
    setActiveCategory("All");
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <section className="space-y-6">
      {/* Page Header */}
      <BlogHeader
        onAddClick={handleOpenCreate}
        pendingCount={pendingConsultantCount}
      />

      {/* ── Main Tabs ── */}
      <div className="flex flex-wrap gap-3">
        {/* Admin Blogs Tab */}
        <button
          type="button"
          onClick={() => switchMainTab("ADMIN")}
          className={`relative inline-flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
            mainTab === "ADMIN"
              ? "bg-[#6E35AE] text-white shadow-md shadow-[#6E35AE]/20"
              : "border border-[#E5E5F0] bg-white text-[#555570] hover:border-[#C4A8E8] hover:text-[#7C3AED]"
          }`}
        >
          <BookOpen size={16} />
          My Blogs
        </button>

        {/* Consultant Review Tab */}
        <button
          type="button"
          onClick={() => switchMainTab("CONSULTANT")}
          className={`relative inline-flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
            mainTab === "CONSULTANT"
              ? "bg-[#6E35AE] text-white shadow-md shadow-[#6E35AE]/20"
              : "border border-[#E5E5F0] bg-white text-[#555570] hover:border-[#C4A8E8] hover:text-[#7C3AED]"
          }`}
        >
          <Users size={16} />
          Consultant Requests
          {pendingConsultantCount > 0 && (
            <span
              className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold ${
                mainTab === "CONSULTANT"
                  ? "bg-white/25 text-white"
                  : "bg-amber-500 text-white"
              }`}
            >
              {pendingConsultantCount}
            </span>
          )}
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════
          ADMIN BLOGS SECTION
         ══════════════════════════════════════════════════════ */}
      {mainTab === "ADMIN" && (
        <div className="space-y-5">
          {/* Sub-tabs: Published / Drafts */}
          <div className="flex items-center gap-2 rounded-xl border border-[#EBEBF0] bg-[#F8F6FD] p-1 w-fit">
            {ADMIN_SUB_TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => switchAdminSubTab(key)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  adminSubTab === key
                    ? "bg-white text-[#7C3AED] shadow-sm shadow-[#9B59D6]/10"
                    : "text-[#8A8AAA] hover:text-[#555570]"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* Category Filters */}
          <CategoryFilters
            categories={filterCategoriesList}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          {/* Blog Grid */}
          {isAdminBlogsLoading ? (
            <LoadingState />
          ) : filteredAdminBlogs.length === 0 ? (
            <EmptyState
              icon={adminSubTab === "DRAFT" ? FileText : Globe}
              title={
                adminSubTab === "DRAFT"
                  ? "No draft blogs"
                  : "No published blogs yet"
              }
              subtitle={
                adminSubTab === "DRAFT"
                  ? "Blogs you save as drafts will appear here."
                  : "Create your first blog post using the button above."
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredAdminBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          CONSULTANT REQUESTS SECTION
         ══════════════════════════════════════════════════════ */}
      {mainTab === "CONSULTANT" && (
        <div className="space-y-5">
          {/* Section info banner */}
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <AlertCircle
              size={18}
              className="mt-0.5 flex-shrink-0 text-amber-600"
            />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Review before publishing
              </p>
              <p className="text-sm text-amber-700">
                These blog posts have been submitted by consultants and are
                waiting for your approval. Review the content and click{" "}
                <strong>Approve</strong> to publish.
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4">
            <div className="inline-flex items-center gap-2.5 rounded-xl border border-amber-200 bg-white px-4 py-2.5 shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                <Clock size={16} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-[#8A8AAA]">Pending Review</p>
                <p className="text-lg font-bold text-[#1A1A2E]">
                  {pendingConsultantCount}
                </p>
              </div>
            </div>

            {pendingConsultantCount === 0 && (
              <div className="inline-flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <p className="text-sm font-medium text-emerald-700">
                  All caught up! No pending requests.
                </p>
              </div>
            )}
          </div>

          {/* Category Filters */}
          {pendingConsultantCount > 0 && (
            <CategoryFilters
              categories={[
                "All",
                ...Array.from(
                  new Set(normalizedConsultantBlogs.map((b) => b.category))
                ),
              ]}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />
          )}

          {/* Consultant Blog Cards */}
          {filteredConsultantBlogs.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No consultant submissions"
              subtitle="When consultants submit blog posts for review, they will appear here."
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredConsultantBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  onDelete={handleDelete}
                  onApprove={handleApprove}
                  draftStatusLabel="Pending Review"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Blog Create/Edit Modal ── */}
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
      />
    </section>
  );
};

export default Blog;
