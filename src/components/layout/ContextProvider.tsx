import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface ContextProviderProps {
    isMobile: boolean;
    isTablet: boolean;
    isSpecialMobile: boolean;
}

const Context = createContext<ContextProviderProps | undefined>(undefined);

export const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 640);
    const [isTablet, setIsTablet] = useState(() =>
        window.innerWidth > 640 && window.innerWidth <= 1024,
    );
    const [isSpecialMobile, setIsSpecialMobile] = useState(() =>
        window.innerWidth <= 768,
    );
    
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width <= 640);
            setIsTablet(width > 640 && width <= 1024);
            setIsSpecialMobile(width <= 768);
        };
    
        window.addEventListener('resize', handleResize);
        handleResize();
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    

    return (
        <Context.Provider value={{ isTablet, isMobile, isSpecialMobile }}>
        {children}
        </Context.Provider>
    );
};

export const useContextProvider = () => {
    const context = useContext(Context);
    if (!context) {
        throw new Error('useMedia must be used within a MediaProvider');
    }
    return context;
};