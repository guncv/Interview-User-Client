import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import insiderLoadingAnimation from '../../assets/animations/insiderLoading.lottie?url';

interface InsiderLoadingSpinner {
    isVisible?: boolean;
    wrapperStyle: React.CSSProperties;
}

const InsiderLoadingSpinner: React.FC<InsiderLoadingSpinner> = ({ isVisible, wrapperStyle }) => {
    if (!isVisible) return null;

    const animationStyle: React.CSSProperties = {
        width: '200px',
        height: 'auto',
    };

    return (
        <div style={wrapperStyle}>
            <DotLottieReact
                src={insiderLoadingAnimation}
                loop={true}
                autoplay={true}
                style={animationStyle}
            />
        </div>
    );
};

export default InsiderLoadingSpinner;