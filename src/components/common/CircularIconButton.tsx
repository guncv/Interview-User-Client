import React, { useState } from 'react';
import Colors from '../../assets/styles/Color';

interface CircularIconButtonProps {
    icon: React.ReactElement<any>;
    buttonId: string;
    onClick?: () => void;
    size?: string;
    iconSize?: string;
    isActive?: boolean;  // For toggle states like mute/unmute
    activeColor?: string;
    inactiveColor?: string;
}

const CircularIconButton: React.FC<CircularIconButtonProps> = ({
    icon,
    buttonId,
    onClick,
    size = '40px',
    iconSize = '35px',
    isActive = true,
    activeColor = Colors.PRIMARY_COLOR,
    inactiveColor = Colors.SECONDARY_TEXT_COLOR
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
                border: isActive 
                    ? (isHovered ? `0.5px solid ${Colors.ACCENT_COLOR}` : `0.5px solid ${Colors.PRIMARY_COLOR}`)
                    : `0.5px solid ${Colors.SECONDARY_TEXT_COLOR}`,
                padding: '10px',
                borderRadius: '50%',
                backgroundColor: isActive 
                    ? (isHovered ? Colors.ACCENT_COLOR_LIGHT : 'transparent')
                    : (isHovered ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 0, 0, 0.05)'),
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
                    color: isActive ? activeColor : inactiveColor,
                    opacity: isActive ? 1 : 0.6
                }
            })}
        </div>
    );
};

export default CircularIconButton;
