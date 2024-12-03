import FormRHF from '@reusable/FormRHF/FormRHF';
import InputField from '@reusable/FormRHF/InputField/InputField';
import SelectField from '@reusable/FormRHF/SelectField/SelectField';
import { ProfileService } from '@services/ProfileService';
import { trimWords } from '@src/utils/formatters';
import { checkIsBlank, checkIsPhoneNumber, checkMinLength } from '@src/utils/validators';
import Button from '@ui/Button/Button';
import './UserProfileDialog.scss';
import Tabs from '@reusable/Tabs/Tabs';
import { useMultistepForm } from '@src/hooks/useMultiStepForm';
import OtpForm from '@ui/OtpForm/OtpForm';
import { cloneElement, useCallback, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function UserProfileDialog({ userProfile, onClose }) {
    const tabs = [
        { label: 'Profile', content: <ProfileTab userProfile={userProfile} /> },
        { label: 'Password', content: <PasswordTab userProfile={userProfile} onClose={onClose} /> },
    ];

    return (
        <div className="profile-dialog">
            <div className="title">Edit Profile</div>
            <Tabs tabs={tabs} />
        </div>
    );
}

function ProfileTab({ userProfile }) {
    // Gọi API cập nhật thông tin người dùng
    const handleSubmit = async (formData) => {
        try {
            formData.dob = formData.dob.split('-').map((value) => parseInt(value));
            console.log(formData);
            await ProfileService.updateUserProfile(formData);
            console.log('Profile updated successfully:', formData);
            // Đóng modal hoặc thực hiện các thao tác sau khi cập nhật thành công
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    return (
        <FormRHF className="profile-tab flex-col" onSubmit={handleSubmit} defaultValues={userProfile}>
            <div className="name-wrapper">
                <InputField
                    name="lastName"
                    label="LastName"
                    validators={{
                        required: (v) => (checkIsBlank(v) ? 'First name is required' : null),
                    }}
                    formatters={{
                        onChange: [trimWords],
                    }}
                />
                <InputField
                    name="firstName"
                    label="FirstName"
                    validators={{
                        required: (v) => (checkIsBlank(v) ? 'First name is required' : null),
                    }}
                    formatters={{
                        onChange: [trimWords],
                    }}
                />
            </div>
            <InputField
                name="phone"
                label="Phone"
                validators={{
                    phoneNumber: (v) => (!checkIsPhoneNumber(v) ? 'Phone number is not valid' : null),
                }}
            />
            <InputField name="dob" type="date" label="Date of Birth" />
            <SelectField
                name="gender"
                label="Gender"
                options={[
                    { value: 'MALE', text: 'Male' },
                    { value: 'FEMALE', text: 'Female' },
                ]}
            />
            <Button text="Save Changes" />
        </FormRHF>
    );
}

function PasswordTab({ userProfile, onClose }) {
    const { currentStepIndex, currentStep, isLastStep, next } = useMultistepForm([
        <ChangePasswordForm />,
        <OtpForm action={ProfileService.verifyChangePasswordOtp} />,
    ]);
    const [formData, setFormData] = useState();
    const [otpExpiredTime, setOtpExpiredTime] = useState();

    const handleSubmit = useCallback(
        async (data) => {
            try {
                setFormData(data);
                // Before going to the otp form, send the api to get the otp code
                if (currentStepIndex === 0) {
                    const response = await ProfileService.getOtpToChangePassword({
                        email: userProfile.email,
                        password: data.currentPassword,
                    });
                    setOtpExpiredTime(response.data.ageInSeconds);
                    return next();
                }
                if (!isLastStep) return next();
                else {
                    console.log('call api change pass');
                    onClose();
                }
            } catch (error) {
                alert(error.message);
            }
        },
        [currentStepIndex, isLastStep, next, userProfile.email],
    );

    return (
        <FormRHF className="change-password-tab flex-col" onSubmit={handleSubmit}>
            {currentStepIndex === 1 ? cloneElement(currentStep, { formData, otpExpiredTime }) : currentStep}
        </FormRHF>
    );
}

function ChangePasswordForm() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    return (
        <>
            <InputField
                name="currentPassword"
                label="Current Password"
                type={showCurrentPassword ? 'text' : 'password'}
                icon={
                    showCurrentPassword ? (
                        <EyeOff onClick={() => setShowCurrentPassword(!showCurrentPassword)} />
                    ) : (
                        <Eye onClick={() => setShowCurrentPassword(!showCurrentPassword)} />
                    )
                }
                validators={{
                    required: (v) => (checkIsBlank(v) ? 'Password is required' : null),
                    minLen: (v) => (checkMinLength(v, 6) ? 'At least 6 characters' : null),
                }}
                formatters={{
                    onChange: [trimWords],
                }}
            />
            <InputField
                name="newPassword"
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                icon={
                    showNewPassword ? (
                        <EyeOff onClick={() => setShowNewPassword(!showNewPassword)} />
                    ) : (
                        <Eye onClick={() => setShowNewPassword(!showNewPassword)} />
                    )
                }
                validators={{
                    required: (v) => (checkIsBlank(v) ? 'Password is required' : null),
                    minLen: (v) => (checkMinLength(v, 6) ? 'At least 6 characters' : null),
                }}
                formatters={{
                    onChange: [trimWords],
                }}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <InputField
                name="confirmPassword"
                label="Confirm New Password"
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
                    validatePassword: (v) => (newPassword !== v ? 'Password does not match' : null),
                }}
                formatters={{
                    onChange: [trimWords],
                }}
            />
            <Button text="Continue" />
        </>
    );
}

export default UserProfileDialog;
