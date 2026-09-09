import React, { useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const DEFAULT_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

const DEFAULT_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "blockquote",
  "code-block",
  "align",
  "link",
];

/**
 * Reusable Quill-based rich text editor.
 * Controlled via `value` (HTML string) and `onChange(html)`.
 */
const RichTextEditor = ({
  value = "",
  onChange,
  placeholder = "Write detailed blog content here",
  className = "",
  readOnly = false,
}) => {
  const modules = useMemo(() => DEFAULT_MODULES, []);
  const formats = useMemo(() => DEFAULT_FORMATS, []);

  return (
    <div className={`rich-text-editor ${className}`.trim()}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
      />
      <style>{`
        .rich-text-editor .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid #d4d4d4;
          background: #f0f0f0;
          border-radius: 4px 4px 0 0;
          padding: 8px;
        }
        .rich-text-editor .ql-container.ql-snow {
          border: none;
          background: #e8e8e8;
          border-radius: 0 0 4px 4px;
          font-size: 1rem;
          color: #333333;
          min-height: 160px;
        }
        .rich-text-editor .ql-editor {
          min-height: 160px;
          max-height: 280px;
          overflow-y: auto;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #8a8a8a;
          font-style: normal;
        }
        .rich-text-editor .ql-snow .ql-stroke {
          stroke: #545454;
        }
        .rich-text-editor .ql-snow .ql-fill {
          fill: #545454;
        }
        .rich-text-editor .ql-snow .ql-picker {
          color: #333333;
        }
        .rich-text-editor:focus-within {
          outline: 2px solid rgba(110, 53, 174, 0.35);
          outline-offset: 0;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
