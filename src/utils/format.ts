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

const convertWeightToPercentage = (weight: string | number): number => {
    const numericWeight = typeof weight === 'string' ? parseFloat(weight) : weight;
    return Math.round(numericWeight * 100 * 10) / 10;
};

const getPercentageColor = (percentage: number): string => {
    if (percentage <= 20) {
        return '#DC3545';
    } else if (percentage <= 30) {
        return '#FFC107';
    } else {
        return '#28A745';
    }
};

export { isValidEmail, formatDateForBackend, convertWeightToPercentage, getPercentageColor };