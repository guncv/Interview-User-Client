import { useState, useEffect, type CSSProperties } from 'react';
import Colors from '../assets/styles/Color';
import Size from '../assets/styles/Size';
import { PrimaryTextField } from '../components/common/PrimaryTextField';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { useContextProvider } from '../components/layout/ContextProvider';
import { ArrowLeftIcon } from 'lucide-react';
import { safeNavigate } from '../utils/navigation';
import font from '../assets/styles/Font';
import AuthPageLayout from "../components/layout/AuthPageLayout";
import { resetVerifyEmail, verifyEmail } from '../actions/userAction';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../reducers/rootReducer';
import { useLocation } from 'react-router-dom';

const VerifyEmail = () => {
    const { isMobile } = useContextProvider();
    const dispatch = useDispatch();
    const { error } = useSelector((state: RootState) => state.user);
    const location = useLocation();
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [canResend, setCanResend] = useState(true);
    const [token, setToken] = useState<string>('');

    const otpRegex = /^[A-Z0-9]{6}$/;


    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tokenFromUrl = urlParams.get('token');
        setToken(tokenFromUrl || '');
    }, [location.search]);

    useEffect(() => {
        if (error) {
            // Clear field errors when there's a backend error
            setOtpError('');
        }
    }, [error]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        
        if (countdown > 0) {
            setCanResend(false);
            interval = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }

        return () => clearInterval(interval);
    }, [countdown]);

    const handleOtpChange = (value: string) => {
        const cleanValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        
        if (cleanValue.length <= 6) {
            setOtp(cleanValue);
            setOtpError('');
        }
    };

    const handleVerify = () => {
        if (!otp) {
            setOtpError('Please enter the verification code');
            return;
        }
        
        if (!otpRegex.test(otp)) {
            setOtpError('Please enter a valid 6-character verification code');
            return;
        }

        setIsVerifying(true);
        dispatch(verifyEmail({ token: token, code: otp }));
        
        setTimeout(() => {
            setIsVerifying(false);
        }, 2000);
    };

    const handleResendCode = () => {
        if (!canResend) return;
        
        dispatch(resetVerifyEmail(token!));
        setCountdown(5);
    };

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
        fontSize: isMobile ? Size.Small : Size.Medium,
        marginTop: Size.Small,
        color: Colors.ACCENT_COLOR,
    };

    const backToSignInTextStyle: CSSProperties = {
        cursor: 'pointer',
        display: 'inline-block',
        fontSize: isMobile ? Size.Small : Size.Medium,
    };

    const arrowLeftIconStyle: CSSProperties = {
        marginRight: Size.Small,
        verticalAlign: 'middle',
        width: isMobile ? Size.Small : Size.Medium,
        height: isMobile ? Size.Small : Size.Medium,
    };

    const resendContainerStyle: CSSProperties = {
        width: isMobile ? '80vw' : '400px',
        textAlign: 'center',
        marginTop: Size.Medium,
    };

    const resendTextStyle: CSSProperties = {
        fontSize: isMobile ? Size.Small : Size.Medium,
        color: Colors.SECONDARY_TEXT_COLOR,
        fontFamily: font.Regular,
    };

    const backendErrorStyle: CSSProperties = {
        width: isMobile ? '80vw' : '400px',
        marginTop: Size.Medium,
        padding: Size.Medium,
        color: Colors.TEXT_ERROR_COLOR,
        fontSize: isMobile ? Size.Small : Size.Medium,
        fontFamily: font.Regular,
        textAlign: 'center',
    };

    const resendButtonStyle: CSSProperties = {
        cursor: canResend ? 'pointer' : 'default',
        color: canResend ? Colors.ACCENT_COLOR : Colors.DISABLED_TEXT_COLOR,
        textDecoration: 'underline',
        marginLeft: Size.Small,
        opacity: canResend ? 1 : 0.6,
        fontSize: isMobile ? Size.Small : Size.Medium,
    };

    return (
        <AuthPageLayout
            title="Verify Your Email"
            description="We've sent a 6-character verification code to your email address."
        >
            <div style={inputContainerStyle}>
                <PrimaryTextField 
                    type="text" 
                    label="Verification Code" 
                    value={otp} 
                    onChange={handleOtpChange} 
                    placeholder="Enter 6-character code" 
                    error={otpError}
                />
            </div>

            <div style={buttonContainerStyle}>
                <PrimaryButton 
                    label={isVerifying ? "Verifying..." : "Verify Email"} 
                    onClick={handleVerify}
                    isDisabled={isVerifying}
                />
            </div>

            <div style={resendContainerStyle}>
                <span style={resendTextStyle}>Didn't receive the code?</span>
                {canResend ? (
                    <span style={resendButtonStyle} onClick={handleResendCode}>
                        Resend Code
                    </span>
                ) : (
                    <span style={resendButtonStyle}>
                        Resend Code ({countdown}s)
                    </span>
                )}
            </div>

            {error && (
                <div style={backendErrorStyle}>
                    {error}
                </div>
            )}

            <div style={backToSignInStyle}>
                <span style={backToSignInTextStyle} onClick={() => safeNavigate('/')}>
                    <ArrowLeftIcon style={arrowLeftIconStyle} />Back to Sign In
                </span>
            </div>
        </AuthPageLayout>
    );
};

export default VerifyEmail;