import { type CSSProperties } from 'react';
import { useContextProvider } from '../layout/ContextProvider';
import Size from '../../assets/styles/Size';

type Props = {
    onClick: () => void;
    disabled?: boolean;
};

export const GoogleSignInButton = ({ onClick, disabled = false }: Props) => {
    const { isMobile } = useContextProvider();

    const buttonStyle: CSSProperties = {
        width: '100%',
        height: '44px',
        backgroundColor: '#ffffff',
        border: '1px solid #dadce0',
        borderRadius: '8px',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 16px',
        fontSize: isMobile ? Size.Small : '14px',
        fontFamily: '"Roboto", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
        color: '#3c4043',
        outline: 'none',
        transition: 'all 0.2s ease-in-out',
        opacity: disabled ? 0.6 : 1,
        boxShadow: '0 1px 2px rgba(60, 64, 67, 0.1), 0 1px 3px rgba(60, 64, 67, 0.08)',
        position: 'relative',
        overflow: 'hidden',
    };

    const hoverStyle: CSSProperties = {
        backgroundColor: '#f8f9fa',
        borderColor: '#c1c7cd',
        boxShadow: '0 2px 4px rgba(60, 64, 67, 0.2), 0 1px 6px rgba(60, 64, 67, 0.12), 0 0 0 1px rgba(60, 64, 67, 0.05)',
        transform: 'translateY(-1px)',
    };

    const activeStyle: CSSProperties = {
        backgroundColor: '#f1f3f4',
        borderColor: '#9aa0a6',
        boxShadow: '0 1px 2px rgba(60, 64, 67, 0.15), inset 0 1px 2px rgba(60, 64, 67, 0.1)',
        transform: 'translateY(0px)',
    };

    const googleIconStyle: CSSProperties = {
        width: '18px',
        height: '18px',
        marginRight: '12px',
        display: 'inline-block',
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!disabled) {
            Object.assign(e.currentTarget.style, hoverStyle);
        }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!disabled) {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.borderColor = '#dadce0';
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(60, 64, 67, 0.1), 0 1px 3px rgba(60, 64, 67, 0.08)';
            e.currentTarget.style.transform = 'translateY(0px)';
        }
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

    // Google "G" logo SVG
    const GoogleIcon = () => (
        <svg
            style={googleIconStyle}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
        </svg>
    );

    return (
        <button
            style={buttonStyle}
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            type="button"
        >
            <GoogleIcon />
            Sign in with Google
        </button>
    );
};
