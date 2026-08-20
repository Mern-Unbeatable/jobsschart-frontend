/**
 * Read a CMS field stored as { en, nl } or a legacy plain string.
 */
export function resolveI18n(value, locale = 'en') {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && !Array.isArray(value)) {
    const lang = String(locale).toLowerCase().startsWith('nl') ? 'nl' : 'en';
    return value[lang] ?? value.en ?? value.nl ?? '';
  }
  return String(value);
}

export function isI18nField(value) {
  return (
    value != null
    && typeof value === 'object'
    && !Array.isArray(value)
    && ('en' in value || 'nl' in value)
  );
}

/** Read i18n list fields like features: { en: [], nl: [] } or a plain array. */
export function resolveI18nArray(value, locale = 'en') {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') {
    const lang = String(locale).toLowerCase().startsWith('nl') ? 'nl' : 'en';
    const arr = value[lang] ?? value.en ?? value.nl ?? [];
    return Array.isArray(arr) ? arr : [];
  }
  return [];
}
