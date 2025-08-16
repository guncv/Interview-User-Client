import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface ContextProviderProps {
    isMobile: boolean;
    isTablet: boolean;
}

const Context = createContext<ContextProviderProps | undefined>(undefined);

export const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width <= 640);
            setIsTablet(width > 640 && width <= 1024);
        };
    
        // Set initial values
        handleResize();
        
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    

    return (
        <Context.Provider value={{ isTablet, isMobile }}>
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