const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Formats a date string to ISO 8601 format that Go's time.Time can parse
 * @param dateString - Date string from date picker
 * @returns ISO 8601 formatted date string
 */
const formatDateForBackend = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        
        // Format to ISO 8601 (RFC 3339) - Go's time.Time standard format
        return date.toISOString();
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};

export { isValidEmail, formatDateForBackend };