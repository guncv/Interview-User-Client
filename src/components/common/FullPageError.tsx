import React from 'react';
import Colors from '../../assets/styles/Color';
import Font from '../../assets/styles/Font';
import Size from '../../assets/styles/Size';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface FullPageErrorProps {
    message?: string;
    onRetry?: () => void;
}

const FullPageError: React.FC<FullPageErrorProps> = ({ 
    message = 'Something went wrong. Please try again.', 
    onRetry,
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
        padding: '20px',
        zIndex: 9999,
    };

    const iconStyle: React.CSSProperties = {
        width: '80px',
        height: '80px',
        color: Colors.SECONDARY_TEXT_COLOR,
    };

    const messageStyle: React.CSSProperties = {
        fontSize: Size.Large,
        fontFamily: Font.Regular,
        color: Colors.SECONDARY_TEXT_COLOR,
        textAlign: 'center',
        maxWidth: '500px',
        lineHeight: '1.5',
    };

    const retryButtonStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 24px',
        backgroundColor: Colors.PRIMARY_COLOR,
        color: Colors.TEXT_WHITE_COLOR,
        border: 'none',
        borderRadius: '6px',
        fontSize: Size.Medium,
        fontFamily: Font.Regular,
        cursor: 'pointer',
        transition: 'opacity 0.2s ease',
    };

    return (
        <div style={containerStyle}>
            <AlertCircle style={iconStyle} />
            <div style={messageStyle}>
                {message}
            </div>
            {onRetry && (
                <button 
                    style={retryButtonStyle}
                    onClick={onRetry}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.8';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                    }}
                >
                    <RefreshCw size={18} />
                    Try Again
                </button>
            )}
        </div>
    );
};

export default FullPageError; 