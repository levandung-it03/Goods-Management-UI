import { useMultistepForm } from '@src/hooks/useMultiStepForm';
import { cloneElement, useState } from 'react';
import bgrImage from '@assets/form_background.jpeg';
import FormRHF from '@reusable/FormRHF/FormRHF';
import InputField from '@reusable/FormRHF/InputField/InputField';
import SelectField from '@reusable/FormRHF/SelectField/SelectField';
import { checkIsBlank, checkIsEmail, checkMinLength } from '@src/utils/validators';
import { trimWords } from '@src/utils/formatters';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import './RegisterPage.scss';
import Button from '@ui/Button/Button';
import OtpForm from '@ui/OtpForm/OtpForm';

function RegisterPage() {
    const { currentStepIndex, currentStep, isLastStep, next } = useMultistepForm([<RegisterForm />, <InfoForm />, <OtpForm />]);
    const [otpExpiredTime, setOtpExpiredTime] = useState();

    // Handle logic
    const handleSubmit = async (data) => {
        // Before going to the otp form, send the api to get the otp code
        if (currentStepIndex === 1) {
            setOtpExpiredTime(60);
            return next();
        }
        if (!isLastStep) return next();
        else {
            console.log('call api with form data: ', data);
        }
    };

    return (
        <div className="register-page center">
            <div className="background center">
                <img src={bgrImage} alt="" />
            </div>
            <div className="container">
                <FormRHF onSubmit={handleSubmit}>
                    {currentStepIndex === 2 ? cloneElement(currentStep, { otpExpiredTime }) : currentStep}
                </FormRHF>
            </div>
        </div>
    );
}

function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');

    return (
        <div className="register-form">
            <div className={'title'}>Register</div>
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
            <InputField
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                icon={
                    showPassword ? (
                        <EyeOff onClick={() => setShowPassword(!showPassword)} />
                    ) : (
                        <Eye onClick={() => setShowPassword(!showPassword)} />
                    )
                }
                validators={{
                    required: (v) => (checkIsBlank(v) ? 'Password is required' : null),
                    minLen: (v) => (checkMinLength(v, 6) ? 'At least 6 characters' : null),
                }}
                formatters={{
                    onChange: [trimWords],
                }}
                onChange={(e) => setPassword(e.target.value)}
            />
            {password && (
                <InputField
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    icon={
                        showConfirmPassword ? (
                            <EyeOff onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                        ) : (
                            <Eye onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                        )
                    }
                    validators={{
                        required: (v) => (checkIsBlank(v) ? 'Password is required' : null),
                        matchPassword: (v) => (password === v ? undefined : 'Password does not match'),
                    }}
                    formatters={{
                        onChange: [trimWords],
                    }}
                />
            )}
            <Button type="submit" text="Continue" />
            <div className="divider-container center">
                <div className="divider-line"></div>
                <span className="divider-text"> or register with </span>
                <div className="divider-line"></div>
            </div>
            <div className="register-social">
                <button className="google-btn center" onClick={() => {}}>
                    <img src="https://img.icons8.com/color/40/google-logo.png" alt="google-logo" />
                    <span>Register with google</span>
                </button>
                <button className="facebook-btn center" onClick={() => {}}>
                    <img src="https://img.icons8.com/fluency/48/facebook-new.png" alt="facebook-new" />
                    <span>Register with facebook</span>
                </button>
            </div>
            <div className="register center">
                Already have an account?
                <Link to="/login">Log in</Link>
            </div>
        </div>
    );
}

function InfoForm({ back }) {
    // Test
    const gender = [
        { value: '1', text: 'Male' },
        { value: '0', text: 'Female' },
    ];

    return (
        <div className="info-form flex-col">
            <div className={'title'}>Information</div>
            <InputField
                name="lastName"
                label="Last Name"
                validators={{
                    required: (v) => (checkIsBlank(v) ? 'Last Name is required' : null),
                }}
                formatters={{
                    onChange: [trimWords],
                }}
            />
            <InputField
                name="firstName"
                label="First Name"
                validators={{
                    required: (v) => (checkIsBlank(v) ? 'First Name is required' : null),
                }}
                formatters={{
                    onChange: [trimWords],
                }}
            />
            <SelectField name="genderId" label="Gender" options={gender} defaultValue="1" />
            <InputField name="dob" type="date" label="Date of Birth" />
            <div className="step-button">
                <button className="center" type="button" onClick={back}>
                    <ArrowLeft />
                    <span>Back</span>
                </button>
                <button className="center" type="submit">
                    Next
                    <ArrowRight />
                </button>
            </div>
        </div>
    );
}

export default RegisterPage;
