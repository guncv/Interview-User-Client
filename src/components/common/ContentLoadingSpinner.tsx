import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import loadingAnimation from '../../assets/animations/loading.lottie?url';

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
                src={loadingAnimation}
                loop={true}
                autoplay={true}
                style={animationStyle}
            />
        </div>
    );
};

export default ContentLoadingSpinner; 