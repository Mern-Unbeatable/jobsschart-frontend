import React from "react";
import { sanitizeHtml } from "../utils/sanitizeHtml";
import {
  normalizeEditorJsData,
  isEditorJsContentEmpty,
} from "../utils/editorjsContent";

const sanitizeInline = (value) => sanitizeHtml(value || "");

const renderListItems = (items = [], depth = 0) => {
  if (!Array.isArray(items) || items.length === 0) return null;

  return items.map((item, index) => {
    const key = `${depth}-${index}`;

    if (typeof item === "string") {
      return (
        <li
          key={key}
          dangerouslySetInnerHTML={{ __html: sanitizeInline(item) }}
        />
      );
    }

    const text = sanitizeInline(item?.content || "");
    const nested = renderListItems(item?.items || [], depth + 1);
    if (!text && !nested) return null;

    return (
      <li key={key}>
        {text && <span dangerouslySetInnerHTML={{ __html: text }} />}
        {nested && <ul className="mt-2 list-disc pl-6">{nested}</ul>}
      </li>
    );
  });
};

const BlogRichContent = ({ content = "", className = "" }) => {
  const data = normalizeEditorJsData(content);

  if (isEditorJsContentEmpty(data)) return null;

  return (
    <div className={`blog-rich-content ${className}`.trim()}>
      {data.blocks.map((block, index) => {
        if (block.type === "header") {
          const safeHtml = sanitizeInline(block?.data?.text || "");
          if (!safeHtml) return null;

          const level = Number(block?.data?.level) || 2;
          if (level === 1) {
            return (
              <h1
                key={index}
                className="mt-6 text-4xl font-semibold leading-tight text-[#1F2937]"
                dangerouslySetInnerHTML={{ __html: safeHtml }}
              />
            );
          }
          if (level === 3) {
            return (
              <h3
                key={index}
                className="mt-5 text-xl font-semibold leading-snug text-[#1F2937]"
                dangerouslySetInnerHTML={{ __html: safeHtml }}
              />
            );
          }
          return (
            <h2
              key={index}
              className="mt-5 text-3xl font-semibold leading-snug text-[#1F2937]"
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
          );
        }

        if (block.type === "paragraph") {
          const safeHtml = sanitizeInline(block?.data?.text || "");
          if (!safeHtml) return null;
          return (
            <p
              key={index}
              className="mt-4 leading-8 text-[#4B5563]"
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
          );
        }

        if (block.type === "quote") {
          const quoteHtml = sanitizeInline(block?.data?.text || "");
          const captionHtml = sanitizeInline(block?.data?.caption || "");
          if (!quoteHtml && !captionHtml) return null;

          return (
            <blockquote
              key={index}
              className="mt-5 rounded-r-lg border-l-4 border-green-500/60 bg-green-50/60 px-4 py-3"
            >
              {quoteHtml && (
                <p
                  className="text-[#374151]"
                  dangerouslySetInnerHTML={{ __html: quoteHtml }}
                />
              )}
              {captionHtml && (
                <footer
                  className="mt-2 text-sm text-[#6B7280]"
                  dangerouslySetInnerHTML={{ __html: captionHtml }}
                />
              )}
            </blockquote>
          );
        }

        if (block.type === "code") {
          const codeText = block?.data?.code || "";
          if (!codeText.trim()) return null;

          return (
            <pre
              key={index}
              className="mt-5 overflow-x-auto rounded-lg bg-[#111827] px-4 py-3 text-sm text-[#E5E7EB]"
            >
              <code>{codeText}</code>
            </pre>
          );
        }

        if (block.type === "list") {
          const items = renderListItems(block?.data?.items || []);
          if (!items) return null;

          const isOrdered = block?.data?.style === "ordered";
          const Tag = isOrdered ? "ol" : "ul";
          const listClass = isOrdered
            ? "mt-4 list-decimal space-y-1 pl-6 text-[#4B5563]"
            : "mt-4 list-disc space-y-1 pl-6 text-[#4B5563]";

          return (
            <Tag key={index} className={listClass}>
              {items}
            </Tag>
          );
        }

        if (block.type === "image") {
          const imageUrl = block?.data?.file?.url;
          if (!imageUrl) return null;

          return (
            <figure key={index} className="mt-6">
              <img
                src={imageUrl}
                alt={block?.data?.caption || "Blog image"}
                className="w-full rounded-xl object-cover"
                loading="lazy"
              />
              {block?.data?.caption && (
                <figcaption
                  className="mt-2 text-center text-sm text-[#6B7280]"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeInline(block.data.caption),
                  }}
                />
              )}
            </figure>
          );
        }

        return null;
      })}
    </div>
  );
};

export default BlogRichContent;
