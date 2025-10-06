import { type CSSProperties } from 'react';
import Colors from '../assets/styles/Color';
import Size from '../assets/styles/Size';
import { GoogleSignInButton } from '../components/common/GoogleSignInButton';
import { useContextProvider } from '../components/layout/ContextProvider';
import { useDispatch, useSelector } from 'react-redux';
import { setUserError, getGoogleAuthURL } from '../actions/userAction';
import type { RootState } from '../reducers/rootReducer';
import AuthPageLayout from '../components/layout/AuthPageLayout';
import font from '../assets/styles/Font';

const SignInPage = () => {
    const { isMobile } = useContextProvider();
    const dispatch = useDispatch();
    const { error } = useSelector((state: RootState) => state.user);

    const buttonContainerStyle: CSSProperties = {
        width: isMobile ? '80vw' : '450px',
        marginTop: Size.ExtraLarge,
    };

    const oauthDescriptionStyle: CSSProperties = {
        width: isMobile ? '80vw' : '450px',
        fontSize: isMobile ? Size.Small : Size.Medium,
        color: Colors.SECONDARY_TEXT_COLOR,
        fontFamily: font.Regular,
        textAlign: 'center',
        marginTop: Size.Medium,
        lineHeight: '1.5',
    };

    const backendErrorStyle: CSSProperties = {
        width: isMobile ? '80vw' : '450px',
        marginTop: Size.Medium,
        padding: Size.Medium,
        color: Colors.TEXT_ERROR_COLOR,
        fontSize: isMobile ? Size.Small : Size.Medium,
        fontFamily: font.Regular,
        textAlign: 'center',
    };

    const handleGoogleSignIn = () => {
        dispatch(setUserError(''));
        dispatch(getGoogleAuthURL());
    };

    return (
        <AuthPageLayout
            title="Welcome Back To "
            highlight="Evalia"
            description="Please sign in to continue to your account."
        >
            <div style={buttonContainerStyle}>
                <GoogleSignInButton onClick={handleGoogleSignIn} />
            </div>

            {error && (
                <div style={backendErrorStyle}>
                    {error}
                </div>
            )}
        </AuthPageLayout>
    );
};

export default SignInPage;