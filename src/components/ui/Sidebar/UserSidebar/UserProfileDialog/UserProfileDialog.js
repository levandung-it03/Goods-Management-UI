import FormRHF from '@reusable/FormRHF/FormRHF';
import InputField from '@reusable/FormRHF/InputField/InputField';
import SelectField from '@reusable/FormRHF/SelectField/SelectField';
import { ProfileService } from '@services/ProfileService';
import { trimWords } from '@src/utils/formatters';
import { checkIsBlank } from '@src/utils/validators';
import Button from '@ui/Button/Button';
import './UserProfileDialog.scss';

function UserProfileDialog({ userProfile, onClose }) {
    console.log(userProfile);

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
        <FormRHF className="profile-form flex-col" onSubmit={handleSubmit} defaultValues={userProfile}>
            <div className="title">Edit Profile</div>
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
            <InputField name="phone" label="Phone" />
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

export default UserProfileDialog;
