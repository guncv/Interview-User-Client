import AuthPageLayout from "../components/layout/AuthPageLayout";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import successAnimation from "../assets/animations/correct.lottie";


const ResetPasswordSuccess = () => {
    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '40px',
    };

    const animationStyle: React.CSSProperties = {
        width: '400px',
        height: 'auto',
    };

    return (
        <AuthPageLayout title="Password Changed"
        description="Your password has been changed successfully">
            <div style={containerStyle}>
                <DotLottieReact
                    src={successAnimation}
                    loop={true}
                    autoplay={true}
                    style={animationStyle}
                />
            </div>
        </AuthPageLayout>
    );
};

export default ResetPasswordSuccess;