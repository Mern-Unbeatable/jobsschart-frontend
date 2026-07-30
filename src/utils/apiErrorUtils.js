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

/**
 * Extract a readable message from RTK Query / API error responses.
 * Handles { message, errors: [{ field, message }] } shape from backend validation.
 */
export function getApiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.data ?? error;

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors
      .map((item) => {
        const label = FIELD_LABELS[item.field] || item.field || 'Field';
        return `${label}: ${item.message}`;
      })
      .join(' · ');
  }

  return data?.message || error?.message || fallback;
}

/** Map API validation errors to { fieldName: message } for form fields */
export function getApiFieldErrors(error) {
  const data = error?.data ?? error;
  if (!Array.isArray(data?.errors)) return {};

  return data.errors.reduce((acc, item) => {
    if (item?.field) {
      acc[item.field] = item.message;
    }
    return acc;
  }, {});
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
