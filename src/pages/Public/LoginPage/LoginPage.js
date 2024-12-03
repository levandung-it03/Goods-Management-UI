import FormRHF from '@reusable/FormRHF/FormRHF';
import InputField from '@reusable/FormRHF/InputField/InputField';
import { trimWords } from '@src/utils/formatters';
import { checkIsBlank, checkIsEmail, checkMinLength } from '@src/utils/validators';
import { Eye, EyeOff } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@ui/Button/Button';
import './LoginPage.scss';
import { useAuth } from '@src/hooks/useAuth';
import bgrImage from '@assets/form_background.jpeg';

function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    const handleSubmit = useCallback(
        async (formData) => {
            try {
                await login(formData);
            } catch (error) {
                console.log(error);
            }
        },
        [login],
    );

    return (
        <div className="login-page center">
            <div className="background center">
                <img src={bgrImage} alt="" />
            </div>
            <div className="container">
                <div className="title">Login</div>
                <FormRHF className="login-form flex-col" onSubmit={handleSubmit}>
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
                    />
                    <div className="forgot-password">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>
                    <Button type="submit" text="Login" />
                </FormRHF>
            </div>
        </div>
    );
}

export default LoginPage;
