const DEFAULT_EDITOR_VERSION = "2.30.8";

const SUPPORTED_BLOCK_TYPES = new Set([
  "paragraph",
  "header",
  "list",
  "quote",
  "code",
  "image",
]);

const isRecord = (value) =>
  value != null && typeof value === "object" && !Array.isArray(value);

const sanitizeText = (value) => (typeof value === "string" ? value.trim() : "");

const safeJsonParse = (value) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!(trimmed.startsWith("{") || trimmed.startsWith("["))) return value;
  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
};

const decodeHtml = (html) => {
  if (!html || typeof html !== "string") return "";
  if (typeof document === "undefined") {
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, " ")
      .trim();
  }

  const temp = document.createElement("div");
  temp.innerHTML = html;
  return (temp.textContent || temp.innerText || "").replace(/\s+/g, " ").trim();
};

export const createEmptyEditorJsData = () => ({
  time: Date.now(),
  blocks: [],
  version: DEFAULT_EDITOR_VERSION,
});

export const isEditorJsData = (value) => {
  const parsed = safeJsonParse(value);
  return isRecord(parsed) && Array.isArray(parsed.blocks);
};

const normalizeListItems = (items) => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (typeof item === "string") return sanitizeText(item);
      if (!isRecord(item)) return null;

      const content = sanitizeText(item.content);
      const childItems = normalizeListItems(item.items);
      if (!content && childItems.length === 0) return null;

      return {
        content,
        items: childItems,
      };
    })
    .filter(Boolean);
};

const normalizeBlock = (block) => {
  if (!isRecord(block) || !SUPPORTED_BLOCK_TYPES.has(block.type)) return null;

  if (block.type === "header") {
    const level = Number(block?.data?.level);
    return {
      type: "header",
      data: {
        text: sanitizeText(block?.data?.text),
        level: Number.isInteger(level) && level >= 1 && level <= 3 ? level : 2,
      },
    };
  }

  if (block.type === "paragraph") {
    return {
      type: "paragraph",
      data: {
        text: sanitizeText(block?.data?.text),
      },
    };
  }

  if (block.type === "quote") {
    return {
      type: "quote",
      data: {
        text: sanitizeText(block?.data?.text),
        caption: sanitizeText(block?.data?.caption),
        alignment: sanitizeText(block?.data?.alignment) || "left",
      },
    };
  }

  if (block.type === "code") {
    return {
      type: "code",
      data: {
        code: typeof block?.data?.code === "string" ? block.data.code : "",
      },
    };
  }

  if (block.type === "image") {
    const imageUrl =
      sanitizeText(block?.data?.file?.url) ||
      sanitizeText(block?.data?.url) ||
      sanitizeText(block?.data?.src);

    if (!imageUrl) return null;

    return {
      type: "image",
      data: {
        file: { url: imageUrl },
        caption: sanitizeText(block?.data?.caption),
        withBorder: Boolean(block?.data?.withBorder),
        withBackground: Boolean(block?.data?.withBackground),
        stretched: Boolean(block?.data?.stretched),
      },
    };
  }

  if (block.type === "list") {
    const style = block?.data?.style === "ordered" ? "ordered" : "unordered";
    const items = normalizeListItems(block?.data?.items || []);

    if (items.length === 0) return null;

    return {
      type: "list",
      data: {
        style,
        items,
      },
    };
  }

  return null;
};

export const normalizeEditorJsData = (value) => {
  const parsed = safeJsonParse(value);

  if (isRecord(parsed) && ("en" in parsed || "nl" in parsed)) {
    return normalizeEditorJsData(parsed.en ?? parsed.nl ?? null);
  }

  if (isRecord(parsed) && Array.isArray(parsed.blocks)) {
    return {
      time: typeof parsed.time === "number" ? parsed.time : Date.now(),
      version:
        typeof parsed.version === "string" && parsed.version.trim()
          ? parsed.version
          : DEFAULT_EDITOR_VERSION,
      blocks: parsed.blocks.map(normalizeBlock).filter(Boolean),
    };
  }

  if (typeof parsed === "string") {
    const text = decodeHtml(parsed);
    if (!text) return createEmptyEditorJsData();
    return {
      time: Date.now(),
      version: DEFAULT_EDITOR_VERSION,
      blocks: [
        {
          type: "paragraph",
          data: { text },
        },
      ],
    };
  }

  return createEmptyEditorJsData();
};

const flattenListItemsToText = (items) => {
  if (!Array.isArray(items)) return [];

  return items.flatMap((item) => {
    if (typeof item === "string") return [decodeHtml(item)];
    if (!isRecord(item)) return [];

    const current = decodeHtml(item.content || "");
    const nested = flattenListItemsToText(item.items || []);
    return [current, ...nested].filter(Boolean);
  });
};

export const editorJsToPlainText = (value) => {
  const data = normalizeEditorJsData(value);
  const lines = data.blocks.flatMap((block) => {
    if (block.type === "paragraph") return [decodeHtml(block.data?.text || "")];
    if (block.type === "header") return [decodeHtml(block.data?.text || "")];
    if (block.type === "quote") {
      return [
        decodeHtml(block.data?.text || ""),
        decodeHtml(block.data?.caption || ""),
      ];
    }
    if (block.type === "code") return [block.data?.code || ""];
    if (block.type === "list")
      return flattenListItemsToText(block.data?.items || []);
    return [];
  });

  return lines.join(" ").replace(/\s+/g, " ").trim();
};

export const isEditorJsContentEmpty = (value) => {
  const data = normalizeEditorJsData(value);

  const hasImage = data.blocks.some(
    (block) => block.type === "image" && Boolean(block?.data?.file?.url),
  );
  if (hasImage) return false;

  return editorJsToPlainText(data).length === 0;
};

export const toI18nEditorJsContent = (value) => {
  const normalized = normalizeEditorJsData(value);
  return {
    en: normalized,
    nl: normalized,
  };
};
