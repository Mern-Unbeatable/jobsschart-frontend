import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import BlogHeader from "../../admin/blog/components/BlogHeader";
import CategoryFilters from "../../admin/blog/components/CategoryFilters";
import BlogCard from "../../admin/blog/components/BlogCard";
import BlogModal from "../../admin/blog/components/BlogModal";
import { selectUser } from "../../../../features/slices/authSlice";
import {
  LOCAL_BLOG_CATEGORIES,
  getConsultantBlogs,
  createConsultantBlog,
  updateConsultantBlog,
  deleteConsultantBlog,
} from "../../../../utils/consultantBlogStorage";

const EMPTY_FORM = {
  title: "",
  slug: "",
  categoryId: "",
  content: "",
  image: "",
  imageFile: null,
  status: "DRAFT",
};

const MODAL_CLOSE_ANIMATION_MS = 280;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

const Blog = () => {
  const currentUser = useSelector(selectUser);
  const currentUserId = currentUser?.id;

  const [activeTab, setActiveTab] = useState("PUBLISHED");
  const [blogs, setBlogs] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [pendingReset, setPendingReset] = useState(false);
  const closeTimerRef = useRef(null);

  const refreshBlogs = useCallback(() => {
    setBlogs(getConsultantBlogs(currentUserId));
  }, [currentUserId]);

  useEffect(() => {
    refreshBlogs();
  }, [refreshBlogs]);

  const filterCategoriesList = useMemo(
    () => ["All", ...LOCAL_BLOG_CATEGORIES.map((c) => c.name)],
    [],
  );

  const normalizedBlogs = useMemo(() => {
    return blogs
      .filter((b) => b.status === activeTab)
      .map((b) => {
        const category =
          LOCAL_BLOG_CATEGORIES.find((c) => c.id === b.categoryId)?.name ||
          b.category ||
          "Uncategorized";

        return {
          id: b.id,
          category,
          categoryId: b.categoryId,
          title: b.title,
          description: b.content,
          slug: b.slug,
          status: b.status,
          date: formatDate(b.createdAt),
          author: b.author || currentUser?.name || "You",
          image: b.image || null,
        };
      });
  }, [blogs, activeTab, currentUser?.name]);

  const filteredBlogs = useMemo(() => {
    if (activeCategory === "All") return normalizedBlogs;
    return normalizedBlogs.filter((blog) => blog.category === activeCategory);
  }, [activeCategory, normalizedBlogs]);

  const handleCloseModal = useCallback(() => {
    if (!isModalOpen || isModalClosing) return;

    setIsModalClosing(true);

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

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
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
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
    setFormData(EMPTY_FORM);
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
    setFormData({
      title: blog.title || "",
      slug: blog.slug || "",
      categoryId: blog.categoryId || "",
      content: blog.description || "",
      image: blog.image || "",
      imageFile: null,
      status: "DRAFT",
    });
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

    deleteConsultantBlog(id);
    refreshBlogs();
    toast.success("Blog deleted successfully");
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, imageFile: file }));

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, image: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (event) => {
    event.preventDefault();

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

    const categoryName =
      LOCAL_BLOG_CATEGORIES.find((c) => c.id === formData.categoryId)?.name ||
      "Uncategorized";

    const payload = {
      userId: currentUserId,
      author: currentUser?.name || "Consultant",
      title: preparedTitle,
      slug: preparedSlug,
      categoryId: formData.categoryId,
      category: categoryName,
      content: preparedContent,
      image: formData.image || null,
      status: "DRAFT",
    };

    if (editingBlogId) {
      updateConsultantBlog(editingBlogId, payload);
      toast.success("Blog updated and submitted for admin approval");
    } else {
      createConsultantBlog(payload);
      toast.success("Blog submitted for admin approval");
    }

    refreshBlogs();
    setPendingReset(true);
    handleCloseModal();
    setActiveTab("DRAFT");
    setActiveCategory("All");
  };

  const isEditMode = Boolean(editingBlogId);

  return (
    <section className="space-y-8">
      <BlogHeader onAddClick={handleOpenCreate} />

      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-white border border-[#E8E8E8] rounded-lg px-2 py-2 w-full sm:w-fit">
        <button
          type="button"
          onClick={() => {
            setActiveTab("PUBLISHED");
            setActiveCategory("All");
          }}
          className={`flex-1 sm:flex-none px-5 py-1.5 rounded-md text-base font-medium transition-colors ${
            activeTab === "PUBLISHED"
              ? "bg-green-500/60 text-white"
              : "text-[#545454] hover:bg-gray-100"
          }`}
        >
          Published
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("DRAFT");
            setActiveCategory("All");
          }}
          className={`flex-1 sm:flex-none px-5 py-1.5 rounded-md text-base font-medium transition-colors ${
            activeTab === "DRAFT"
              ? "bg-green-500/60 text-white"
              : "text-[#545454] hover:bg-gray-100"
          }`}
        >
          Pending Approval
        </button>
      </div>

      <CategoryFilters
        categories={filterCategoriesList}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {filteredBlogs.length === 0 ? (
        <div className="py-24 text-center text-base text-gray-400">
          {activeTab === "DRAFT"
            ? "No blogs waiting for approval."
            : "No published blogs yet. Submit a blog for admin approval to get started."}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {filteredBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              draftStatusLabel="Pending Approval"
            />
          ))}
        </div>
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
        categories={LOCAL_BLOG_CATEGORIES}
        requireApproval
      />
    </section>
  );
};

export default Blog;
