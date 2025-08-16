import { useState, useEffect, type CSSProperties } from 'react';
import Colors from '../assets/styles/Color';
import Size from '../assets/styles/Size';
import { isValidEmail } from '../utils/format';
import { PrimaryTextField } from '../components/common/PrimaryTextField';
import { safeNavigate } from '../utils/navigation';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { useContextProvider } from '../components/layout/ContextProvider';
import AuthPageLayout from '../components/layout/AuthPageLayout';
import { useDispatch, useSelector } from 'react-redux';
import { setUserError, signIn } from '../actions/userAction';
import type { RootState } from '../reducers/rootReducer';

const SignInPage = () => {
    const { isMobile } = useContextProvider();
    const dispatch = useDispatch();
    const { error } = useSelector((state: RootState) => state.user);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (error) {
            setErrorMessage(error);
        }
    }, [error]);

    const inputContainerStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: Size.Medium,
        marginTop: Size.Large,
        width: isMobile ? '80vw' : '400px',
    };

    const forgotPasswordContainerStyle: CSSProperties = {
        width: isMobile ? '80vw' : '400px',
        textAlign: 'right',
        marginTop: Size.Small,
    };

    const forgotPasswordTextStyle: CSSProperties = {
        cursor: 'pointer',
        display: 'inline-block',
        color: Colors.ACCENT_COLOR,
        fontSize: Size.Medium,
    };


    const buttonContainerStyle: CSSProperties = {
        width: isMobile ? '80vw' : '400px',
        marginTop: Size.ExtraLarge,
    };

    const errorMessageContainerStyle: CSSProperties = {
        width: isMobile ? '80vw' : '400px',
        marginTop: Size.ExtraLarge,
    };

    const handleSignIn = () => {
        if (!email || !password) {
            setErrorMessage('Please enter both your email and password.');
            return;
        } if (!isValidEmail(email)) {
            setErrorMessage('The email address you entered is not valid. Please check and try again.');
            return;
        } if (password.length < 8) {
            setErrorMessage('Your password must be at least 8 characters long.');
            return;
        }
        setErrorMessage('');
        dispatch(setUserError(''));
        dispatch(signIn(email, password));
    };
    
    useEffect(() => {
        setErrorMessage('');
    }, [email, password]);

    return (
        <AuthPageLayout
        title="Welcome Back To Onyx"
        highlight="XR"
        description="Please sign in to continue to your account."
        isSignIn
        >
            <div style={inputContainerStyle}>
                <PrimaryTextField type="text" label="Email" value={email} onChange={setEmail} placeholder="Enter your email" />
                <PrimaryTextField type="password" label="Password" value={password} onChange={setPassword} placeholder="Enter your password" />
            </div>

            <div style={forgotPasswordContainerStyle}>
                <span style={forgotPasswordTextStyle} onClick={() => safeNavigate('/forgot-password')}>Forgot Password?</span>
            </div>

            <div style={buttonContainerStyle}>
                <PrimaryButton label="Sign In" onClick={handleSignIn} />
            </div>

            <div style={errorMessageContainerStyle}>
                <ErrorMessage message={errorMessage} />
            </div>
        </AuthPageLayout>
    );
};

export default SignInPage;