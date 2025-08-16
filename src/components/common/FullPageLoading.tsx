import React from 'react';
import Colors from '../../assets/styles/Color';
import { Loader2 } from 'lucide-react';

interface FullPageLoadingProps {
    message?: string;
}

const FullPageLoading: React.FC<FullPageLoadingProps> = ({ 
    message = 'Loading...', 
}) => {
    const containerStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.TEXT_WHITE_COLOR,
        gap: '20px',
        zIndex: 9999,
    };

    const spinnerStyle: React.CSSProperties = {
        width: '60px',
        height: '60px',
        color: Colors.PRIMARY_COLOR,
        animation: 'spin 1s linear infinite',
    };

    const messageStyle: React.CSSProperties = {
        fontSize: '16px',
        fontFamily: 'Inter, sans-serif',
        color: Colors.SECONDARY_TEXT_COLOR,
        textAlign: 'center',
    };

    return (
        <div style={containerStyle}>
            <Loader2 style={spinnerStyle} />
            <div style={messageStyle}>
                {message}
            </div>
        </div>
    );
};

export default FullPageLoading; 