// Utility to suppress Lottie buffer size mismatch warnings globally

export const suppressLottieWarnings = () => {
    // Store original console methods
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalLog = console.log;

    // Override console.warn
    console.warn = function(...args: any[]) {
        const message = args[0];
        if (typeof message === 'string' && message.includes('Buffer size mismatch')) {
            return; // Suppress this warning
        }
        originalWarn.apply(console, args);
    };

    // Override console.error
    console.error = function(...args: any[]) {
        const message = args[0];
        if (typeof message === 'string' && message.includes('Buffer size mismatch')) {
            return; // Suppress this error
        }
        originalError.apply(console, args);
    };

    // Override console.log (just in case)
    console.log = function(...args: any[]) {
        const message = args[0];
        if (typeof message === 'string' && message.includes('Buffer size mismatch')) {
            return; // Suppress this log
        }
        originalLog.apply(console, args);
    };

    // Return cleanup function
    return () => {
        console.warn = originalWarn;
        console.error = originalError;
        console.log = originalLog;
    };
};

