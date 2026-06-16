import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import BlogHeader from "./components/BlogHeader";
import CategoryFilters from "./components/CategoryFilters";
import BlogCard from "./components/BlogCard";
import BlogModal from "./components/BlogModal";

const BLOG_CATEGORIES = [
  "All",
  "Spiritual Guidance",
  "Consultancy Tips",
  "Platform Updates",
  "Articles",
];

const INITIAL_BLOG_ITEMS = [
  {
    id: 1,
    category: "Spiritual Guidance",
    title: "Finding Inner Peace in a Chaotic World",
    description:
      "Discover practical steps to maintain your spiritual balance amidst the daily hustle and bustle of modern life.",
    date: "Oct 24, 2023",
    author: "Sarah Jenkins",
    image:
      "https://www.figma.com/api/mcp/asset/4c79d3c9-261a-4ed8-9dfe-5cf588879408",
  },
  {
    id: 2,
    category: "Consultancy Tips",
    title: "5 Tips for Better Business Consultancy",
    description:
      "Learn the core principles that will help you build trust and deliver exceptional value to your clients.",
    date: "Oct 24, 2023",
    author: "Sarah Jenkins",
    image:
      "https://www.figma.com/api/mcp/asset/7c063aa3-f477-4dd5-8818-e5bbd51980eb",
  },
  {
    id: 3,
    category: "Platform Updates",
    title: "SoulGuide Platform Update: Version 2.0",
    description:
      "We are excited to announce new features including real-time chat and enhanced spiritual matching algorithms.",
    date: "Oct 24, 2023",
    author: "Sarah Jenkins",
    image:
      "https://www.figma.com/api/mcp/asset/1764a59e-6ca6-4456-bbec-f4bffb8f55c4",
  },
  {
    id: 4,
    category: "Articles",
    title: "Finding Inner Peace in a Chaotic World",
    description:
      "Discover practical steps to maintain your spiritual balance amidst the daily hustle and bustle of modern life.",
    date: "Oct 24, 2023",
    author: "Sarah Jenkins",
    image:
      "https://www.figma.com/api/mcp/asset/77d56286-0319-4293-8d0e-48ca15ff077f",
  },
];

const EMPTY_FORM = {
  name: "",
  title: "",
  category: "Spiritual Guidance",
  description: "",
  image: "",
};

const MODAL_CLOSE_ANIMATION_MS = 280;

const Blog = () => {
  const [blogs, setBlogs] = useState(INITIAL_BLOG_ITEMS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [pendingReset, setPendingReset] = useState(false);
  const closeTimerRef = useRef(null);

  const filteredBlogs = useMemo(() => {
    if (activeCategory === "All") return blogs;
    return blogs.filter((blog) => blog.category === activeCategory);
  }, [activeCategory, blogs]);

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
      name: blog.author,
      title: blog.title,
      category: blog.category,
      description: blog.description,
      image: blog.image,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, image: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (event) => {
    event.preventDefault();

    const preparedTitle = formData.title.trim();
    const preparedDescription = formData.description.trim();
    const preparedAuthor = formData.name.trim() || "Admin";

    if (!preparedTitle || !preparedDescription) return;

    if (editingBlogId) {
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === editingBlogId
            ? {
                ...blog,
                author: preparedAuthor,
                title: preparedTitle,
                category: formData.category,
                description: preparedDescription,
                image: formData.image || blog.image,
              }
            : blog,
        ),
      );
    } else {
      const nextId = blogs.length
        ? Math.max(...blogs.map((blog) => blog.id)) + 1
        : 1;

      setBlogs((prevBlogs) => [
        {
          id: nextId,
          author: preparedAuthor,
          title: preparedTitle,
          category: formData.category,
          description: preparedDescription,
          image:
            formData.image ||
            "https://www.figma.com/api/mcp/asset/4c79d3c9-261a-4ed8-9dfe-5cf588879408",
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        },
        ...prevBlogs,
      ]);
    }

    setPendingReset(true);
    handleCloseModal();
  };

  const isEditMode = Boolean(editingBlogId);

  return (
    <section className="space-y-8">
      {/* Blog Page Header */}
      <BlogHeader onAddClick={handleOpenCreate} />

      {/* Category Filters */}
      <CategoryFilters
        categories={BLOG_CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Blog Cards Grid */}
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
        categories={BLOG_CATEGORIES}
      />
    </section>
  );
};

export default Blog;
