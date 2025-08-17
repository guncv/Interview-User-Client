import { useState, useEffect, type CSSProperties } from 'react';
import Colors from '../assets/styles/Color';
import Size from '../assets/styles/Size';
import { isValidEmail, formatDateForBackend } from '../utils/format';
import { PrimaryTextField, PrimaryDropdown, PrimaryDatePicker } from '../components/common';
import { safeNavigate } from '../utils/navigation';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { useContextProvider } from '../components/layout/ContextProvider';
import { useDispatch, useSelector } from 'react-redux';
import { setUserError, signUp } from '../actions/userAction';
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
    const [fullName, setFullName] = useState('');
    const [country, setCountry] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');

    // Field-specific error states
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [fullNameError, setFullNameError] = useState('');
    const [countryError, setCountryError] = useState('');
    const [genderError, setGenderError] = useState('');
    const [dateOfBirthError, setDateOfBirthError] = useState('');

    // Gender options for the dropdown
    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
        { value: 'prefer-not-to-say', label: 'Prefer not to say' }
    ];

    useEffect(() => {
        if (error) {
            // Set a general error for the email field if it's a server error
            setEmailError(error);
        }
    }, [error]);

    const validateField = (fieldName: string, value: string) => {
        switch (fieldName) {
            case 'email':
                if (!value) {
                    setEmailError('Required');
                    return false;
                }
                if (!isValidEmail(value)) {
                    setEmailError('Please enter a valid email address');
                    return false;
                }
                setEmailError('');
                return true;
            
            case 'password':
                if (!value) {
                    setPasswordError('Required');
                    return false;
                }
                if (value.length < 8) {
                    setPasswordError('Password must be at least 8 characters');
                    return false;
                }
                setPasswordError('');
                return true;
            
            case 'confirmPassword':
                if (!value) {
                    setConfirmPasswordError('Required');
                    return false;
                }
                if (value !== password) {
                    setConfirmPasswordError('Passwords do not match');
                    return false;
                }
                setConfirmPasswordError('');
                return true;
            
            case 'fullName':
                if (!value.trim()) {
                    setFullNameError('Required');
                    return false;
                }
                setFullNameError('');
                return true;
            
            case 'country':
                if (!value.trim()) {
                    setCountryError('Required');
                    return false;
                }
                setCountryError('');
                return true;
            
            case 'gender':
                if (!value) {
                    setGenderError('Required');
                    return false;
                }
                setGenderError('');
                return true;
            
            case 'dateOfBirth':
                if (!value) {
                    setDateOfBirthError('Required');
                    return false;
                }
                setDateOfBirthError('');
                return true;
            
            default:
                return true;
        }
    };

    const handleFieldChange = (fieldName: string, value: string) => {
        // Update the field value
        switch (fieldName) {
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
            case 'fullName':
                setFullName(value);
                break;
            case 'country':
                setCountry(value);
                break;
            case 'gender':
                setGender(value);
                break;
            case 'dateOfBirth':
                setDateOfBirth(value);
                break;
        }

        // Clear the error when user starts typing
        if (value) {
            validateField(fieldName, value);
        } else {
            // Clear error if field is empty
            switch (fieldName) {
                case 'email':
                    setEmailError('');
                    break;
                case 'password':
                    setPasswordError('');
                    break;
                case 'confirmPassword':
                    setConfirmPasswordError('');
                    break;
                case 'fullName':
                    setFullNameError('');
                    break;
                case 'country':
                    setCountryError('');
                    break;
                case 'gender':
                    setGenderError('');
                    break;
                case 'dateOfBirth':
                    setDateOfBirthError('');
                    break;
            }
        }
    };

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
        const isEmailValid = validateField('email', email);
        const isPasswordValid = validateField('password', password);
        const isConfirmPasswordValid = validateField('confirmPassword', confirmPassword);
        const isFullNameValid = validateField('fullName', fullName);
        const isCountryValid = validateField('country', country);
        const isGenderValid = validateField('gender', gender);
        const isDateOfBirthValid = validateField('dateOfBirth', dateOfBirth);

        if (isEmailValid && isPasswordValid && isConfirmPasswordValid && 
            isFullNameValid && isCountryValid && isGenderValid && isDateOfBirthValid) {
            dispatch(setUserError(''));
            dispatch(signUp({
                email: email,
                password: password,
                full_name: fullName,
                country: country,
                gender,
                date_of_birth: formatDateForBackend(dateOfBirth),
            }));
        }
    };
    
    useEffect(() => {
        // Clear all errors when component mounts or when server error changes
        if (!error) {
            setEmailError('');
            setPasswordError('');
            setConfirmPasswordError('');
            setFullNameError('');
            setCountryError('');
            setGenderError('');
            setDateOfBirthError('');
        }
    }, [error]);

    return (
        <AuthPageLayout
            title="Create Your Account"
            signUp={true}
        >
            <div style={inputContainerStyle}>
                <PrimaryTextField 
                    type="text" 
                    label="Email" 
                    value={email} 
                    onChange={(value) => handleFieldChange('email', value)} 
                    placeholder="Enter your email" 
                    error={emailError}
                />
                <PrimaryTextField 
                    type="password" 
                    label="Password" 
                    value={password} 
                    onChange={(value) => handleFieldChange('password', value)} 
                    placeholder="Enter your password" 
                    error={passwordError}
                />
                <PrimaryTextField 
                    type="password" 
                    label="Confirm Password" 
                    value={confirmPassword} 
                    onChange={(value) => handleFieldChange('confirmPassword', value)} 
                    placeholder="Confirm your password" 
                    error={confirmPasswordError}
                />

                <div style={halfFormContainerStyle}>
                    <PrimaryDropdown
                        label="Gender"
                        value={gender}
                        onChange={(value) => handleFieldChange('gender', value)}
                        placeholder="Select your gender"
                        options={genderOptions}
                        error={genderError}
                    />
                    <PrimaryDatePicker
                        label="Date of Birth"
                        value={dateOfBirth}
                        onChange={(value) => handleFieldChange('dateOfBirth', value)}
                        placeholder="Select your date of birth"
                        error={dateOfBirthError}
                    />
                </div>

                <PrimaryTextField 
                    type="text" 
                    label="Full Name" 
                    value={fullName} 
                    onChange={(value) => handleFieldChange('fullName', value)} 
                    placeholder="Enter your full name" 
                    error={fullNameError}
                />

                <div style={halfFormContainerStyle}>
                    <PrimaryTextField 
                        type="text" 
                        label="Country" 
                        value={country} 
                        onChange={(value) => handleFieldChange('country', value)} 
                        placeholder="Enter your country" 
                        error={countryError}
                    />
                </div>
            </div>

            <div style={buttonContainerStyle}>
                <PrimaryButton label="Sign Up Your Account" onClick={handleSignIn} />
            </div>

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