import React, { useEffect, useMemo, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import CodeTool from "@editorjs/code";
import ImageTool from "@editorjs/image";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  normalizeEditorJsData,
  createEmptyEditorJsData,
  isEditorJsContentEmpty,
} from "../utils/editorjsContent";

const ensureSingleStarterBlock = (value) => {
  const normalized = normalizeEditorJsData(value || createEmptyEditorJsData());

  if (isEditorJsContentEmpty(normalized) || normalized.blocks.length === 0) {
    return {
      ...normalized,
      blocks: [{ type: "paragraph", data: { text: "" } }],
    };
  }

  // Drop accidental leading empty paragraphs so only one starter line shows.
  const blocks = [...normalized.blocks];
  while (
    blocks.length > 1 &&
    blocks[0]?.type === "paragraph" &&
    !String(blocks[0]?.data?.text || "").replace(/<[^>]*>/g, "").trim()
  ) {
    blocks.shift();
  }

  return { ...normalized, blocks };
};

const RichTextEditor = ({
  value,
  onChange,
  onImageUpload,
  placeholder = "Write detailed blog content here",
  className = "",
  readOnly = false,
}) => {
  const holderId = useMemo(
    () => `editorjs-holder-${Math.random().toString(36).slice(2, 10)}`,
    [],
  );
  const editorRef = useRef(null);
  const isReadyRef = useRef(false);
  const lastSerializedRef = useRef("");
  const onChangeRef = useRef(onChange);
  const onImageUploadRef = useRef(onImageUpload);
  const initialDataRef = useRef(ensureSingleStarterBlock(value));
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onImageUploadRef.current = onImageUpload;
  }, [onImageUpload]);

  useEffect(() => {
    const holder = document.getElementById(holderId);
    if (holder) holder.innerHTML = "";

    const editor = new EditorJS({
      holder: holderId,
      readOnly,
      placeholder,
      data: initialDataRef.current,
      autofocus: false,
      inlineToolbar: ["bold", "italic", "link"],
      tools: {
        header: {
          class: Header,
          inlineToolbar: ["bold", "italic", "link"],
          config: {
            levels: [1, 2, 3],
            defaultLevel: 2,
          },
        },
        paragraph: {
          inlineToolbar: ["bold", "italic", "link"],
          config: {
            preserveBlank: false,
          },
        },
        list: {
          class: List,
          inlineToolbar: ["bold", "italic", "link"],
          config: {
            defaultStyle: "unordered",
          },
        },
        quote: {
          class: Quote,
          inlineToolbar: ["bold", "italic", "link"],
          config: {
            quotePlaceholder: "Write a quote",
            captionPlaceholder: "Quote caption",
          },
        },
        code: {
          class: CodeTool,
        },
        image: {
          class: ImageTool,
          config: {
            uploader: {
              uploadByFile: async (file) => {
                if (!onImageUploadRef.current) {
                  toast.error("Image upload is not configured");
                  throw new Error("Image upload handler is not configured");
                }

                setIsUploadingImage(true);
                try {
                  const url = await onImageUploadRef.current(file);
                  if (!url) {
                    toast.error(
                      "Upload succeeded but no image URL was returned",
                    );
                    throw new Error("Image upload did not return a URL");
                  }

                  return {
                    success: 1,
                    file: { url },
                  };
                } catch (error) {
                  const message =
                    error?.data?.message ||
                    error?.message ||
                    "Failed to upload image";
                  toast.error(message);
                  throw error;
                } finally {
                  setIsUploadingImage(false);
                }
              },
            },
          },
        },
      },
      async onChange(api) {
        if (!onChangeRef.current) return;
        const output = await api.saver.save();
        const normalized = ensureSingleStarterBlock(output);
        lastSerializedRef.current = JSON.stringify(normalized);
        onChangeRef.current(normalized);
      },
      async onReady() {
        isReadyRef.current = true;
        const saved = await editor.saver.save();
        const normalized = ensureSingleStarterBlock(saved);
        lastSerializedRef.current = JSON.stringify(normalized);

        // If Editor.js created extra blank lines on init, collapse to one.
        if (JSON.stringify(saved) !== JSON.stringify(normalized)) {
          await editor.render(normalized);
        }
      },
    });

    editorRef.current = editor;

    return () => {
      isReadyRef.current = false;
      const current = editorRef.current;
      editorRef.current = null;
      if (current?.destroy) {
        current.destroy();
      }
      const holderNode = document.getElementById(holderId);
      if (holderNode) holderNode.innerHTML = "";
    };
  }, [holderId, placeholder, readOnly]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !isReadyRef.current) return;

    const normalized = ensureSingleStarterBlock(
      value || createEmptyEditorJsData(),
    );
    const serialized = JSON.stringify(normalized);
    if (serialized === lastSerializedRef.current) return;

    editor
      .render(normalized)
      .then(() => {
        lastSerializedRef.current = serialized;
      })
      .catch(() => {
        // Keep editor interactive even if external content is malformed.
      });
  }, [value]);

  return (
    <div className={`rich-text-editor ${className}`.trim()}>
      <div className="rounded border border-[#D4D4D4] bg-[#F7F7F7] p-2 text-xs text-[#6A6A6A]">
        Toolbar: H1, H2, H3, Bold, Italic, Lists, Link, Quote, Code, Image
      </div>
      <div className="relative mt-2 overflow-visible rounded border border-[#D4D4D4] bg-[#E8E8E8]">
        <div id={holderId} className="editorjs-min-h px-3 py-3" />
        {isUploadingImage && (
          <div className="pointer-events-none absolute right-3 top-3 z-[80] inline-flex items-center gap-1 rounded bg-white/90 px-2 py-1 text-xs text-[#545454] ring-1 ring-[#D7D7D7]">
            <Loader2 size={13} className="animate-spin" aria-hidden="true" />
            Uploading image...
          </div>
        )}
      </div>

      <style>{`
        .rich-text-editor:focus-within {
          outline: 2px solid rgba(110, 53, 174, 0.35);
          outline-offset: 0;
          border-radius: 4px;
        }

        /* Leave room for Editor.js + / settings buttons outside the block */
        .rich-text-editor .editorjs-min-h {
          min-height: 200px;
          overflow: visible;
          color: #333333;
          padding-left: 56px;
          padding-right: 56px;
        }

        .rich-text-editor .editorjs-min-h .ce-block__content,
        .rich-text-editor .editorjs-min-h .ce-toolbar__content {
          max-width: 100%;
          margin-left: 0;
          margin-right: 0;
        }

        .rich-text-editor .codex-editor__redactor {
          padding-bottom: 48px !important;
        }

        /* Only show placeholder on the focused/active empty block */
        .rich-text-editor .ce-paragraph[data-placeholder-active]:not(.ce-paragraph--empty)::before,
        .rich-text-editor .codex-editor--empty .ce-paragraph[data-placeholder-active]::before {
          opacity: 1;
        }

        .rich-text-editor .ce-paragraph[data-placeholder]:empty::before,
        .rich-text-editor .ce-paragraph[data-placeholder-active]:empty::before {
          color: #8a8a8a;
        }

        .rich-text-editor .ce-toolbar,
        .rich-text-editor .ce-toolbox,
        .rich-text-editor .ce-inline-toolbar,
        .rich-text-editor .ce-conversion-toolbar,
        .rich-text-editor .ce-settings,
        .rich-text-editor .ce-popover {
          z-index: 70 !important;
        }

        .rich-text-editor .ce-toolbar__plus,
        .rich-text-editor .ce-toolbar__settings-btn {
          color: #545454;
          background: #ffffff;
          border: 1px solid #d4d4d4;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
        }

        .rich-text-editor .ce-toolbar__plus:hover,
        .rich-text-editor .ce-toolbar__settings-btn:hover {
          color: #6e35ae;
          border-color: #c4a8e8;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
