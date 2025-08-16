import { useState, useEffect, type CSSProperties } from 'react';
import Colors from '../assets/styles/Color';
import Size from '../assets/styles/Size';
import { isValidEmail } from '../utils/format';
import { PrimaryTextField } from '../components/common/PrimaryTextField';
import { ArrowLeftIcon } from 'lucide-react';
import { safeNavigate } from '../utils/navigation';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { useContextProvider } from '../components/layout/ContextProvider';
import AuthPageLayout from '../components/layout/AuthPageLayout';
import { forgotPassword } from '../actions/userAction';
import { useDispatch } from 'react-redux';

const ForgotPasswordPage = () => {
    const { isMobile } = useContextProvider();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [buttonLabel, setButtonLabel] = useState('Send Reset Password Link');
    const [countdown, setCountdown] = useState(0);


    useEffect(() => {
        let interval: NodeJS.Timeout;
    
        if (countdown > 0) {
            setButtonLabel(`Resend Link (${countdown}s)`);
            setIsButtonDisabled(true);
            interval = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else {
            if (isSent) {
                setButtonLabel('Resend Link');
                setIsButtonDisabled(false);
            } else {
                setButtonLabel('Send Reset Password Link');
            }
        }
    
        return () => clearInterval(interval);
    }, [countdown, isSent]);
    
    const inputContainerStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: Size.Medium,
        marginTop: Size.Large,
        width: isMobile ? '80vw' : '400px',
    };

    const buttonContainerStyle: CSSProperties = {
        width: isMobile ? '80vw' : '400px',
        marginTop: Size.ExtraLarge,
    };

    const backToSignInStyle: CSSProperties = {
        width: isMobile ? '80vw' : '400px',
        fontSize: Size.Medium,
        marginTop: Size.Large,
        color: Colors.ACCENT_COLOR,
    };

    const backToSignInTextStyle: CSSProperties = {
        cursor: 'pointer',
        display: 'inline-block',

    };

    const arrowLeftIconStyle: CSSProperties = {
        marginRight: Size.Small,
        verticalAlign: 'middle',
        width: Size.Medium,
        height: Size.Medium,
    };

    const errorMessageContainerStyle: CSSProperties = {
        width: isMobile ? '80vw' : '400px',
        marginTop: Size.ExtraLarge,
    };

    const infoMessageContainerStyle: CSSProperties = {
        width: isMobile ? '80vw' : '400px',
        marginTop: Size.ExtraLarge,
    };

    const infoMessageStyle: CSSProperties = {
        fontSize: Size.Medium,
        color: Colors.SECONDARY_TEXT_COLOR,
        textAlign: 'center',
    };

    const buttonStyle: CSSProperties = {
        backgroundColor: isButtonDisabled ? Colors.DISABLED_TEXT_COLOR : Colors.ACCENT_COLOR,
        color: isButtonDisabled ? Colors.SECONDARY_TEXT_COLOR : Colors.TEXT_WHITE_COLOR,
    };

    const handleSignIn = () => {
        if (!email) {
            setErrorMessage('Please enter your email address.');
            setIsSent(false);
            setInfoMessage('');
            return;
        }
        if (!isValidEmail(email)) {
            setErrorMessage('Please enter a valid email address to receive the reset link.');
            setIsSent(false);
            setInfoMessage('');
            return;
        }
    
        setErrorMessage('');
        setIsSent(true);
        setCountdown(3);
        setInfoMessage('If an account with this email exists, we’ll send you a reset link shortly.');
        dispatch(forgotPassword(email));
    };
    
    
    useEffect(() => {
        setErrorMessage('');
        setInfoMessage('');
    }, [email]);

    return (
        <AuthPageLayout
            title="Forgot Password"
            description={'Please enter the email you used to register.\nWe\'ll send you a link to reset your password.'}
            isSignIn={false}
        >

            <div style={inputContainerStyle}>
                <PrimaryTextField type="text" label="Email" value={email} onChange={setEmail} placeholder="Enter your email" />
            </div>

            <div style={buttonContainerStyle}>
                <PrimaryButton label={buttonLabel} onClick={handleSignIn} style={buttonStyle}/>
            </div>

            <div style={backToSignInStyle}>
                <span style={backToSignInTextStyle} onClick={() => safeNavigate('/')}><ArrowLeftIcon style={arrowLeftIconStyle} />Back to Sign In</span>
            </div>

            {errorMessage && (
                <div style={errorMessageContainerStyle}>
                    <ErrorMessage message={errorMessage} />
                </div>
            )}

            {infoMessage && (
                <div style={infoMessageContainerStyle}>
                    <div style={infoMessageStyle}>{infoMessage}</div>
                </div>
            )}
        </AuthPageLayout>
    );
};

export default ForgotPasswordPage;