// Get country code for phone number based on locale
export const getPhoneCountryCode = (locale: string | null | undefined | false): string => {
  if (locale === 'en-GB') return '44';
  if (locale === 'en-AU') return '61';
  return '1'; // Default to US
};

// Format phone number with country code for tel: links
// Returns format: +[countryCode][digits] with no spaces or hyphens
export const formatPhoneNumberWithCountryCode = (
  phoneNumber: string,
  locale: string | null | undefined | false
): string => {
  if (!phoneNumber) return phoneNumber;

  // Remove any existing formatting (dashes, spaces, parentheses, etc.)
  // Keep only digits and + sign
  const cleanedNumber = phoneNumber.replace(/[^\d+]/g, '');

  // If it already starts with +, remove it and process
  let digits = cleanedNumber.startsWith('+') ? cleanedNumber.substring(1) : cleanedNumber;

  // Get country code
  const countryCode = getPhoneCountryCode(locale);

  // Remove country code if already present at the start
  if (digits.startsWith(countryCode)) {
    digits = digits.substring(countryCode.length);
  }

  // Return format: +[countryCode][digits] with no spaces or hyphens
  return `+${countryCode}${digits}`;
};

