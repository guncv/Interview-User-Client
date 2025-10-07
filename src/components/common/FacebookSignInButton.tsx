import { type CSSProperties } from 'react';
import { useContextProvider } from '../layout/ContextProvider';
import Size from '../../assets/styles/Size';
import font from '../../assets/styles/Font';

type Props = {
    onClick: () => void;
    disabled?: boolean;
};

export const FacebookSignInButton = ({ onClick, disabled = false }: Props) => {
    const { isMobile } = useContextProvider();

    const containerStyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    };

    const buttonStyle: CSSProperties = {
        width: isMobile ? '300px' : '100%',
        height: '44px',
        backgroundColor: '#1877f2',
        border: 'none',
        borderRadius: '8px',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 16px',
        fontSize: isMobile ? "13px" : Size.Medium,
        fontFamily: font.Regular,
        color: '#ffffff',
        outline: 'none',
        transition: 'all 0.2s ease-in-out',
        opacity: disabled ? 0.6 : 1,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        position: 'relative',
        overflow: 'hidden',
    };

    const hoverStyle: CSSProperties = {
        backgroundColor: '#166fe5',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15), 0 1px 6px rgba(0, 0, 0, 0.1)',
        transform: 'translateY(-1px)',
    };

    const activeStyle: CSSProperties = {
        backgroundColor: '#1461d4',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(0, 0, 0, 0.1)',
        transform: 'translateY(0px)',
    };

    const facebookIconStyle: CSSProperties = {
        width: '18px',
        height: '18px',
        marginRight: '12px',
        display: 'inline-block',
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!disabled) {
            Object.assign(e.currentTarget.style, activeStyle);
        }
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!disabled) {
            Object.assign(e.currentTarget.style, hoverStyle);
        }
    };

    const FacebookIcon = () => (
        <svg
            style={facebookIconStyle}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
        >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
    );

    return (
        <div style={containerStyle}>    
            <button
                style={buttonStyle}
                onClick={onClick}
                disabled={disabled}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                type="button"
            >
                <FacebookIcon />
                Sign in with Facebook
            </button>
        </div>
    );
};
