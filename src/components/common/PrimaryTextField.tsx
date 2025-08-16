import { useState, type CSSProperties } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Colors from '../../assets/styles/Color';
import Size from '../../assets/styles/Size';
import font from '../../assets/styles/Font';

type PrimaryTextFieldProps = {
    label: string;
    type?: 'text' | 'password';
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
};

export const PrimaryTextField = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    disabled = false,
}: PrimaryTextFieldProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const isPassword = type === 'password';
    
    const fieldWrapperStyle: CSSProperties = {
        width: '100%',
    };

    const labelStyle: CSSProperties = {
        fontSize: Size.Medium,
        color: Colors.PRIMARY_COLOR,
        opacity: disabled ? 0.5 : 1,
    };

    const inputWrapperStyle: CSSProperties = {
        position: 'relative',
        width: '100%',
    };

    const inputStyle: CSSProperties = {
        width: '100%',
        marginTop: Size.Small,
        height: '45px',
        border: `1px solid ${Colors.SECONDARY_TEXT_COLOR}`,
        borderRadius: Size.Small,
        padding: Size.Small,
        paddingLeft: Size.Medium,
        paddingRight: Size.Medium,
        fontFamily: font.Regular,
        outline: 'none',
        cursor: disabled ? 'default' : 'text',
        opacity: disabled ? 0.5 : 1,
    };

    const eyeIconStyle: CSSProperties = {
        position: 'absolute',
        right: Size.Small,
        top: '40%',
        width: '20px',
        height: '20px',
        cursor: disabled ? 'default' : 'pointer',
        color: Colors.SECONDARY_TEXT_COLOR,
        opacity: disabled ? 0.5 : 1,
    };

    return (
        <div style={fieldWrapperStyle}>
            <div style={labelStyle}>{label}</div>
            
            <div style={inputWrapperStyle}>
                <input
                type={isPassword && !isVisible ? 'password' : 'text'}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={inputStyle}
                disabled={disabled}
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

