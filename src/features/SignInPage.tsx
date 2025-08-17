import { useState, useEffect, type CSSProperties } from 'react';
import Colors from '../assets/styles/Color';
import Size from '../assets/styles/Size';
import { isValidEmail } from '../utils/format';
import { PrimaryTextField } from '../components/common/PrimaryTextField';
import { safeNavigate } from '../utils/navigation';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { useContextProvider } from '../components/layout/ContextProvider';
import { useDispatch, useSelector } from 'react-redux';
import { setUserError, signIn } from '../actions/userAction';
import type { RootState } from '../reducers/rootReducer';
import AuthPageLayout from '../components/layout/AuthPageLayout';
import { ArrowRightIcon } from 'lucide-react';
import font from '../assets/styles/Font';

const SignInPage = () => {
    const { isMobile } = useContextProvider();
    const dispatch = useDispatch();
    const { error } = useSelector((state: RootState) => state.user);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        if (error) {
            setEmailError(error);
        }
    }, [error]);

    const inputContainerStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: Size.Medium,
        marginTop: Size.Large,
        width: isMobile ? '80vw' : '450px',
    };

    const forgotPasswordContainerStyle: CSSProperties = {
        width: isMobile ? '80vw' : '450px',
        textAlign: 'right',
        marginTop: Size.Small,
    };

    const forgotPasswordTextStyle: CSSProperties = {
        cursor: 'pointer',
        display: 'inline-block',
        color: Colors.ACCENT_COLOR,
        fontSize: Size.Medium,
    };

    const dontHaveAccountTextStyle: CSSProperties = {
        display: 'inline-block',
        color: Colors.SECONDARY_TEXT_COLOR,
        fontSize: Size.Medium,
        fontFamily: font.Regular,
    };

    const createAccountTextStyle: CSSProperties = {
        cursor: 'pointer',
        display: 'inline-block',
        color: Colors.ACCENT_COLOR,
        fontSize: Size.Medium,
    };

    const arrowRightIconStyle: CSSProperties = {
        marginLeft: Size.Small,
        verticalAlign: 'middle',
        width: Size.Medium,
        height: Size.Medium,
    };


    const buttonContainerStyle: CSSProperties = {
        width: isMobile ? '80vw' : '450px',
        marginTop: Size.ExtraLarge,
    };

    const createAccountStyle: CSSProperties = {
        width: isMobile ? '80vw' : '450px',
        fontSize: Size.Medium,
        marginTop: Size.Small,
        color: Colors.ACCENT_COLOR,
        fontFamily: font.Regular,
    };

    const handleSignIn = () => {
        if (!email || !password) {
            setEmailError('Please enter both your email and password.');
            return;
        } if (!isValidEmail(email)) {
            setEmailError('The email address you entered is not valid. Please check and try again.');
            return;
        } if (password.length < 8) {
            setPasswordError('Your password must be at least 8 characters long.');
            return;
        }
        setEmailError('');
        setPasswordError('');
        dispatch(setUserError(''));
        dispatch(signIn(email, password));
    };
    
    useEffect(() => {
        setEmailError('');
        setPasswordError('');
    }, [email, password]);

    return (
        <AuthPageLayout
            title="Welcome Back To Eval"
            highlight="ia"
            description="Please sign in to continue to your account."
        >
            <div style={inputContainerStyle}>
                <PrimaryTextField type="text" label="Email" value={email} onChange={setEmail} placeholder="Enter your email" error={emailError} />
                <PrimaryTextField type="password" label="Password" value={password} onChange={setPassword} placeholder="Enter your password" error={passwordError} />
            </div>

            <div style={forgotPasswordContainerStyle}>
                <span style={forgotPasswordTextStyle} onClick={() => safeNavigate('/forgot-password')}>Forgot Password?</span>
            </div>

            <div style={buttonContainerStyle}>
                <PrimaryButton label="Sign In" onClick={handleSignIn} />
            </div>

            <div style={createAccountStyle}>
                <span style={dontHaveAccountTextStyle}>Don't have an account? </span>
                <span>{" "}</span>
                <span style={createAccountTextStyle} onClick={() => safeNavigate('/sign-up')}>Sign up here</span>
                <ArrowRightIcon style={arrowRightIconStyle} />
            </div>
        </AuthPageLayout>
    );
};

export default SignInPage;