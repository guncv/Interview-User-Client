import React, { useState, useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import loadingAnimation from '../../assets/animations/loading.lottie?url';

interface ContentLoadingSpinnerProps {
    isVisible?: boolean;
    wrapperStyle: React.CSSProperties;
}

const ContentLoadingSpinner: React.FC<ContentLoadingSpinnerProps> = ({ isVisible, wrapperStyle }) => {
    const [hasError, setHasError] = useState(false);
    const uniqueKeyRef = useRef(`lottie-content-${Date.now()}-${Math.random()}`);

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
                src={loadingAnimation}
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

export default ContentLoadingSpinner; 