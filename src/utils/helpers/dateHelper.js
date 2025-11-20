/**
 * Formats a date string or Date object to dd-mmm-yyyy format (e.g., "20-Sep-2025")
 * @param {string|Date} date - The date to format
 * @returns {string} - Formatted date string or 'N/A' if invalid
 */
export const formatDate = (date) => {
  if (!date) return 'N/A'

  try {
    const dateObj = new Date(date)

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'N/A'
    }

    const day = String(dateObj.getDate()).padStart(2, '0')
    const month = dateObj.toLocaleString('en-GB', { month: 'short' })
    const year = dateObj.getFullYear()

    return `${day}-${month}-${year}`
  } catch (error) {
    console.warn('Error formatting date:', error)
    return 'N/A'
  }
}

/**
 * Formats a date string or Date object to a localized date and time string
 * @param {string|Date} date - The date to format
 * @param {string} locale - The locale to use (default: 'en-GB')
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date and time string or 'N/A' if invalid
 */
export const formatDateTime = (date, locale = 'en-GB', options = {}) => {
  if (!date) return 'N/A'

  try {
    const dateObj = new Date(date)

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'N/A'
    }

    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    }

    return dateObj.toLocaleString(locale, defaultOptions)
  } catch (error) {
    console.warn('Error formatting date and time:', error)
    return 'N/A'
  }
}

// Keep the old function name as an alias for backward compatibility
export const formatDateToDDMonthYYYY = formatDate
