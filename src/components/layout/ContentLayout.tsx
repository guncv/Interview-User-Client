import { useEffect, useState, type CSSProperties } from 'react';
import Colors from '../../assets/styles/Color';
import SideBarItem from '../common/SideBarItem';
import { AudioLines, LogOut, Menu, MessageSquareWarning, Settings, X } from 'lucide-react';
import Size from '../../assets/styles/Size';
import Fonts from '../../assets/styles/Font';
import { useLocation } from 'react-router-dom';
import { safeNavigate } from '../../utils/navigation';
import { useContextProvider } from './ContextProvider';
import logo from '../../assets/images/logo.png';
import { signOut } from '../../actions/userAction';
import { useDispatch } from 'react-redux';
import CreateAndUpdateIssuePopup from '../dialog/CreateAndUpdateIssuePopup';

const ContentLayout = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const pathname = location.pathname;
    const { isMobile, isTablet } = useContextProvider();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isReportIssuePopupOpen, setIsReportIssuePopupOpen] = useState(false);

    useEffect(() => {
        if (isMenuOpen && (isMobile || isTablet)) {
        document.body.style.overflow = 'hidden';
        } else {
        document.body.style.overflow = '';
        }
        return () => {
        document.body.style.overflow = '';
        };
    }, [isMenuOpen, isMobile, isTablet]);

    const isActive = (path: string) => pathname === path;

    const handleNavigate = (path: string) => {
        if (!isActive(path)) safeNavigate(path);
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const pageStyle: CSSProperties = {
        width: '100vw',
        height: isMobile || isTablet ? '' : '100vh',
        display: 'flex',
        flexDirection: isMobile || isTablet ? 'column' : 'row',
        overflow: 'hidden',
    };

    const sideBarStyle: CSSProperties = {
        width: isMobile || isTablet ? '100%' : '200px',
        height: isMobile || isTablet ? '60px' : '100%',
        borderRight: `1px solid ${Colors.DISABLED_TEXT_COLOR}`,
        display: 'flex',
        flexDirection: isMobile || isTablet ? 'row' : 'column',
        justifyContent: 'space-between',
        position: isMobile || isTablet ? 'fixed' : 'relative',
        top: isMobile || isTablet ? 0 : undefined,
        left: isMobile || isTablet ? 0 : undefined,
        zIndex: 900,
    };

    const barContentWrapperStyle: CSSProperties = {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '10px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    };

    const sideBarItemStyle: CSSProperties = {
        width: Size.Large,
        height: Size.Large,
        strokeWidth: 1.5,
    };

    const contentStyle: CSSProperties = {
        width: isMobile || isTablet ? '100%' : 'calc(100% - 200px)',
        marginTop: isMobile || isTablet ? '60px' : '0px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: isMobile || isTablet ? 'calc(100vh - 60px)' : '100%',
    };

    const overlayStyle: CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        opacity: 0.6,
        zIndex: 998,
    };

    const menuContainerStyle: CSSProperties = {
        position: 'fixed',
        top: 0,
        right: 0,
        width: '250px',
        height: '100%',
        backgroundColor: Colors.SIDEBAR_COLOR,
        color: Colors.TEXT_WHITE_COLOR,
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: '20px',
    };

    const menuPopupStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '20px',
    };

    const closeButtonStyle: CSSProperties = {
        cursor: 'pointer',
        alignSelf: 'flex-end',
        paddingRight: '10px',
        marginBottom: '50px',
    };

    const sideBarItemContainerStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '25px',
        fontFamily: Fonts.Regular,
    };

    const logoStyle: CSSProperties = {
        height: '50px',
        width: 'auto',
        objectFit: 'contain',
    };

    const handleSignOut = () => {
        dispatch(signOut());
    };

    const menuItems: { icon: React.ReactNode; text: string; path: string }[] = [
        { icon: <AudioLines style={sideBarItemStyle} />, text: 'Recordings', path: '/recordings' },
    ];
    
    return (
        <div style={pageStyle}>
            <div style={sideBarStyle}>
                {isMobile || isTablet ? (
                <div style={barContentWrapperStyle}>
                    <img src={logo} alt="Logo" style={logoStyle} />
                    <SideBarItem
                    icon={<Menu style={sideBarItemStyle} />}
                    text=""
                    isActive={false}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    isMenu={true}
                    />
                </div>
                ) : (
                <>
                    <div>
                        <div style={{ paddingLeft: '10px', paddingTop: '15px' }}>
                            <img src={logo} alt="Logo" style={logoStyle} />
                        </div>
                        <div style={sideBarItemContainerStyle}>
                            {menuItems.map((item) => (
                            <SideBarItem
                                key={item.path}
                                icon={item.icon}
                                text={item.text}
                                isActive={isActive(item.path)}
                                onClick={() => handleNavigate(item.path)}
                                isMenu={false}
                            />
                            ))}
                        </div>
                    </div>

                    <div style={{ paddingBottom: '20px' }}>
                        <div style={sideBarItemContainerStyle}>
                            <SideBarItem
                            icon={<MessageSquareWarning style={sideBarItemStyle} />}
                            text="Report Issue"
                            isActive={false}
                            onClick={() => {setIsReportIssuePopupOpen(true)}}
                            isMenu={false}
                            />
                            <SideBarItem
                            icon={<Settings style={sideBarItemStyle} />}
                            text="Settings"
                            isActive={false}
                            onClick={() => {}}
                            isMenu={false}
                            />
                            <SideBarItem
                            icon={<LogOut style={sideBarItemStyle} />}
                            text="Sign Out"
                            isActive={false}
                            onClick={handleSignOut}
                            isMenu={false}
                            />
                        </div>
                    </div>
                </>
                )}
            </div>

            {isMenuOpen && (isMobile || isTablet) && (
                <>
                <div onClick={() => setIsMenuOpen(false)} style={overlayStyle} />
                    <div style={menuContainerStyle}>
                        <div style={menuPopupStyle}>
                        <div onClick={() => setIsMenuOpen(false)} style={closeButtonStyle}>
                            <X style={sideBarItemStyle} />
                        </div>

                        {menuItems.map((item) => (
                            <SideBarItem
                            key={item.path}
                            icon={item.icon}
                            text={item.text}
                            isActive={isActive(item.path)}
                            onClick={() => {
                                handleNavigate(item.path);
                                setIsMenuOpen(false);
                            }}
                            isMenu={false}
                            />
                        ))}
                        </div>

                        <SideBarItem
                        icon={<LogOut style={sideBarItemStyle} />}
                        text="Sign Out"
                        isActive={false}
                        onClick={handleSignOut}
                        isMenu={false}
                        />
                    </div>
                </>
            )}

            <div style={contentStyle}>
                {children}
            </div>

            <CreateAndUpdateIssuePopup
                isVisible={isReportIssuePopupOpen}
                onClose={() => setIsReportIssuePopupOpen(false)}
            />
        </div>
    );
};

export default ContentLayout;
