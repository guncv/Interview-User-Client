import { type CSSProperties } from 'react';
import { useContextProvider } from '../layout/ContextProvider';
import Size from '../../assets/styles/Size';
import Colors from '../../assets/styles/Color';
import font from '../../assets/styles/Font';

type Props = {
    text?: string;
};

export const OrDivider = ({ text = 'OR' }: Props) => {
    const { isMobile } = useContextProvider();

    const containerStyle: CSSProperties = {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: `${Size.Medium} 0`,
    };

    const lineStyle: CSSProperties = {
        flex: 1,
        height: '1px',
        backgroundColor: Colors.SECONDARY_TEXT_COLOR,
        opacity: 0.3,
    };

    const textStyle: CSSProperties = {
        padding: `0 ${Size.Medium}`,
        fontSize: isMobile ? "12px" : Size.Medium,
        color: Colors.SECONDARY_TEXT_COLOR,
        fontFamily: font.Regular,
        fontWeight: '500',
        backgroundColor: 'transparent',
        whiteSpace: 'nowrap',
    };

    return (
        <div style={containerStyle}>
            {!isMobile && <div style={lineStyle} />}
            <span style={textStyle}>{text}</span>
            {!isMobile && <div style={lineStyle} />}
        </div>
    );
};
