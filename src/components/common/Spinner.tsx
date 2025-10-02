import React, { useState, useRef } from 'react';
import loadingAnimation from '../../assets/animations/loading.lottie?url';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Colors from '../../assets/styles/Color';

interface LoadingSpinnerProps {
    isVisible?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isVisible }) => {
    const [hasError, setHasError] = useState(false);
    const uniqueKeyRef = useRef(`lottie-spinner-${Date.now()}-${Math.random()}`);

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

    const fallbackStyle: React.CSSProperties = {
        ...animationStyle,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '8px',
        fontSize: '18px',
        color: '#333',
        fontWeight: 'bold',
    };

    return (
        <div style={wrapperStyle}>
            <div style={backdropStyle} />
            <div style={animationContainerStyle}>
                {hasError ? (
                    <div style={fallbackStyle}>
                        Loading...
                    </div>
                ) : (
                    <DotLottieReact
                        key={uniqueKeyRef.current}
                        src={loadingAnimation}
                        loop={true}
                        autoplay={true}
                        style={animationStyle}
                        onError={() => {
                            setHasError(true);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default LoadingSpinner;
