const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const formatDateForBackend = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        
        return date.toISOString();
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};

export { isValidEmail, formatDateForBackend };