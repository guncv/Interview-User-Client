import { useState, useRef, type CSSProperties, type ReactNode } from 'react';
import Colors from '../../assets/styles/Color';
import Size from '../../assets/styles/Size';
import font from '../../assets/styles/Font';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

type Props = {
    children: ReactNode;
    content: string;
    position?: TooltipPosition;
    delay?: number;
};

export const Tooltip = ({ children, content, position = 'top', delay = 300 }: Props) => {
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const newPosition = calculatePosition(rect, position);
            setTooltipPosition(newPosition);
        }
        
        const id = setTimeout(() => {
            setIsVisible(true);
        }, delay);
        setTimeoutId(id);
    };

    const handleMouseLeave = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
        setIsVisible(false);
    };

    const calculatePosition = (rect: DOMRect, pos: TooltipPosition) => {
        const offset = 8;
        
        switch (pos) {
            case 'top':
                return {
                    top: rect.top - offset,
                    left: rect.left + rect.width / 2,
                };
            case 'bottom':
                return {
                    top: rect.bottom + offset,
                    left: rect.left + rect.width / 2,
                };
            case 'left':
                return {
                    top: rect.top + rect.height / 2,
                    left: rect.left - offset,
                };
            case 'right':
                return {
                    top: rect.top + rect.height / 2,
                    left: rect.right + offset,
                };
            default:
                return { top: 0, left: 0 };
        }
    };

    function getTooltipTop() {
        switch (position) {
            case 'top':
                return tooltipPosition.top - 30;
            case 'bottom':
                return tooltipPosition.top;
            case 'left':
            case 'right':
                return tooltipPosition.top - 15;
            default:
                return tooltipPosition.top;
        }
    }

    function getTooltipLeft() {
        switch (position) {
            case 'top':
            case 'bottom':
                return tooltipPosition.left - 50;
            case 'left':
                return tooltipPosition.left - 100;
            case 'right':
                return tooltipPosition.left;
            default:
                return tooltipPosition.left;
        }
    }

    function getTransformHidden() {
        switch (position) {
            case 'top':
                return 'translateY(8px) scale(0.95)';
            case 'bottom':
                return 'translateY(-8px) scale(0.95)';
            case 'left':
                return 'translateX(8px) scale(0.95)';
            case 'right':
                return 'translateX(-8px) scale(0.95)';
            default:
                return 'translateY(-8px) scale(0.95)';
        }
    }

    const containerStyle: CSSProperties = {
        position: 'relative',
        display: 'inline-block',
    };

    const tooltipStyle: CSSProperties = {
        position: 'fixed',
        top: getTooltipTop(),
        left: getTooltipLeft(),
        backgroundColor: Colors.SIDEBAR_COLOR,
        color: Colors.TEXT_WHITE_COLOR,
        padding: `${Size.XSmall} ${Size.Small}`,
        borderRadius: Size.XSmall,
        fontSize: Size.Small,
        fontFamily: font.Regular,
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
        transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isVisible ? 'translateY(0) scale(1)' : getTransformHidden(),
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
        maxWidth: '250px',
        wordWrap: 'break-word',
        whiteSpace: 'normal',
        pointerEvents: 'none',
    };


    return (
        <div
            ref={containerRef}
            style={containerStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            <div style={tooltipStyle}>
                {content}
            </div>
        </div>
    );
};

export default Tooltip;
