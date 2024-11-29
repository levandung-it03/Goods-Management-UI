import { authPublicService } from '@services/authService';
import { cookieHelpers } from '@src/utils/helpers';
import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const cookies = cookieHelpers.getCookies();
    const [auth, setAuth] = useState({
        accessToken: cookies['accessToken'] || null,
        refreshToken: cookies['refreshToken'] || null,
    });

    const navigate = useNavigate();

    // Hàm đăng nhập
    const login = async (formData) => {
        try {
            console.log(formData)
            const { data } = await authPublicService.login({ email: formData.email, password: formData.password });
            const { accessToken, refreshToken } = data;
            setAuth({ accessToken, refreshToken });
            navigate('/'); // Chuyển đến trang chính sau khi đăng nhập
        } catch (error) {
            console.log(error);
        }
    };

    // Hàm đăng xuất
    const logout = () => {
        cookieHelpers.clear();
        setAuth({ accessToken: null, refreshToken: null });
        navigate('/login'); // Chuyển về trang login sau khi đăng xuất
    };

    return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>;
};
