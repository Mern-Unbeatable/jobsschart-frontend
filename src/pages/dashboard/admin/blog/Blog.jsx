import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../features/slices/authSlice";
import BlogHeader from "./components/BlogHeader";
import CategoryFilters from "./components/CategoryFilters";
import BlogCard from "./components/BlogCard";
import BlogModal from "./components/BlogModal";
import BlogPreviewModal from "./components/BlogPreviewModal";
import Pagination from "../../../../components/Pagination";
import {
  useGetAdminBlogsQuery,
  useGetPendingConsultantBlogsQuery,
  useGetAllBlogCategoriesQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useUploadBlogContentImageMutation,
  useDeleteBlogMutation,
  useApproveBlogMutation,
  useRejectBlogMutation,
} from "../../../../features/api/blogApi";
import { resolveI18n } from "../../../../utils/resolveI18n";
import { stripHtml } from "../../../../utils/sanitizeHtml";
import {
  createEmptyEditorJsData,
  editorJsToPlainText,
  isEditorJsContentEmpty,
  normalizeEditorJsData,
  toI18nEditorJsContent,
} from "../../../../utils/editorjsContent";
import {
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  Globe,
  FileText,
  AlertCircle,
  Loader2,
  XCircle,
  Eye,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────
const PAGE_LIMIT = 12;

const EMPTY_FORM = {
  title: "",
  slug: "",
  categoryId: "",
  content: createEmptyEditorJsData(),
  image: "",
  imageFile: null,
  status: "PUBLISHED",
};

const MODAL_CLOSE_ANIMATION_MS = 280;

// ─── Sub-tab configs ──────────────────────────────────────────────────────────
const ADMIN_SUB_TABS = [
  { key: "PUBLISHED", label: "Published", icon: Globe },
  { key: "DRAFT", label: "Drafts", icon: FileText },
];

const CONSULTANT_SUB_TABS = [
  { key: "PENDING", label: "Pending Review", icon: Clock },
  { key: "PUBLISHED", label: "Published", icon: CheckCircle2 },
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

// ─── Normalize a blog row from the API ────────────────────────────────────────
const normalizeBlog = (b) => {
  const localizedContent = resolveI18n(b.content, "en");
  const contentData = normalizeEditorJsData(localizedContent);

  return {
    id: b.id,
    category: resolveI18n(b.category?.name, "en") || "Uncategorized",
    categoryId: b.categoryId,
    title: resolveI18n(b.title, "en"),
    i18nTitle: b.title,
    description: editorJsToPlainText(contentData),
    contentData,
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
    authorId: b.user?.id || null,
    userRole: b.user?.role || null,
    image: Array.isArray(b.image) ? b.image[0] || null : b.image || null,
  };
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const Blog = () => {
  const currentUser = useSelector(selectUser);

  // ── Active top-level tab: "ADMIN" or "CONSULTANT" ──
  const [mainTab, setMainTab] = useState("ADMIN");

  // ── Admin sub-tab: "PUBLISHED" or "DRAFT" ──
  const [adminSubTab, setAdminSubTab] = useState("PUBLISHED");

  // ── Consultant sub-tab: "PENDING" or "PUBLISHED" ──
  const [consultantSubTab, setConsultantSubTab] = useState("PENDING");

  // ── Pagination ──
  const [adminPage, setAdminPage] = useState(1);
  const [consultantPendingPage, setConsultantPendingPage] = useState(1);
  const [consultantPublishedPage, setConsultantPublishedPage] = useState(1);

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
  const [isSaving, setIsSaving] = useState(false);
  const [previewBlog, setPreviewBlog] = useState(null);
  const closeTimerRef = useRef(null);

  // ── API hooks ──
  const { data: adminBlogsData, isLoading: isAdminBlogsLoading } =
    useGetAdminBlogsQuery(
      {
        status: adminSubTab,
        userRole: "ADMIN",
        userId: currentUser?.id,
        page: adminPage,
        limit: PAGE_LIMIT,
      },
      { skip: mainTab !== "ADMIN" || !currentUser?.id },
    );

  const { data: pendingData, isLoading: isPendingLoading } =
    useGetPendingConsultantBlogsQuery(
      { page: consultantPendingPage, limit: PAGE_LIMIT },
      { skip: mainTab !== "CONSULTANT" || consultantSubTab !== "PENDING" },
    );

  const {
    data: consultantPublishedData,
    isLoading: isConsultantPublishedLoading,
  } = useGetAdminBlogsQuery(
    {
      status: "PUBLISHED",
      userRole: "CONSULTANT",
      page: consultantPublishedPage,
      limit: PAGE_LIMIT,
    },
    { skip: mainTab !== "CONSULTANT" || consultantSubTab !== "PUBLISHED" },
  );

  const { data: categoriesData } = useGetAllBlogCategoriesQuery();
  const [createBlog] = useCreateBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const [uploadBlogContentImage] = useUploadBlogContentImageMutation();
  const [deleteBlog] = useDeleteBlogMutation();
  const [approveBlog] = useApproveBlogMutation();
  const [rejectBlog] = useRejectBlogMutation();

  // ── Blog categories ──
  const blogCategories = useMemo(
    () => categoriesData?.categories || [],
    [categoriesData],
  );

  const filterCategoriesList = useMemo(
    () => ["All", ...blogCategories.map((c) => resolveI18n(c.name, "en"))],
    [blogCategories],
  );

  // ── Admin blogs (normalized + filtered) ──
  // Client-side guard: exclude any CONSULTANT-authored blog that slipped through
  const normalizedAdminBlogs = useMemo(
    () =>
      (adminBlogsData?.blogs || [])
        .map(normalizeBlog)
        .filter((b) => b.userRole !== "CONSULTANT"),
    [adminBlogsData],
  );

  const adminTotalPages = adminBlogsData?.meta?.totalPages || 1;

  const filteredAdminBlogs = useMemo(() => {
    if (activeCategory === "All") return normalizedAdminBlogs;
    return normalizedAdminBlogs.filter((b) => b.category === activeCategory);
  }, [activeCategory, normalizedAdminBlogs]);

  // ── Consultant pending blogs ──
  // No role filter needed: PENDING_APPROVAL status is only ever set for CONSULTANT authors
  const normalizedConsultantPendingBlogs = useMemo(
    () => (pendingData?.blogs || []).map(normalizeBlog),
    [pendingData],
  );
  const consultantPendingTotalPages = pendingData?.meta?.totalPages || 1;
  // Derive badge from the filtered list so it always matches what the UI shows
  const pendingConsultantCount = normalizedConsultantPendingBlogs.length;

  // ── Consultant published blogs ──
  // Role confirmed → strict CONSULTANT check.
  // Role absent (old API) → exclude the current admin's own posts as a proxy filter.
  const normalizedConsultantPublishedBlogs = useMemo(
    () =>
      (consultantPublishedData?.blogs || [])
        .map(normalizeBlog)
        .filter(
          (b) =>
            b.userRole === "CONSULTANT" ||
            (b.userRole === null && b.authorId !== currentUser?.id),
        ),
    [consultantPublishedData, currentUser?.id],
  );
  const consultantPublishedTotalPages =
    consultantPublishedData?.meta?.totalPages || 1;

  // ── Active consultant list based on sub-tab ──
  const activeConsultantBlogs =
    consultantSubTab === "PENDING"
      ? normalizedConsultantPendingBlogs
      : normalizedConsultantPublishedBlogs;

  const filteredConsultantBlogs = useMemo(() => {
    if (activeCategory === "All") return activeConsultantBlogs;
    return activeConsultantBlogs.filter((b) => b.category === activeCategory);
  }, [activeCategory, activeConsultantBlogs]);

  // ── Modal helpers ──
  const handleCloseModal = useCallback(() => {
    if (!isModalOpen || isModalClosing) return;
    setIsModalClosing(true);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setIsModalOpen(false);
      setIsModalClosing(false);
      setIsSaving(false);
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
    setIsSaving(false);
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
      content: normalizeEditorJsData(
        resolveI18n(blog.i18nContent, "en") || blog.contentData || "",
      ),
      image: blog.image || "",
      imageFile: null,
      status: blog.status || "PUBLISHED",
    });
    setLastError(null);
    setIsSaving(false);
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

    try {
      await approveBlog(blog.id).unwrap();
      toast.success("Blog approved and published!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to approve blog");
    }
  };

  // ── Reject consultant blog ──
  const handleReject = async (blog) => {
    const result = await Swal.fire({
      title: "Reject this blog?",
      text: `"${blog.title}" will be marked as rejected.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, reject",
    });
    if (!result.isConfirmed) return;

    try {
      await rejectBlog(blog.id).unwrap();
      toast.success("Blog rejected.");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to reject blog");
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
    setIsSaving(true);

    const preparedTitle = formData.title.trim();
    const preparedContent = normalizeEditorJsData(formData.content);
    const preparedSlug = formData.slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (
      !preparedTitle ||
      isEditorJsContentEmpty(preparedContent) ||
      !formData.categoryId
    ) {
      toast.error("Please fill in all required fields");
      setIsSaving(false);
      return;
    }

    const fd = new FormData();

    if (editingBlogId) {
      let hasChanges = false;
      const origContent = normalizeEditorJsData(
        resolveI18n(editingBlog?.i18nContent, "en") ||
          editingBlog?.contentData ||
          "",
      );
      const preparedContentSerialized = JSON.stringify(preparedContent);
      const originalContentSerialized = JSON.stringify(origContent);
      if (
        preparedTitle !==
        (resolveI18n(editingBlog?.i18nTitle, "en") || editingBlog?.title || "")
      ) {
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
      if (preparedContentSerialized !== originalContentSerialized) {
        fd.append(
          "content",
          JSON.stringify(toI18nEditorJsContent(preparedContent)),
        );
        hasChanges = true;
      }
      if (formData.status !== editingBlog?.status) {
        fd.append("status", formData.status);
        hasChanges = true;
      }
      if (formData.imageFile) {
        fd.append("image", formData.imageFile);
        hasChanges = true;
      } else if (formData.image && !formData.image.startsWith("data:")) {
        // Preserve existing server URL so the backend never sees an absent image field
        fd.append("image", formData.image);
      }
      if (!hasChanges) {
        toast.error("No changes detected");
        setIsSaving(false);
        handleCloseModal();
        return;
      }
    } else {
      fd.append("title", preparedTitle);
      fd.append("slug", preparedSlug);
      fd.append("categoryId", formData.categoryId);
      fd.append(
        "content",
        JSON.stringify(toI18nEditorJsContent(preparedContent)),
      );
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
              .map((e) =>
                typeof e === "object" ? JSON.stringify(e) : String(e),
              )
              .join(" | ")
          : JSON.stringify(err.data.errors)
        : err?.data?.message || JSON.stringify(err?.data || err);
      setLastError(details);
      toast.error(`Failed: ${details}`);
    }
  };

  const isEditMode = Boolean(editingBlogId);

  const handleEditorImageUpload = useCallback(
    async (file) => {
      const fd = new FormData();
      fd.append("image", file);
      const result = await uploadBlogContentImage(fd).unwrap();
      const url = result?.url || result?.image;
      if (!url) throw new Error("Upload succeeded but no URL returned");
      return url;
    },
    [uploadBlogContentImage],
  );

  // ─── Tab switch helpers ────────────────────────────────────────────────────
  const switchMainTab = (tab) => {
    setMainTab(tab);
    setActiveCategory("All");
  };

  const switchAdminSubTab = (tab) => {
    setAdminSubTab(tab);
    setAdminPage(1);
    setActiveCategory("All");
  };

  const switchConsultantSubTab = (tab) => {
    setConsultantSubTab(tab);
    setConsultantPendingPage(1);
    setConsultantPublishedPage(1);
    setActiveCategory("All");
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <section className="space-y-6">
      {/* Page Header */}
      <BlogHeader onAddClick={handleOpenCreate} />

      {/* Main Tabs */}
      <div className="flex flex-wrap gap-3">
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
          Admin Blogs
        </button>

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
          Consultant Blogs
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
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              setAdminPage(1);
            }}
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
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredAdminBlogs.map((blog) => (
                  <BlogCard
                    key={blog.id}
                    blog={blog}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                    onPreview={setPreviewBlog}
                  />
                ))}
              </div>
              {adminTotalPages > 1 && (
                <Pagination
                  currentPage={adminPage}
                  totalPages={adminTotalPages}
                  onPageChange={setAdminPage}
                />
              )}
            </>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          CONSULTANT BLOGS SECTION
         ══════════════════════════════════════════════════════ */}
      {mainTab === "CONSULTANT" && (
        <div className="space-y-5">
          {/* Sub-tabs: Pending Review / Published */}
          <div className="flex items-center gap-2 rounded-xl border border-[#EBEBF0] bg-[#F8F6FD] p-1 w-fit">
            {CONSULTANT_SUB_TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => switchConsultantSubTab(key)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  consultantSubTab === key
                    ? "bg-white text-[#7C3AED] shadow-sm shadow-[#9B59D6]/10"
                    : "text-[#8A8AAA] hover:text-[#555570]"
                }`}
              >
                <Icon size={15} />
                {label}
                {key === "PENDING" && pendingConsultantCount > 0 && (
                  <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                    {pendingConsultantCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── PENDING REVIEW ── */}
          {consultantSubTab === "PENDING" && (
            <div className="space-y-5">
              <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-amber-600"
                />
                <p className="text-sm text-amber-700">
                  Review and <strong>Approve</strong> or <strong>Reject</strong>{" "}
                  blog posts submitted by consultants before they go live.
                </p>
              </div>

              {/* Category filters */}
              {normalizedConsultantPendingBlogs.length > 0 && (
                <CategoryFilters
                  categories={[
                    "All",
                    ...Array.from(
                      new Set(
                        normalizedConsultantPendingBlogs.map((b) => b.category),
                      ),
                    ),
                  ]}
                  activeCategory={activeCategory}
                  onSelectCategory={(cat) => {
                    setActiveCategory(cat);
                    setConsultantPendingPage(1);
                  }}
                />
              )}

              {isPendingLoading ? (
                <LoadingState />
              ) : filteredConsultantBlogs.length === 0 ? (
                <EmptyState
                  icon={Clock}
                  title="No pending submissions"
                  subtitle="When consultants submit blog posts for review, they will appear here."
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {filteredConsultantBlogs.map((blog) => (
                      <ConsultantBlogCard
                        key={blog.id}
                        blog={blog}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onDelete={handleDelete}
                        onPreview={setPreviewBlog}
                      />
                    ))}
                  </div>
                  {consultantPendingTotalPages > 1 && (
                    <Pagination
                      currentPage={consultantPendingPage}
                      totalPages={consultantPendingTotalPages}
                      onPageChange={setConsultantPendingPage}
                    />
                  )}
                </>
              )}
            </div>
          )}

          {/* ── PUBLISHED ── */}
          {consultantSubTab === "PUBLISHED" && (
            <div className="space-y-5">
              {/* Category filters */}
              {normalizedConsultantPublishedBlogs.length > 0 && (
                <CategoryFilters
                  categories={[
                    "All",
                    ...Array.from(
                      new Set(
                        normalizedConsultantPublishedBlogs.map(
                          (b) => b.category,
                        ),
                      ),
                    ),
                  ]}
                  activeCategory={activeCategory}
                  onSelectCategory={(cat) => {
                    setActiveCategory(cat);
                    setConsultantPublishedPage(1);
                  }}
                />
              )}

              {isConsultantPublishedLoading ? (
                <LoadingState />
              ) : filteredConsultantBlogs.length === 0 ? (
                <EmptyState
                  icon={Globe}
                  title="No published consultant blogs"
                  subtitle="Approved consultant blogs will appear here once published."
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {filteredConsultantBlogs.map((blog) => (
                      <BlogCard
                        key={blog.id}
                        blog={blog}
                        onEdit={handleOpenEdit}
                        onDelete={handleDelete}
                        onPreview={setPreviewBlog}
                      />
                    ))}
                  </div>
                  {consultantPublishedTotalPages > 1 && (
                    <Pagination
                      currentPage={consultantPublishedPage}
                      totalPages={consultantPublishedTotalPages}
                      onPageChange={setConsultantPublishedPage}
                    />
                  )}
                </>
              )}
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
        onUploadInlineImage={handleEditorImageUpload}
        onSave={handleSave}
        onClose={handleCloseModal}
        categories={blogCategories}
        lastError={lastError}
        isSaving={isSaving}
      />

      <BlogPreviewModal
        blog={previewBlog}
        onClose={() => setPreviewBlog(null)}
      />
    </section>
  );
};

// ─── Consultant request card with Approve + Reject + Delete ──────────────────
const ConsultantBlogCard = ({
  blog,
  onApprove,
  onReject,
  onDelete,
  onPreview,
}) => (
  <article className="flex h-full flex-col rounded-2xl border border-amber-200 bg-white p-4">
    <div className="group relative">
      {blog.image ? (
        <img
          src={blog.image}
          alt={blog.title}
          className="h-48 w-full rounded-lg object-cover sm:h-56"
          loading="lazy"
        />
      ) : (
        <div className="flex h-48 w-full items-center justify-center rounded-lg bg-gray-100 text-sm font-medium text-gray-400 border border-dashed border-gray-300 sm:h-56">
          No Image
        </div>
      )}
      {onPreview && (
        <button
          type="button"
          onClick={() => onPreview(blog)}
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset focus-visible:outline-none"
          aria-label={`Preview "${blog.title}"`}
        >
          <Eye
            size={28}
            className="text-white drop-shadow"
            aria-hidden="true"
          />
        </button>
      )}
    </div>

    <div className="flex flex-1 flex-col pt-4">
      <div className="flex flex-wrap items-center gap-2 text-sm text-[#545454]">
        <span className="inline-flex items-center gap-1">
          <Users size={13} aria-hidden="true" />
          {blog.author}
        </span>
        <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
          Pending Review
        </span>
        {blog.category !== "Uncategorized" && (
          <span className="text-xs text-[#8A8AAA]">{blog.category}</span>
        )}
      </div>

      <h2
        className="mt-3 text-xl font-medium leading-tight text-[#333333]"
        style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
      >
        {blog.title}
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-[#545454] line-clamp-3">
        {stripHtml(blog.description)}
      </p>

      <p className="mt-2 text-xs text-[#8A8AAA]">{blog.date}</p>

      <div className="mt-auto grid grid-cols-1 gap-2 pt-5 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => onApprove(blog)}
          className="inline-flex items-center justify-center gap-1.5 rounded border border-green-600 bg-green-600 px-3 py-2 text-sm text-white transition hover:brightness-95"
        >
          <CheckCircle2 size={14} aria-hidden="true" />
          Approve
        </button>
        <button
          type="button"
          onClick={() => onReject(blog)}
          className="inline-flex items-center justify-center gap-1.5 rounded border border-red-500 bg-white px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
        >
          <XCircle size={14} aria-hidden="true" />
          Reject
        </button>
        <button
          type="button"
          onClick={() => onDelete(blog.id)}
          className="inline-flex items-center justify-center gap-1.5 rounded border border-[#6E35AE] bg-white px-3 py-2 text-sm text-[#6E35AE] transition hover:bg-[#F8F4FD]"
        >
          Delete
        </button>
      </div>
    </div>
  </article>
);

export default Blog;
