/** Map API field names to user-friendly labels */
const FIELD_LABELS = {
  routingNumber: 'IBAN',
  organisationName: 'Business / organisation name',
  accountNumber: 'BIC/SWIFT',
  amount: 'Amount',
  bsnNumber: 'BSN',
  kvkNumber: 'KvK number',
  cityOfResidence: 'City of residence',
  businessBankAccount: 'IBAN',
  idFrontUrl: 'ID front image',
  idBackUrl: 'ID back image',
};

const FRIENDLY_MESSAGES = {
  'Invalid IBAN format': 'Please enter a valid IBAN (example: NL91ABNA0417164300).',
  'IBAN is required': 'Please enter your business bank account (IBAN).',
  'BSN must be exactly 9 digits': 'BSN must be exactly 9 digits.',
  'KvK number must be exactly 8 digits': 'KvK number must be exactly 8 digits.',
  'City is required': 'Please enter your city of residence.',
  'Both ID front and ID back images are required': 'Please upload both the front and back of your ID.',
  'ID front image is required': 'Please upload the front of your ID.',
  'ID back image is required': 'Please upload the back of your ID.',
};

function humanizeMessage(message) {
  return FRIENDLY_MESSAGES[message] || message;
}

function parseZodIssuesFromMessage(message) {
  if (!message || typeof message !== 'string') return null;
  const trimmed = message.trim();
  if (!trimmed.startsWith('[')) return null;

  try {
    const parsed = JSON.parse(trimmed);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;

    return parsed
      .map((item) => {
        const fieldPath = Array.isArray(item.path) ? item.path.join('.') : item.path || 'Field';
        const label = FIELD_LABELS[fieldPath] || fieldPath;
        return `${label}: ${humanizeMessage(item.message)}`;
      })
      .join(' · ');
  } catch {
    return null;
  }
}

/**
 * Extract a readable message from RTK Query / API error responses.
 */
export function getApiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.data ?? error;

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors
      .map((item) => {
        const label = FIELD_LABELS[item.field] || item.field || 'Field';
        return `${label}: ${humanizeMessage(item.message)}`;
      })
      .join(' · ');
  }

  const parsedFromMessage = parseZodIssuesFromMessage(data?.message);
  if (parsedFromMessage) return parsedFromMessage;

  if (data?.message && typeof data.message === 'string' && !data.message.trim().startsWith('[')) {
    return humanizeMessage(data.message);
  }

  return error?.message || fallback;
}

/** Map API validation errors to { fieldName: message } for form fields */
export function getApiFieldErrors(error) {
  const data = error?.data ?? error;
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.reduce((acc, item) => {
      if (item?.field) {
        acc[item.field] = humanizeMessage(item.message);
      }
      return acc;
    }, {});
  }

  const parsed = parseZodIssuesFromMessage(data?.message);
  if (!parsed) return {};

  try {
    const issues = JSON.parse(data.message.trim());
    return issues.reduce((acc, item) => {
      const field = Array.isArray(item.path) ? item.path[0] : item.path;
      if (field) acc[field] = humanizeMessage(item.message);
      return acc;
    }, {});
  } catch {
    return {};
  }
}

/** Validate Dutch/EU IBAN (basic length + format check) */
export function validateIban(iban) {
  const cleaned = (iban || '').replace(/\s/g, '').toUpperCase();
  if (!cleaned) return 'Please enter your IBAN (bank account number).';
  if (cleaned.length < 15) {
    return 'IBAN must be at least 15 characters (e.g. NL91ABNA0417164300).';
  }
  if (cleaned.length > 34) {
    return 'IBAN cannot exceed 34 characters.';
  }
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(cleaned)) {
    return 'Invalid IBAN format. It should start with a country code (e.g. NL) followed by numbers.';
  }
  return null;
}

export function validateBsn(bsn) {
  const cleaned = (bsn || '').replace(/\D/g, '');
  if (cleaned.length !== 9) return 'BSN must be exactly 9 digits.';
  return null;
}

export function validateKvk(kvk) {
  const cleaned = (kvk || '').replace(/\D/g, '');
  if (cleaned.length !== 8) return 'KvK number must be exactly 8 digits.';
  return null;
}
