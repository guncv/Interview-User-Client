import { useEffect, type CSSProperties } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { handleGoogleCallback } from '../actions/userAction';
import Colors from '../assets/styles/Color';
import Size from '../assets/styles/Size';
import font from '../assets/styles/Font';
import AuthPageLayout from '../components/layout/AuthPageLayout';

const OAuthCallbackPage = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    const loadingStyle: CSSProperties = {
        fontSize: Size.Medium,
        color: Colors.SECONDARY_TEXT_COLOR,
        fontFamily: font.Regular,
        textAlign: 'center',
        marginTop: Size.Large,
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (code) {
            dispatch(handleGoogleCallback(code, state || undefined));
        }
    }, [dispatch, location.search]);

    return (
        <AuthPageLayout
            title="Completing "
            highlight="Sign In"
            description="Please wait while we complete your authentication."
        >
            <div style={loadingStyle}>
                Processing your Google sign-in...
            </div>
        </AuthPageLayout>
    );
};

export default OAuthCallbackPage;
