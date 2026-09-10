import React, { useEffect, useMemo, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import CodeTool from "@editorjs/code";
import ImageTool from "@editorjs/image";
import { Loader2 } from "lucide-react";
import {
  normalizeEditorJsData,
  createEmptyEditorJsData,
} from "../utils/editorjsContent";

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
  const initialDataRef = useRef(
    normalizeEditorJsData(value || createEmptyEditorJsData()),
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onImageUploadRef.current = onImageUpload;
  }, [onImageUpload]);

  useEffect(() => {
    const editor = new EditorJS({
      holder: holderId,
      readOnly,
      placeholder,
      data: initialDataRef.current,
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
                  throw new Error("Image upload handler is not configured");
                }

                setIsUploadingImage(true);
                try {
                  const url = await onImageUploadRef.current(file);
                  if (!url) {
                    throw new Error("Image upload did not return a URL");
                  }

                  return {
                    success: 1,
                    file: { url },
                  };
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
        const normalized = normalizeEditorJsData(output);
        lastSerializedRef.current = JSON.stringify(normalized);
        onChangeRef.current(normalized);
      },
      async onReady() {
        isReadyRef.current = true;
        const saved = await editor.saver.save();
        const normalized = normalizeEditorJsData(saved);
        lastSerializedRef.current = JSON.stringify(normalized);
      },
    });

    editorRef.current = editor;

    return () => {
      isReadyRef.current = false;
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
      }
      editorRef.current = null;
    };
  }, [holderId, placeholder, readOnly]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !isReadyRef.current) return;

    const normalized = normalizeEditorJsData(
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
      <div className="relative mt-2 rounded border border-[#D4D4D4] bg-[#E8E8E8]">
        <div id={holderId} className="editorjs-min-h px-3 py-3" />
        {isUploadingImage && (
          <div className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1 rounded bg-white/90 px-2 py-1 text-xs text-[#545454] ring-1 ring-[#D7D7D7]">
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

        .rich-text-editor .editorjs-min-h .ce-block__content,
        .rich-text-editor .editorjs-min-h .ce-toolbar__content {
          max-width: 100%;
        }

        .rich-text-editor .editorjs-min-h {
          min-height: 220px;
          max-height: 360px;
          overflow-y: auto;
          color: #333333;
        }

        .rich-text-editor .codex-editor__redactor {
          padding-bottom: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
