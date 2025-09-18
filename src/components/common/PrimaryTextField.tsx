import { useState, type CSSProperties } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Colors from '../../assets/styles/Color';
import Size from '../../assets/styles/Size';
import font from '../../assets/styles/Font';
import { useContextProvider } from '../layout/ContextProvider';

type PrimaryTextFieldProps = {
    label: string;
    type?: 'text' | 'password';
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
};

export const PrimaryTextField = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    disabled = false,
    error,
}: PrimaryTextFieldProps) => {
    const { isMobile } = useContextProvider();
    const [isVisible, setIsVisible] = useState(false);
    const isPassword = type === 'password';
    
    const fieldWrapperStyle: CSSProperties = {
        width: '100%',
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

    const inputWrapperStyle: CSSProperties = {
        position: 'relative',
        width: '100%',
    };

    const inputStyle: CSSProperties = {
        width: '100%',
        marginTop: Size.Small,
        height: isMobile ? '35px' : '45px',
        paddingLeft: isMobile ? '10px' : Size.Medium,
        paddingRight: isMobile ? '10px' : Size.Medium,
        paddingTop: isMobile ? '0px' : Size.Medium,
        paddingBottom: isMobile ? '0px' : Size.Medium,
        border: `1px solid ${error ? Colors.TEXT_ERROR_COLOR : Colors.SECONDARY_TEXT_COLOR}`,
        borderRadius: Size.Small,
        fontFamily: font.Regular,
        outline: 'none',
        cursor: disabled ? 'default' : 'text',
        opacity: disabled ? 0.5 : 1,
        fontSize: isMobile ? Size.Small : Size.Medium,
    };

    const eyeIconStyle: CSSProperties = {
        position: 'absolute',
        right: Size.Small,
        top: isMobile ? '45%' : '40%',
        width: isMobile ? '15px' : '20px',
        height: isMobile ? '15px' : '20px',
        cursor: disabled ? 'default' : 'pointer',
        color: Colors.SECONDARY_TEXT_COLOR,
        opacity: disabled ? 0.5 : 1,
    };

    return (
        <div style={fieldWrapperStyle}>
            <div style={labelContainerStyle}>
                <div style={labelStyle}>{label}</div>
                {error && <div style={errorStyle}>{error}</div>}
            </div>
            
            <div style={inputWrapperStyle}>
                <input
                type={isPassword && !isVisible ? 'password' : 'text'}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={inputStyle}
                disabled={disabled}
                data-grammarly-disable
                />
                {isPassword && (
                isVisible && !disabled ? (
                    <Eye style={eyeIconStyle} onClick={() => setIsVisible(false)} />
                ) : (
                    <EyeOff style={eyeIconStyle} onClick={() => setIsVisible(true)} />
                )
                )}
            </div>
        </div>
    );
};

