import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import AuthPageLayout from "../components/layout/AuthPageLayout";
import { PrimaryTextField } from "../components/common/PrimaryTextField";
import { PrimaryButton } from "../components/common/PrimaryButton";
import Size from "../assets/styles/Size";
import { resetPassword } from "../actions/userAction";
import { useDispatch } from "react-redux";

interface ResetPasswordProps {
    title: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ title }) => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const validateForm = () => {
        const newErrors: { newPassword?: string; confirmPassword?: string } = {};

        if (!newPassword) {
            newErrors.newPassword = "New password is required";
        } else if (newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        dispatch(resetPassword(token!, newPassword));
        setIsLoading(true);
        
        try {
            console.log("Resetting password with:", { newPassword });
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log("Password reset successful");
            
        } catch (error) {
            console.error("Password reset failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: Size.Large,
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
    };

    const formStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: Size.Large,
        width: '100%',
    };

    const buttonContainerStyle: React.CSSProperties = {
        marginTop: Size.Large,
    };

    return (
        <AuthPageLayout title={title || "Reset Password"} description="Enter your new password below.">
            <div style={containerStyle}>
                <form style={formStyle} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <PrimaryTextField
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={setNewPassword}
                        placeholder="Enter your new password"
                        error={errors.newPassword}
                    />
                    
                    <PrimaryTextField
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        placeholder="Confirm your new password"
                        error={errors.confirmPassword}
                    />
                    
                    <div style={buttonContainerStyle}>
                        <PrimaryButton
                            label={isLoading ? "Resetting..." : "Reset Password"}
                            onClick={handleSubmit}
                            isDisabled={isLoading}
                        />
                    </div>
                </form>
            </div>
        </AuthPageLayout>
    );
};

export default ResetPassword;