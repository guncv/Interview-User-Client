import React, { useState } from 'react';
import Colors from '../../assets/styles/Color';

interface CircularIconButtonProps {
    icon: React.ReactElement<any>;
    buttonId: string;
    onClick?: () => void;
    size?: string;
    iconSize?: string;
    isActive?: boolean;
}

const CircularIconButton: React.FC<CircularIconButtonProps> = ({
    icon,
    buttonId,
    onClick,
    size = '40px',
    iconSize = '35px',
    isActive = true,
}) => {
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);
    const isHovered = hoveredButton === buttonId;

    return (
        <div 
            style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                justifyContent: 'center',
                alignItems: 'center',
                border: (isHovered ? `0.5px solid ${Colors.ACCENT_COLOR}` : `0.5px solid ${Colors.PRIMARY_COLOR}`),
                padding: '10px',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                width: size,
                height: size,
                minWidth: size,
                minHeight: size
            }}
            onMouseEnter={() => setHoveredButton(buttonId)}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={onClick}
        >
            {React.cloneElement(icon, {
                style: {
                    fontSize: iconSize,
                    color: Colors.PRIMARY_COLOR,
                    opacity: isActive ? 1 : 0.6
                }
            })}
        </div>
    );
};

export default CircularIconButton;
