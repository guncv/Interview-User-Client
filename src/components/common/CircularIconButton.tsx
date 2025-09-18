import React, { useState } from 'react';
import Colors from '../../assets/styles/Color';

interface CircularIconButtonProps {
    icon: React.ReactElement<any>;
    buttonId: string;
    onClick?: () => void;
    size?: string;
    iconSize?: string;
    isActive?: boolean;
    tooltip?: string;
    variant?: 'default' | 'danger';
}

const CircularIconButton: React.FC<CircularIconButtonProps> = ({
    icon,
    buttonId,
    onClick,
    size = '40px',
    iconSize = '35px',
    isActive = true,
    tooltip,
    variant = 'default',
}) => {
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);
    const isHovered = hoveredButton === buttonId;
    
    // Define colors based on variant
    const isDanger = variant === 'danger';
    const borderColor = isDanger 
        ? (isHovered ? '#FF4444' : Colors.TEXT_ERROR_COLOR)
        : (isHovered ? Colors.ACCENT_COLOR : Colors.PRIMARY_COLOR);
    const backgroundColor = isDanger
        ? (isHovered ? 'rgba(220, 53, 69, 0.2)' : 'rgba(220, 53, 69, 0.1)')
        : (isHovered ? 'rgba(139, 21, 255, 0.05)' : 'transparent');
    const iconColor = isDanger ? Colors.TEXT_ERROR_COLOR : Colors.PRIMARY_COLOR;

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <div 
                style={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: `1px solid ${borderColor}`,
                    padding: '10px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    width: size,
                    height: size,
                    minWidth: size,
                    minHeight: size,
                    backgroundColor: backgroundColor
                }}
                onMouseEnter={() => {
                    setHoveredButton(buttonId);
                }}
                onMouseLeave={() => {
                    setHoveredButton(null);
                }}
                onClick={onClick}
            >
                {React.cloneElement(icon, {
                    style: {
                        fontSize: iconSize,
                        color: iconColor,
                        opacity: isActive ? 1 : 0.6,
                        fontWeight: '600',
                    }
                })}
            </div>

            {tooltip && isHovered && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '50px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: isDanger ? 'rgba(220, 53, 69, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        whiteSpace: 'nowrap',
                        zIndex: 1000,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                        animation: 'fadeIn 0.2s ease-in-out'
                    }}
                >
                    {tooltip}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '-5px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '0',
                            height: '0',
                            borderLeft: '5px solid transparent',
                            borderRight: '5px solid transparent',
                            borderTop: `5px solid ${isDanger ? 'rgba(220, 53, 69, 0.9)' : 'rgba(0, 0, 0, 0.8)'}`
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default CircularIconButton;
