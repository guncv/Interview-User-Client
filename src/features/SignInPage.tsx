import { type CSSProperties } from 'react';
import Colors from '../assets/styles/Color';
import Size from '../assets/styles/Size';
import { GoogleSignInButton } from '../components/common/GoogleSignInButton';
import { FacebookSignInButton } from '../components/common/FacebookSignInButton';
import { OrDivider } from '../components/common/OrDivider';
import { useContextProvider } from '../components/layout/ContextProvider';
import { useDispatch, useSelector } from 'react-redux';
import { setUserError, getGoogleAuthURL, getFacebookAuthURL } from '../actions/userAction';
import type { RootState } from '../reducers/rootReducer';
import AuthPageLayout from '../components/layout/AuthPageLayout';
import font from '../assets/styles/Font';

const SignInPage = () => {
    const { isMobile } = useContextProvider();
    const dispatch = useDispatch();
    const { error } = useSelector((state: RootState) => state.user);

    const buttonsContainerStyle: CSSProperties = {
        width: isMobile ? '80vw' : '450px',
        marginTop: Size.ExtraLarge,
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '0' : Size.Medium,
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

    const handleFacebookSignIn = () => {
        dispatch(setUserError(''));
        dispatch(getFacebookAuthURL());
    };

    return (
        <AuthPageLayout
            title="Welcome Back To "
            highlight="Evalia"
            description="Please sign in to continue to your account."
        >
            <div style={buttonsContainerStyle}>
                <GoogleSignInButton onClick={handleGoogleSignIn} />
                <OrDivider />
                <FacebookSignInButton onClick={handleFacebookSignIn} />
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