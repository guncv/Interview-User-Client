
import { useRouter } from 'next/navigation';

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

// Hook for Next.js navigation
export const useSafeNavigate = () => {
    const router = useRouter();
    
    return (path: string, params?: Record<string, string>) => {
        const queryParams = params ? new URLSearchParams(params).toString() : '';
        const fullPath = queryParams ? `${path}?${queryParams}` : path;
        router.push(fullPath);
    };
};
