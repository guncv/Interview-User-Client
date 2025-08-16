import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Colors from '../../assets/styles/Color';

interface LoadingSpinnerProps {
    isVisible?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    const wrapperStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1005,
    };
    
    const backdropStyle: React.CSSProperties = {
        backgroundColor: Colors.PRIMARY_COLOR,
        opacity: 0.75,
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    };
    
    const animationContainerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    };
    
    const animationStyle: React.CSSProperties = {
        width: '400px',
        height: 'auto',
    };

    return (
        <div style={wrapperStyle}>
            <div style={backdropStyle} />
            <div style={animationContainerStyle}>
                <DotLottieReact
                    src="/loading.lottie"
                    loop={true}
                    autoplay={true}
                    style={animationStyle}
                />
            </div>
        </div>
    );
};

export default LoadingSpinner;
