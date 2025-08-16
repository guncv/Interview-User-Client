import { useState, useEffect, type CSSProperties } from 'react';
import Colors from '../assets/styles/Color';
import Size from '../assets/styles/Size';
import { isValidEmail } from '../utils/format';
import { PrimaryTextField } from '../components/common/PrimaryTextField';
import { safeNavigate } from '../utils/navigation';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { useContextProvider } from '../components/layout/ContextProvider';
import { useDispatch, useSelector } from 'react-redux';
import { setUserError, signIn } from '../actions/userAction';
import type { RootState } from '../reducers/rootReducer';
import AuthPageLayout from '../components/layout/AuthPageLayout';
import { ArrowRightIcon } from 'lucide-react';
import font from '../assets/styles/Font';

const SignUpPage = () => {
    const { isMobile } = useContextProvider();
    const dispatch = useDispatch();
    const { error } = useSelector((state: RootState) => state.user);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [fullName, setFullName] = useState('');

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
        width: isMobile ? '80vw' : '450px',
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

    const errorMessageContainerStyle: CSSProperties = {
        width: isMobile ? '80vw' : '400px',
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
            setErrorMessage('Please enter both your email and password.');
            return;
        } if (!isValidEmail(email)) {
            setErrorMessage('The email address you entered is not valid. Please check and try again.');
            return;
        } if (password.length < 8) {
            setErrorMessage('Your password must be at least 8 characters long.');
            return;
        } if (password !== confirmPassword) {
            setErrorMessage('The passwords you entered do not match. Please check and try again.');
            return;
        }
        setErrorMessage('');
        dispatch(setUserError(''));
        dispatch(signIn(email, password));
    };
    
    useEffect(() => {
        setErrorMessage('');
    }, [email, password, confirmPassword]);

    return (
        <AuthPageLayout
            title="Create Your Account"
            description="Please enter your email and password to create your account."
            signUp={true}
        >
            <div style={inputContainerStyle}>
                <PrimaryTextField type="text" label="Email" value={email} onChange={setEmail} placeholder="Enter your email" />
                <PrimaryTextField type="password" label="Password" value={password} onChange={setPassword} placeholder="Enter your password" />
                <PrimaryTextField type="password" label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Confirm your password" />
                <PrimaryTextField type="text" label="Full Name" value={fullName} onChange={setFullName} placeholder="Enter your full name" />
            </div>

            <div style={buttonContainerStyle}>
                <PrimaryButton label="Sign In" onClick={handleSignIn} />
            </div>

            <div style={createAccountStyle}>
                <span style={dontHaveAccountTextStyle}>Don't have an account? </span>
                <span>{" "}</span>
                <span style={createAccountTextStyle} onClick={() => safeNavigate('/create-account')}>Sign up here</span>
                <ArrowRightIcon style={arrowRightIconStyle} />
            </div>

            <div style={errorMessageContainerStyle}>
                <ErrorMessage message={errorMessage} />
            </div>
        </AuthPageLayout>
    );
};

export default SignUpPage;