import { type CSSProperties, type ReactNode } from 'react';
import AuthLayout from './AuthLayout';
import { useContextProvider } from './ContextProvider';
import Colors from '../../assets/styles/Color';
import Size from '../../assets/styles/Size';

interface Props {
    title: string;
    highlight?: string;
    description?: string;
    children: ReactNode;
}

const AuthPageLayout = ({ title, highlight, description, children }: Props) => {
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
            {children}
        </AuthLayout>
    );
};

export default AuthPageLayout;
