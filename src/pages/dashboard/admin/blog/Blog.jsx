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
  useGetAllBlogCategoriesQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from "../../../../features/api/blogApi";

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

const Blog = () => {
  const { data: blogsData, isLoading: isBlogsLoading } = useGetBlogsQuery();
  const { data: categoriesData } = useGetAllBlogCategoriesQuery();
  const [createBlog] = useCreateBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();

  const [activeCategory, setActiveCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [pendingReset, setPendingReset] = useState(false);
  const closeTimerRef = useRef(null);

  const blogCategories = useMemo(() => {
    return categoriesData?.categories || [];
  }, [categoriesData]);

  const filterCategoriesList = useMemo(() => {
    return ["All", ...blogCategories.map((c) => c.name)];
  }, [blogCategories]);

  const normalizedBlogs = useMemo(() => {
    const rawBlogs = blogsData?.blogs || [];
    return rawBlogs.map((b) => ({
      id: b.id,
      category: b.category?.name || "Uncategorized",
      categoryId: b.categoryId,
      title: b.title,
      description: b.content || "",
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
      image: Array.isArray(b.image)
        ? b.image[0] || null
        : b.image || null,
    }));
  }, [blogsData]);

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
      title: blog.title,
      slug: blog.slug || "",
      categoryId: blog.categoryId || "",
      content: blog.description || "",
      image: blog.image || "",
      imageFile: null,
      status: blog.status || "PUBLISHED",
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

    try {
      await deleteBlog(id).unwrap();
      toast.success("Blog deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete blog");
    }
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

  const handleSave = async (event) => {
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

    const formDataToSend = new FormData();
    formDataToSend.append("title", preparedTitle);
    formDataToSend.append("slug", preparedSlug);
    formDataToSend.append("categoryId", formData.categoryId);
    formDataToSend.append("content", preparedContent);
    formDataToSend.append("status", formData.status);
    if (formData.imageFile) {
      formDataToSend.append("image", formData.imageFile);
    }

    try {
      if (editingBlogId) {
        await updateBlog({ id: editingBlogId, body: formDataToSend }).unwrap();
        toast.success("Blog updated successfully");
      } else {
        await createBlog(formDataToSend).unwrap();
        toast.success("Blog created successfully");
      }
      setPendingReset(true);
      handleCloseModal();
    } catch (err) {
      console.error("Save blog API error:", err);
      if (err?.data?.errors) {
        console.error("Nested validation errors:", err.data.errors);
        const details = Array.isArray(err.data.errors)
          ? err.data.errors.map((e) => `${e.field || e.path || ""}: ${e.message || e}`).join(", ")
          : JSON.stringify(err.data.errors);
        toast.error(`Validation Error: ${details}`);
      } else {
        toast.error(err?.data?.message || "Failed to save blog");
      }
    }
  };

  const isEditMode = Boolean(editingBlogId);

  return (
    <section className="space-y-8">
      {/* Blog Page Header */}
      <BlogHeader onAddClick={handleOpenCreate} />

      {/* Category Filters */}
      <CategoryFilters
        categories={filterCategoriesList}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Blog Cards Grid */}
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
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {filteredBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Blog Form Modal */}
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
