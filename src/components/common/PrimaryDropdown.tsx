import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { ChevronDown } from 'lucide-react';
import Colors from '../../assets/styles/Color';
import Size from '../../assets/styles/Size';
import font from '../../assets/styles/Font';
import { useContextProvider } from '../layout/ContextProvider';

type PrimaryDropdownProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    options: { value: string; label: string }[];
    error?: string;
};

export const PrimaryDropdown = ({
    label,
    value,
    onChange,
    placeholder,
    disabled = false,
    options,
    error,
}: PrimaryDropdownProps) => {
    const { isMobile } = useContextProvider();
    const [isOpen, setIsOpen] = useState(false);
    const [showAbove, setShowAbove] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const handleToggle = () => {
        if (!disabled) {
            if (dropdownRef.current) {
                const rect = dropdownRef.current.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.bottom;
                const spaceAbove = rect.top;
                const dropdownHeight = Math.min(options.length * 40 + 20, 200);
                
                setShowAbove(spaceBelow < dropdownHeight && spaceAbove > dropdownHeight);
            }
            setIsOpen(!isOpen);
        }
    };

    const fieldWrapperStyle: CSSProperties = {
        width: '100%',
        position: 'relative',
    };

    const labelContainerStyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const labelStyle: CSSProperties = {
        fontSize: isMobile ? Size.Small : Size.Medium,
        color: Colors.PRIMARY_COLOR,
        opacity: disabled ? 0.5 : 1,
    };

    const errorStyle: CSSProperties = {
        fontSize: Size.Small,
        color: Colors.TEXT_ERROR_COLOR,
        fontFamily: font.Regular,
        textAlign: 'right',
        flexShrink: 0,
        marginLeft: Size.Small,
    };

    const dropdownWrapperStyle: CSSProperties = {
        position: 'relative',
        width: '100%',
    };

    const dropdownStyle: CSSProperties = {
        width: '100%',
        marginTop: Size.Small,
        height: isMobile ? '35px' : '45px',
        border: `1px solid ${error ? Colors.TEXT_ERROR_COLOR : Colors.SECONDARY_TEXT_COLOR}`,
        borderRadius: Size.Small,
        padding: Size.Small,
        paddingLeft: Size.Medium,
        paddingRight: Size.Medium,
        fontFamily: font.Regular,
        outline: 'none',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        backgroundColor: Colors.TEXT_WHITE_COLOR,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    };

    const chevronIconStyle: CSSProperties = {
        width: '20px',
        height: '20px',
        color: Colors.SECONDARY_TEXT_COLOR,
        transition: 'transform 0.2s ease',
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    };

    const optionsContainerStyle: CSSProperties = {
        position: 'absolute',
        [showAbove ? 'bottom' : 'top']: '100%',
        left: 0,
        right: 0,
        backgroundColor: Colors.TEXT_WHITE_COLOR,
        border: `1px solid ${Colors.SECONDARY_TEXT_COLOR}`,
        borderRadius: Size.Small,
        marginTop: showAbove ? '0px' : '2px',
        marginBottom: showAbove ? '2px' : '0px',
        maxHeight: '200px',
        overflowY: 'auto',
        zIndex: 10000,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transform: showAbove ? 'translateY(-100%)' : 'none',
    };

    const optionStyle: CSSProperties = {
        padding: Size.Small,
        paddingLeft: Size.Medium,
        paddingRight: Size.Medium,
        cursor: 'pointer',
        fontFamily: font.Regular,
        fontSize: isMobile ? Size.Small : Size.Medium,
        borderBottom: `1px solid ${Colors.SECONDARY_TEXT_COLOR}`,
        transition: 'background-color 0.2s ease',
    };

    const optionHoverStyle: CSSProperties = {
        backgroundColor: Colors.ACCENT_COLOR,
        color: Colors.TEXT_WHITE_COLOR,
    };

    const selectedValueStyle: CSSProperties = {
        color: value ? Colors.PRIMARY_COLOR : Colors.SECONDARY_TEXT_COLOR,
        fontSize: isMobile ? Size.Small : Size.Medium,
    };

    const handleOptionSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const selectedOption = options.find(option => option.value === value);

    return (
        <div style={fieldWrapperStyle} ref={dropdownRef}>
            <div style={labelContainerStyle}>
                <div style={labelStyle}>{label}</div>
                {error && <div style={errorStyle}>{error}</div>}
            </div>
            
            <div style={dropdownWrapperStyle}>
                <div 
                    style={dropdownStyle} 
                    onClick={handleToggle}
                >
                    <span style={selectedValueStyle}>
                        {selectedOption ? selectedOption.label : placeholder || 'Select an option'}
                    </span>
                    <ChevronDown style={chevronIconStyle} />
                </div>
                
                {isOpen && (
                    <div style={optionsContainerStyle}>
                        {options.map((option) => (
                            <div
                                key={option.value}
                                style={{
                                    ...optionStyle,
                                    ...(option.value === value ? optionHoverStyle : {}),
                                }}
                                onClick={() => handleOptionSelect(option.value)}
                                onMouseEnter={(e) => {
                                    if (option.value !== value) {
                                        e.currentTarget.style.backgroundColor = Colors.ACCENT_COLOR_LIGHT;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (option.value !== value) {
                                        e.currentTarget.style.backgroundColor = Colors.TEXT_WHITE_COLOR;
                                    }
                                }}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
