import React from "react";
import "react-quill/dist/quill.snow.css";
import { sanitizeHtml } from "../utils/sanitizeHtml";

/**
 * Read-only Quill HTML renderer — uses Quill snow theme styles so
 * headings, lists, quotes, links, etc. match the editor.
 */
const BlogRichContent = ({ html = "", className = "" }) => {
  const safeHtml = sanitizeHtml(html);

  if (!safeHtml) return null;

  return (
    <div className={`blog-rich-content ql-snow ${className}`.trim()}>
      <div
        className="ql-editor"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    </div>
  );
};

export default BlogRichContent;
