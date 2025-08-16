
export const navigationRef = { 
    current: null as ((path: string, options?: { replace?: boolean }) => void) | null, 
};

export const safeNavigate = (path: string, params?: Record<string, string>) => {
    if (navigationRef.current) {
        const queryParams = params ? new URLSearchParams(params).toString() : '';
        const fullPath = queryParams ? `${path}?${queryParams}` : path;
        navigationRef.current(fullPath, { replace: true });
    }
};
