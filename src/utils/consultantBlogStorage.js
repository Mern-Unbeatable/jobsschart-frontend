const STORAGE_KEY = "consultant_blogs_v1";

const readAll = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeAll = (blogs) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
};

export const LOCAL_BLOG_CATEGORIES = [
  { id: "spirituality", name: "Spirituality" },
  { id: "wellness", name: "Wellness" },
  { id: "guidance", name: "Guidance" },
  { id: "lifestyle", name: "Lifestyle" },
];

export const getConsultantBlogs = (userId) => {
  const blogs = readAll();
  if (!userId) return blogs;
  return blogs.filter((b) => String(b.userId) === String(userId));
};

export const getPendingConsultantBlogs = () =>
  readAll().filter((b) => b.status === "DRAFT");

export const createConsultantBlog = (blog) => {
  const blogs = readAll();
  const next = {
    ...blog,
    id: blog.id || `cb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: blog.createdAt || new Date().toISOString(),
    status: "DRAFT",
  };
  writeAll([next, ...blogs]);
  return next;
};

export const updateConsultantBlog = (id, patch) => {
  const blogs = readAll();
  const index = blogs.findIndex((b) => String(b.id) === String(id));
  if (index === -1) return null;

  const updated = { ...blogs[index], ...patch, updatedAt: new Date().toISOString() };
  blogs[index] = updated;
  writeAll(blogs);
  return updated;
};

export const deleteConsultantBlog = (id) => {
  const blogs = readAll().filter((b) => String(b.id) !== String(id));
  writeAll(blogs);
};

export const approveConsultantBlog = (id) =>
  updateConsultantBlog(id, { status: "PUBLISHED" });
