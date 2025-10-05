export const suppressLottieWarnings = () => {
    const originalWarn = console.warn;
    const originalError = console.error;

    console.warn = function(...args: any[]) {
        const message = args[0];
        if (typeof message === 'string' && message.includes('Buffer size mismatch')) {
            return;
        }
        originalWarn.apply(console, args);
    };

    console.error = function(...args: any[]) {
        const message = args[0];
        if (typeof message === 'string' && message.includes('Buffer size mismatch')) {
            return;
        }
        originalError.apply(console, args);
    };


    return () => {
        console.warn = originalWarn;
        console.error = originalError;
    };
};