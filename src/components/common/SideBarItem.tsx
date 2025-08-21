import { useState, type CSSProperties } from 'react';
import Colors from '../../assets/styles/Color';
import { useContextProvider } from '../layout/ContextProvider';

interface SideBarItemProps {
    icon: React.ReactNode;
    text: string;
    isActive: boolean;
    onClick: () => void;
    isMenu: boolean;
}

const SideBarItem = ({ icon, text , isActive, onClick, isMenu }: SideBarItemProps) => {
    const { isMobile, isTablet } = useContextProvider();
    const [hover, setHover] = useState(false);

    const sideBarItemContainerStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'start',
        width: '100%',
        justifyContent: 'center',
        gap: '5%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backgroundColor: hover ? isActive ? Colors.ACCENT_COLOR_LIGHT : Colors.CONTENT_HOVER_COLOR : '',
        paddingTop: '15px',
        paddingBottom: '15px',
        color: isActive ? Colors.ACCENT_COLOR : Colors.PRIMARY_COLOR,
    };

    const iconContainerStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'end',
        alignItems: 'center',
        width: isMenu ? '100%' : '25%',
        paddingTop: isMenu && (isMobile || isTablet) ? '10px' :  '0px',
        marginRight: isMenu && (isMobile || isTablet) ? '15px' : '0px',
    };

    const textContainerStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
        alignItems: 'center',
        width: '70%',
        fontSize: '15px',
    };

    return (
        <div style={sideBarItemContainerStyle} onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)} onClick={onClick}>
            <div style={iconContainerStyle}>
                {icon}
            </div>
            {
                !isMenu && (
                    <div style={textContainerStyle}>
                        {text}
                    </div>
                )
            }
        </div>
    );
};

export default SideBarItem;
