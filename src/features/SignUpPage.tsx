import { useState, useEffect, type CSSProperties } from 'react';
import Colors from '../assets/styles/Color';
import Size from '../assets/styles/Size';
import { isValidEmail } from '../utils/format';
import { PrimaryTextField, PrimaryDropdown, PrimaryDatePicker } from '../components/common';
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
    const [city, setCity] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');

    // Gender options for the dropdown
    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
        { value: 'prefer-not-to-say', label: 'Prefer not to say' }
    ];

    useEffect(() => {
        if (error) {
            setErrorMessage(error);
        }
    }, [error]);

    const inputContainerStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: Size.Medium,
        marginTop: Size.Small,
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
        marginTop: Size.LargeMedium,
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

    const halfFormContainerStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        gap: Size.Medium,
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
        } if (!fullName.trim()) {
            setErrorMessage('Please enter your full name.');
            return;
        } if (!city.trim()) {
            setErrorMessage('Please enter your city.');
            return;
        } if (!gender) {
            setErrorMessage('Please select your gender.');
            return;
        } if (!dateOfBirth) {
            setErrorMessage('Please select your date of birth.');
            return;
        }
        setErrorMessage('');
        dispatch(setUserError(''));
        dispatch(signIn(email, password));
    };
    
    useEffect(() => {
        setErrorMessage('');
    }, [email, password, confirmPassword, fullName, city, gender, dateOfBirth]);

    return (
        <AuthPageLayout
            title="Create Your Account"
            signUp={true}
        >
            <div style={inputContainerStyle}>
                <PrimaryTextField type="text" label="Email" value={email} onChange={setEmail} placeholder="Enter your email" />
                <PrimaryTextField type="password" label="Password" value={password} onChange={setPassword} placeholder="Enter your password" />
                <PrimaryTextField type="password" label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Confirm your password" />

                <div style={halfFormContainerStyle}>
                    <PrimaryDropdown
                        label="Gender"
                        value={gender}
                        onChange={setGender}
                        placeholder="Select your gender"
                        options={genderOptions}
                    />
                    <PrimaryDatePicker
                        label="Date of Birth"
                        value={dateOfBirth}
                        onChange={setDateOfBirth}
                        placeholder="Select your date of birth"
                        maxDate={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <PrimaryTextField type="text" label="Full Name" value={fullName} onChange={setFullName} placeholder="Enter your full name" />

                <div style={halfFormContainerStyle}>
                    <PrimaryTextField type="text" label="City" value={city} onChange={setCity} placeholder="Enter your city" />
                </div>
            </div>

            <div style={buttonContainerStyle}>
                <PrimaryButton label="Sign Up Your Account" onClick={handleSignIn} />
            </div>

            {errorMessage && (
                <div style={errorMessageContainerStyle}>
                    <ErrorMessage message={errorMessage} />
                </div>
            )}

            <div style={createAccountStyle}>
                <span style={dontHaveAccountTextStyle}>Already have an account? </span>
                <span>{" "}</span>
                <span style={createAccountTextStyle} onClick={() => safeNavigate('/')}>Sign in here</span>
                <ArrowRightIcon style={arrowRightIconStyle} />
            </div>

        </AuthPageLayout>
    );
};

export default SignUpPage;