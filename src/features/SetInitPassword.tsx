import { useState, useEffect, type CSSProperties } from 'react';

import Colors from '../assets/styles/Color';
import Size from '../assets/styles/Size';
import { PrimaryTextField } from '../components/common/PrimaryTextField';
import { ArrowLeftIcon } from 'lucide-react';
import { safeNavigate } from '../utils/navigation';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { useContextProvider } from '../components/layout/ContextProvider';
import AuthPageLayout from '../components/layout/AuthPageLayout';
import { useDispatch, useSelector } from 'react-redux';
import { setInitialPassword, setUserError } from '../actions/userAction';
import type { RootState } from '../reducers/rootReducer';

const SetInitPasswordPage = () => {
    const dispatch = useDispatch();
    const { isMobile } = useContextProvider();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { error } = useSelector((state: RootState) => state.user);

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
    

    const handleSignIn = () => {
        if (!password || !confirmPassword) {
            setErrorMessage('Please enter and confirm your new password.');
            return;
        } if (password !== confirmPassword) {
            setErrorMessage('The passwords do not match. Please try again.');
            return;
        } if (password.length < 8) {
            setErrorMessage('Your password must be at least 8 characters long.');
            return;
        }
        setErrorMessage('');

        dispatch(setUserError(''));
        dispatch(setInitialPassword(password));
    };
    
    useEffect(() => {
        setErrorMessage('');
    }, [password, confirmPassword]);

    return (
        <AuthPageLayout
            title="Reset Your Password"
            description={'Please enter your new password and confirm to sign in again.'}
        >

            <div style={inputContainerStyle}>
                <PrimaryTextField type="password" label="New Password" value={password} onChange={setPassword} placeholder="Enter your new password" />
                <PrimaryTextField type="password" label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Confirm your new password" />
            </div>

            <div style={buttonContainerStyle}>
                <PrimaryButton label="Reset Password" onClick={handleSignIn} />
            </div>

            <div style={backToSignInStyle}>
                <span style={backToSignInTextStyle} onClick={() => safeNavigate('/')}><ArrowLeftIcon style={arrowLeftIconStyle} />Back to Sign In</span>
            </div>

            <div style={errorMessageContainerStyle}>
                <ErrorMessage message={errorMessage} />
            </div>
        </AuthPageLayout>
    );
};


export default SetInitPasswordPage;