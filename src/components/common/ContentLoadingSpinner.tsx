import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface ContentLoadingSpinnerProps {
    isVisible?: boolean;
    wrapperStyle: React.CSSProperties;
}

const ContentLoadingSpinner: React.FC<ContentLoadingSpinnerProps> = ({ isVisible, wrapperStyle }) => {
    if (!isVisible) return null;

    const animationStyle: React.CSSProperties = {
        width: '200px',
        height: 'auto',
    };

    return (
        <div style={wrapperStyle}>
            <DotLottieReact
                src="/loading.lottie"
                loop={true}
                autoplay={true}
                style={animationStyle}
            />
        </div>
    );
};

export default ContentLoadingSpinner; 