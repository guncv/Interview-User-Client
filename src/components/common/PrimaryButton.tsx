import { type CSSProperties } from 'react';
import Colors from '../../assets/styles/Color';
import Size from '../../assets/styles/Size';
import font from '../../assets/styles/Font';
import { useContextProvider } from '../layout/ContextProvider';

type Props = {
    label: string;
    onClick: () => void;
    style?: CSSProperties;
    isCancel?: boolean;
    isDisabled?: boolean;
};

export const PrimaryButton = ({ label, onClick, style, isCancel = false, isDisabled = false }: Props) => {
    const { isMobile } = useContextProvider();
    
    const buttonStyle: CSSProperties = {
        width: '100%',
        borderRadius: Size.Small,
        backgroundColor: isCancel ? Colors.TEXT_ERROR_COLOR : isDisabled ? Colors.DISABLED_TEXT_COLOR : Colors.ACCENT_COLOR,
        color: Colors.TEXT_WHITE_COLOR,
        fontFamily: font.Regular,
        fontSize: isMobile ? Size.Small : Size.Medium,
        cursor: isDisabled ? 'default' : 'pointer',
        border: 'none',
        outline: 'none',
        padding: Size.Small,
    };

    return (
        <button disabled={isDisabled} style={{...buttonStyle, ...style, opacity: 1}} onClick={onClick}>
            {label}
        </button>
    );
};


