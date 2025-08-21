import { type CSSProperties } from 'react';
import Colors from '../../assets/styles/Color';
import Size from '../../assets/styles/Size';
import font from '../../assets/styles/Font';
import { useContextProvider } from '../layout/ContextProvider';

type PrimaryTextAreaProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    rows?: number;
};

export const PrimaryTextArea = ({
    label,
    value,
    onChange,
    placeholder,
    disabled = false,
    error,
    rows = 3,
}: PrimaryTextAreaProps) => {
    const { isMobile } = useContextProvider();
    
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

    const textareaWrapperStyle: CSSProperties = {
        position: 'relative',
        width: '100%',
    };

    const textareaStyle: CSSProperties = {
        width: '100%',
        marginTop: Size.Small,
        minHeight: isMobile ? '80px' : '100px',
        paddingLeft: isMobile ? '10px' : Size.Medium,
        paddingRight: isMobile ? '10px' : Size.Medium,
        paddingTop: isMobile ? '8px' : Size.Medium,
        paddingBottom: isMobile ? '8px' : Size.Medium,
        border: `1px solid ${error ? Colors.TEXT_ERROR_COLOR : Colors.SECONDARY_TEXT_COLOR}`,
        borderRadius: Size.Small,
        fontFamily: font.Regular,
        outline: 'none',
        cursor: disabled ? 'default' : 'text',
        opacity: disabled ? 0.5 : 1,
        fontSize: isMobile ? Size.Small : Size.Medium,
        resize: 'vertical',
        lineHeight: '1',
    };

    return (
        <div style={fieldWrapperStyle}>
            <div style={labelContainerStyle}>
                <div style={labelStyle}>{label}</div>
                {error && <div style={errorStyle}>{error}</div>}
            </div>
            
            <div style={textareaWrapperStyle}>
                <textarea
                    rows={rows}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    style={textareaStyle}
                    disabled={disabled}
                />
            </div>
        </div>
    );
};
