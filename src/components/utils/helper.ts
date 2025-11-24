// Get country code for phone number based on locale
export const getPhoneCountryCode = (locale: string | null | undefined | false): string => {
  if (locale === 'en-GB') return '44';
  if (locale === 'en-AU') return '61';
  return '1'; // Default to US
};

// Format phone number with country code in standard format
export const formatPhoneNumberWithCountryCode = (
  phoneNumber: string,
  locale: string | null | undefined | false
): string => {
  if (!phoneNumber) return phoneNumber;

  // Remove any existing formatting (dashes, spaces, parentheses, etc.)
  const cleanedNumber = phoneNumber.replace(/[^\d+]/g, '');

  // If it already starts with +, remove it and process
  let digits = cleanedNumber.startsWith('+') ? cleanedNumber.substring(1) : cleanedNumber;

  // Get country code
  const countryCode = getPhoneCountryCode(locale);

  // Remove country code if already present at the start
  if (digits.startsWith(countryCode)) {
    digits = digits.substring(countryCode.length);
  }

  // Format based on locale
  if (locale === 'en-GB') {
    // UK format: 44-XXXX-XXXXXX or 44-XXXXX-XXXXX
    if (digits.length === 10) {
      return `${countryCode}-${digits.substring(0, 4)}-${digits.substring(4)}`;
    } else if (digits.length === 11) {
      return `${countryCode}-${digits.substring(0, 5)}-${digits.substring(5)}`;
    }
    return `${countryCode}-${digits}`;
  } else if (locale === 'en-AU') {
    // AUS format: 61-X-XXXX-XXXX
    if (digits.length === 9) {
      return `${countryCode}-${digits.substring(0, 1)}-${digits.substring(1, 5)}-${digits.substring(5)}`;
    } else if (digits.length === 10) {
      return `${countryCode}-${digits.substring(0, 2)}-${digits.substring(2, 6)}-${digits.substring(6)}`;
    }
    return `${countryCode}-${digits}`;
  } else {
    // US format: 1-XXX-XXX-XXXX
    if (digits.length === 10) {
      return `${countryCode}-${digits.substring(0, 3)}-${digits.substring(3, 6)}-${digits.substring(6)}`;
    } else if (digits.length === 11 && digits.startsWith('1')) {
      // Already has country code
      const localNumber = digits.substring(1);
      return `${countryCode}-${localNumber.substring(0, 3)}-${localNumber.substring(3, 6)}-${localNumber.substring(6)}`;
    }
    return `${countryCode}-${digits}`;
  }
};

