import { useState, useEffect } from "react";
import { ProfileService } from "@services/ProfileService"; // Import từ profileService
import FormRHF from "@reusable/FormRHF/FormRHF";
import InputField from "@reusable/FormRHF/InputField/InputField";
import Button from "@ui/Button/Button";
import { checkIsBlank } from "@src/utils/validators";
import "./Profile.scss";
import SelectField from "@reusable/FormRHF/SelectField/SelectField";

export default function ProfileDialog() {
    const [defaultValues, setDefaultValues] = useState(null);

    // Gọi API lấy thông tin người dùng
    const fetchUserProfile = async () => {
        try {
            let data = await ProfileService.getUserProfile();
            data = data.data;
            const year = data.dob[0];
            const month = String(data.dob[1]).padStart(2, "0"); // Đảm bảo tháng có 2 chữ số
            const day = String(data.dob[2]).padStart(2, "0"); // Đảm bảo ngày có 2 chữ số
            data.dob = `${year}-${month}-${day}`;
            console.log(data);
            setDefaultValues(data); // Lưu dữ liệu vào state
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
        }
    };

    // Gọi API cập nhật thông tin người dùng
    const handleSubmit = async (formData) => {
        try {
            formData.dob = formData.dob
                .split("-")
                .map((value) => parseInt(value));
            console.log(formData);
            await ProfileService.updateUserProfile(formData);
            console.log("Profile updated successfully:", formData);
            // Đóng modal hoặc thực hiện các thao tác sau khi cập nhật thành công
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    // Khi modal mở, gọi API lấy dữ liệu
    useEffect(() => {
        fetchUserProfile();
    }, []);

    return (
        <div className="profile-container">
            <div className="profile">
                <div className="content">
                    <div className="header">Edit Profile</div>

                    {defaultValues ? (
                        <FormRHF
                            className="profile-form"
                            onSubmit={handleSubmit}
                            defaultValues={defaultValues}
                        >
                            <div className="input-wrapper">
                                <InputField
                                    name="firstName"
                                    label="First Name"
                                    validators={{
                                        required: (v) =>
                                            checkIsBlank(v)
                                                ? "First name is required"
                                                : null,
                                    }}
                                />
                            </div>
                            <div className="input-wrapper">
                                <InputField
                                    name="lastName"
                                    label="Last Name"
                                    validators={{
                                        required: (v) =>
                                            checkIsBlank(v)
                                                ? "Last name is required"
                                                : null,
                                    }}
                                />
                            </div>
                            <div className="input-wrapper">
                                <InputField
                                    name="phone"
                                    label="Phone"
                                    type="tel"
                                    validators={{
                                        required: (v) =>
                                            checkIsBlank(v)
                                                ? "Phone number is required"
                                                : null,
                                    }}
                                />
                            </div>
                            <div className="input-wrapper mw400">
                                <InputField
                                    name="dob"
                                    label="Date of Birth"
                                    type="date"
                                    validators={{
                                        required: (v) =>
                                            checkIsBlank(v)
                                                ? "Date of birth is required"
                                                : null,
                                    }}
                                />
                            </div>

                            <div className="input-wrapper mw400">
                                <SelectField
                                    name="gender"
                                    label="Gender"
                                    validators={{
                                        required: (v) =>
                                            v
                                                ? undefined
                                                : "Gender is required",
                                    }}
                                    options={[
                                        { value: "MALE", text: "Male" },
                                        { value: "FEMALE", text: "Female" },
                                    ]}
                                    placeholder="Select your gender"
                                />
                            </div>
                            <div className="actions">
                                <Button
                                    type="submit"
                                    text="Save Changes"
                                    className="btn-save"
                                />
                            </div>
                        </FormRHF>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
        </div>
    );
}
