import React, { useEffect, useState } from 'react';
import Colors from '../../assets/styles/Color';
import { hideSignOutPopup } from '../layout/AppProvider';
import { PrimaryButton } from './PrimaryButton';
import { useContextProvider } from '../layout/ContextProvider';
import Size from '../../assets/styles/Size';
import Font from '../../assets/styles/Font';
import { signOut } from '../../actions/userAction';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../reducers/rootReducer';
import { ErrorMessage } from './ErrorMessage';

interface SignOutPopupProps {
    isVisible?: boolean;
}

const SignOutPopup: React.FC<SignOutPopupProps> = ({ isVisible }) => {
    const { isMobile, isTablet } = useContextProvider();
    const { error } = useSelector((state: RootState) => state.user);
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        if (isVisible && (isMobile || isTablet)) {
        document.body.style.overflow = 'hidden';
        } else {
        document.body.style.overflow = '';
        }
        return () => {
        document.body.style.overflow = '';
        };
    }, [isVisible, isMobile, isTablet]);

    const overlayStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: Colors.PRIMARY_COLOR,
        opacity: 0.75,
        zIndex: 1000,
    };

    const containerWrapperStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1001,
    };

    const popupBoxStyle: React.CSSProperties = {
        width: isMobile ? '90%' : '500px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.TEXT_WHITE_COLOR,
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
        gap: '10px',
    };

    const titleStyle: React.CSSProperties = {
        fontSize: isMobile ? Size.LargeMedium : Size.Large,
        fontFamily: Font.Medium,
        textAlign: 'center',
    };

    const descriptionStyle: React.CSSProperties = {
        fontSize: Size.Medium,
        color: Colors.SECONDARY_TEXT_COLOR,
        fontFamily: Font.Regular,
        textAlign: 'center',
    };

    const buttonContainerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: '20px',
        gap: '20px',
    };

    const errorMessageStyle: React.CSSProperties = {
        marginTop: '20px',
        fontSize: Size.Medium,
        fontWeight: Font.Regular,
        color: Colors.TEXT_ERROR_COLOR,
        textAlign: 'center',
    };

    const handleCancel = () => {
        hideSignOutPopup();
    };

    const handleSignOut = () => {
        setErrorMessage('');
        dispatch(signOut());

        if (error) {
            setErrorMessage(error);
        }
    };

    useEffect(() => {
        if (error) {
            setErrorMessage(error);
        }
    }, [error]);

    if (!isVisible) {
        return null;
    }

    return (
        <>
            <div style={overlayStyle} />
            <div style={containerWrapperStyle}>
                <div style={popupBoxStyle}>
                    <div style={titleStyle}>Are you sure you want to sign out?</div>
                    <div style={descriptionStyle}>You will be signed out of your account and redirected to the login page.</div>
                    <div style={buttonContainerStyle}>
                        <PrimaryButton label="Cancel" onClick={handleCancel} isCancel={true} />
                        <PrimaryButton label="Sign Out" onClick={handleSignOut} />
                    </div>

                    {errorMessage &&
                        <div style={errorMessageStyle}>
                            <ErrorMessage message={errorMessage}
                            />
                        </div>
                    }
                </div>
            </div>
        </>
    );
};

export default SignOutPopup;
