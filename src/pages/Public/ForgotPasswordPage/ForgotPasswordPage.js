import './ForgotPasswordPage.scss';
import OtpForm from '@ui/OtpForm/OtpForm';
import { cloneElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMultistepForm } from '@src/hooks/useMultiStepForm';
import { authPublicService } from '@services/authService';
import FormRHF from '@reusable/FormRHF/FormRHF';
import bgrImage from '@assets/form_background.jpeg';
import InputField from '@reusable/FormRHF/InputField/InputField';
import { trimWords } from '@src/utils/formatters';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { checkIsBlank, checkIsEmail } from '@src/utils/validators';

function ForgotPasswordPage() {
    const { currentStepIndex, currentStep, isLastStep, next } = useMultistepForm([
        <ForgotPasswordForm />,
        <OtpForm action={authPublicService.generateRandomPassword} />,
    ]);
    const [formData, setFormData] = useState();
    const [otpExpiredTime, setOtpExpiredTime] = useState();
    const navigate = useNavigate();

    // Handle logic
    const handleForgotPassword = async (data) => {
        setFormData(data);
        try {
            // Before going to the otp form, send the api to get the otp code
            if (currentStepIndex === 0) {
                const response = await authPublicService.getForgotPasswordOtp(data.email);
                setOtpExpiredTime(response.data.ageInSeconds);
                return next();
            }
            if (!isLastStep) return next();
            else {
                console.log(data);
                // call api forgot generateRandomPassword
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="forgot-password-page center">
            <div className="background center">
                <img src={bgrImage} alt="" />
            </div>
            <div className="container">
                <FormRHF onSubmit={handleForgotPassword}>
                    {currentStepIndex === 1 ? cloneElement(currentStep, { email: formData.email, otpExpiredTime }) : currentStep}
                </FormRHF>
            </div>
        </div>
    );
}

function ForgotPasswordForm() {
    const navigate = useNavigate();
    return (
        <div className="forgot-password-form flex-col">
            <div className={'title'}>Forgot Password</div>
            <span>*Enter your email to receive an OTP for password reset</span>
            <InputField
                name="email"
                label="Email"
                validators={{
                    required: (v) => (checkIsBlank(v) ? 'Email is required' : null),
                    email: (v) => (!checkIsEmail(v) ? 'Invalid email' : null),
                }}
                formatters={{
                    onChange: [trimWords],
                }}
            />
            <div className="step-button">
                <button className="center" type="button" onClick={() => navigate('/login')}>
                    <ArrowLeft />
                    <span>Back</span>
                </button>
                <button className="center" type="submit">
                    <span>Next</span>
                    <ArrowRight />
                </button>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
