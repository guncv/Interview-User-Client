import React, { useState, useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import insiderLoadingAnimation from '../../assets/animations/insiderLoading.lottie?url';

interface InsiderLoadingSpinner {
    isVisible?: boolean;
    wrapperStyle: React.CSSProperties;
}

const InsiderLoadingSpinner: React.FC<InsiderLoadingSpinner> = ({ isVisible, wrapperStyle }) => {
    const [hasError, setHasError] = useState(false);
    const uniqueKeyRef = useRef(`lottie-insider-${Date.now()}-${Math.random()}`);

    if (!isVisible) return null;

    const animationStyle: React.CSSProperties = {
        width: '200px',
        height: 'auto',
    };

    const fallbackStyle: React.CSSProperties = {
        ...animationStyle,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666',
    };

    if (hasError) {
        return (
            <div style={wrapperStyle}>
                <div style={fallbackStyle}>
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div style={wrapperStyle}>
            <DotLottieReact
                key={uniqueKeyRef.current}
                src={insiderLoadingAnimation}
                loop={true}
                autoplay={true}
                style={animationStyle}
                onError={() => {
                    setHasError(true);
                }}
            />
        </div>
    );
};

export default InsiderLoadingSpinner;