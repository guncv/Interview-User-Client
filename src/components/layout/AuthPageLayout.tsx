import { type CSSProperties, type ReactNode } from 'react';
import AuthLayout from './AuthLayout';
import { useContextProvider } from './ContextProvider';
import Colors from '../../assets/styles/Color';
import Size from '../../assets/styles/Size';
import font from '../../assets/styles/Font';

interface Props {
    title: string;
    highlight?: string;
    description?: string;
    signUp?: boolean;
    children: ReactNode;
}

const AuthPageLayout = ({ title, highlight, description, signUp = false, children }: Props) => {
    const { isMobile } = useContextProvider();

    const titleStyle: CSSProperties = {
        fontSize: isMobile ? '6vw' : Size.ExtraLarge,
        color: Colors.PRIMARY_COLOR,
    };

    const highlightStyle: CSSProperties = {
        color: Colors.ACCENT_COLOR,
    };

    const descriptionStyle: CSSProperties = {
        fontSize: isMobile ? '3vw' : Size.Medium,
        color: Colors.SECONDARY_TEXT_COLOR,
        whiteSpace: 'pre-line',
    };

    return (
        <AuthLayout>
            <div style={titleStyle}>
                {title}{highlight && <span style={highlightStyle}>{highlight}</span>}
            </div>
            {description && <div style={descriptionStyle}>{description}</div>}

            <div style={{ 
                width: '100%', 
                marginTop: signUp ? Size.Small : Size.ExtraLarge, 
                fontFamily: font.Regular, 
                display: 'flex', 
                flexDirection: 'column', 
                gap: Size.Medium,
                alignItems: 'center',
            }}>
                {children}
            </div>
        </AuthLayout>
    );
};

export default AuthPageLayout;
