import React, { useState } from 'react';
import type { CSSProperties } from 'react';
import Colors from '../../assets/styles/Color';

interface ClickableLinkProps {
    children: React.ReactNode;
    onClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
    style?: CSSProperties;
    hoverColor?: string;
    underlineOnHover?: boolean;
    scaleOnHover?: boolean;
}

const ClickableLink: React.FC<ClickableLinkProps> = ({
    children,
    onClick,
    style = {},
    hoverColor = Colors.ACCENT_COLOR,
    underlineOnHover = true,
    scaleOnHover = false,
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const baseStyle: CSSProperties = {
        cursor: 'pointer',
        color: Colors.LINK_COLOR,
        textDecoration: 'underline',
        transition: 'all 0.3s ease',
        display: 'inline-block',
        ...style,
    };

    const hoverStyle: CSSProperties = {
        color: hoverColor,
        textDecoration: underlineOnHover ? 'underline' : 'none',
        transform: scaleOnHover ? 'scale(1.05)' : 'none',
    };

    const currentStyle: CSSProperties = isHovered 
        ? { ...baseStyle, ...hoverStyle }
        : baseStyle;

    return (
        <span
            style={currentStyle}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </span>
    );
};

export default ClickableLink;
