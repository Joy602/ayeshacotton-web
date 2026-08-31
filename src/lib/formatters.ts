/**
 * Utility functions for Bengali numbers and currency formatting
 */

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/**
 * Converts English digits (0-9) to Bengali digits (০-৯)
 * Keeps commas, dots, and other characters intact
 */
export const toBengaliNumber = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === '') return '';
  const str = typeof value === 'number' ? value.toLocaleString('en-US') : String(value);
  return str.replace(/[0-9]/g, (digit) => BENGALI_DIGITS[+digit] ?? digit);
};

/**
 * Formats a numerical price into Bengali currency representation
 * Example: 1550 -> "১,৫৫০ ৳"
 */
export const formatPrice = (price: number | string | null | undefined, symbol = '৳'): string => {
  if (price === null || price === undefined || price === '') return `০ ${symbol}`;
  const num = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, '')) || 0 : price;
  const englishFormatted = num.toLocaleString('en-US');
  const bengaliFormatted = toBengaliNumber(englishFormatted);
  return `${bengaliFormatted} ${symbol}`;
};
