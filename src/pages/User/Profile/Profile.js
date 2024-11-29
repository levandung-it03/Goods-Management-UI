import { useState, useEffect } from "react";
import axios from "axios"; // Import axios để gọi API
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
            // const response = await axios.get(
            //     "http://localhost:9999/api/private/user/v1/info"
            // ); // Gọi API trực tiếp
            setDefaultValues({}); // Lưu dữ liệu lấy được
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
        }
    };

    // Gọi API cập nhật thông tin người dùng
    const handleSubmit = async (formData) => {
        try {
            await axios.put("/api/user/profile", formData); // Gửi API cập nhật
            console.log("Profile updated successfully:", formData);
            // Đóng modal sau khi cập nhật thành công
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    // Khi modal mở, gọi API lấy dữ liệu
    useEffect(() => {
        fetchUserProfile();
    }, []);

    return (
        <div className="profile-dialog">
            <div className="dialog">
                <div className="dialog-content">
                    <div className="dialog-header">Edit Profile</div>

                    {defaultValues ? (
                        <FormRHF
                            className="profile-form"
                            onSubmit={handleSubmit}
                            defaultValues={defaultValues}
                        >
                            <div className="input-wrapper">
                                <InputField
                                    name="firstname"
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
                                    name="lastname"
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
                                        { value: "male", text: "Male" },
                                        { value: "female", text: "Female" },
                                        { value: "other", text: "Other" },
                                    ]}
                                    placeholder="Select your gender"
                                />
                            </div>
                            <div className="dialog-actions">
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
