import { type CSSProperties } from 'react';
import authBackground from '../../assets/images/authBackground.jpg';
import { useContextProvider } from './ContextProvider';

const AuthLayout = ({children}: {children: React.ReactNode}) => {
    const { isMobile, isTablet } = useContextProvider();

    const contentStyle: CSSProperties = {
        width: isMobile || isTablet ? '100%' : '45vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: isMobile ? 'auto' : 'hidden',
    };

    const pageStyle: CSSProperties = {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    };
    
    const logoStyle: CSSProperties = {
        width: '55%',
        height: '100%',
        overflow: isMobile ? 'auto' : 'hidden',
    };

    return (
        <div style={pageStyle}>
            {
                (!isMobile && !isTablet) && <div style={logoStyle}>
                <img src={authBackground} alt="authBackground"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
                </div>
            }
            

            <div style={contentStyle}>
                {children}
            </div>
        </div>
    );
};
export default AuthLayout;
