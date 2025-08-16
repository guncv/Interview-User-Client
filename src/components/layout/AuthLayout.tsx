import { type CSSProperties } from 'react';
import { useContextProvider } from './ContextProvider';

const AuthLayout = ({children, isSignIn}: {children: React.ReactNode, isSignIn: boolean}) => {
    const { isMobile } = useContextProvider();

    const contentStyle: CSSProperties = {
        height: `calc(100% - ${isMobile ? '60px' : '80px'})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: isSignIn ? (isMobile ? '10vh' : '15vh') : (isMobile ? '10vh' : '5vh'),
    };

    const pageStyle: CSSProperties = {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
    };
    
    

    return (
        <div style={pageStyle}>
        <div style={contentStyle}>{children}</div>
        </div>
    );
};
export default AuthLayout;
