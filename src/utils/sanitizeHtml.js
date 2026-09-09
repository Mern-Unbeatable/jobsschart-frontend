import DOMPurify from "dompurify";

const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "h1",
    "h2",
    "h3",
    "h4",
    "ul",
    "ol",
    "li",
    "blockquote",
    "pre",
    "code",
    "a",
    "span",
  ],
  ALLOWED_ATTR: ["href", "target", "rel", "class", "style"],
  ALLOW_DATA_ATTR: false,
};

let hooksRegistered = false;

const ensureHooks = () => {
  if (hooksRegistered || typeof window === "undefined") return;
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A") {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }
  });
  hooksRegistered = true;
};

/** Sanitize Quill/HTML content for safe storage and rendering. */
export const sanitizeHtml = (html = "") => {
  if (!html || typeof html !== "string") return "";
  ensureHooks();
  return DOMPurify.sanitize(html, PURIFY_CONFIG).trim();
};

/** True when HTML has no meaningful text (e.g. empty Quill `<p><br></p>`). */
export const isEmptyHtml = (html = "") => {
  if (!html || typeof html !== "string") return true;
  const text = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, "")
    .trim();
  return text.length === 0;
};

/** Strip tags for plain-text excerpts in cards/lists. */
export const stripHtml = (html = "") => {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
};
