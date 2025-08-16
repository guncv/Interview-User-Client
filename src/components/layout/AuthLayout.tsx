import { type CSSProperties } from 'react';
import authBackground from '../../assets/images/authBackground.jpg';

const AuthLayout = ({children}: {children: React.ReactNode}) => {

    const contentStyle: CSSProperties = {
        width: '40%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
        width: '60%',
        height: '100%',
        overflow: 'hidden',
    };

    return (
        <div style={pageStyle}>
            <div style={logoStyle}>
                <img src={authBackground} alt="authBackground"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
            </div>

            <div style={contentStyle}>
                {children}
            </div>
        </div>
    );
};
export default AuthLayout;
