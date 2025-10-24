import { formatDistanceToNow, format } from 'date-fns';

/**
 * Format a number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number (e.g., "1,234")
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format a date as relative time
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch (error) {
    return 'Unknown';
  }
};

/**
 * Format a date as absolute time
 * @param {string|Date} date - Date to format
 * @param {string} pattern - Date format pattern (default: 'PPpp')
 * @returns {string} Formatted date
 */
export const formatAbsoluteTime = (date, pattern = 'PPpp') => {
  try {
    return format(new Date(date), pattern);
  } catch (error) {
    return 'Unknown';
  }
};

/**
 * Format a percentage
 * @param {number} value - Value to format (0-100)
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage (e.g., "87.3%")
 */
export const formatPercentage = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size (e.g., "239 KB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i)) + ' ' + sizes[i];
};

/**
 * Format a date in a readable format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date (e.g., "April 22, 2020")
 */
export const formatDate = (date) => {
  // Handle null, undefined, empty string, or 0
  if (!date || date === '0' || date === 0) {
    return 'Not Available';
  }

  try {
    const dateObj = new Date(date);

    // Check if date is invalid
    if (isNaN(dateObj.getTime())) {
      return 'Not Available';
    }

    // Check if date is before 1970 (likely invalid/epoch issue)
    if (dateObj.getFullYear() < 1970) {
      return 'Not Available';
    }

    return format(dateObj, 'MMMM d, yyyy');
  } catch (error) {
    return 'Not Available';
  }
};
