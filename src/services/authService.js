import { cookieHelpers } from "@src/utils/helpers";
import { springService } from "./apiConfig";

// authService.js
const cookies = cookieHelpers.getCookies();
const PRI_AUTH_PREFIX_PART = process.env.REACT_APP_SPRING_PRI_AUTH_PREFIX_PART;
const PUB_AUTH_PREFIX_PART = process.env.REACT_APP_SPRING_PUB_AUTH_PREFIX_PART;

// AuthPrivateService
export const authPrivateService = {
    async logout() {
        try {
            const accessToken = cookies["accessToken"];
            const refreshToken = cookies["refreshToken"];
            const response = await springService.post(
                `${PRI_AUTH_PREFIX_PART}/v1/logout`,
                { token: accessToken },
                {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        } finally {
            // Luôn xóa token trong mọi trường hợp (thành công hoặc lỗi)
            cookieHelpers.removeCookie("accessToken");
            cookieHelpers.removeCookie("refreshToken");
        }
    },
};

// AuthPublicService
export const authPublicService = {
    async login(data) {
        try {
            // const response = {
            //     data: {
            //         data: {
            //             accessToken: 'accessToken',
            //             refreshToken: 'refreshToken',
            //         },
            //         httpStatusCode: 200,
            //     },
            // };
            const response = await springService.post(
                `${PUB_AUTH_PREFIX_PART}/v1/authenticate`,
                {
                    email: data.email,
                    password: data.password,
                }
            );
            const { accessToken, refreshToken } = response.data.data;
            cookieHelpers.upsertCookie("accessToken", accessToken);
            cookieHelpers.upsertCookie("refreshToken", refreshToken);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    },

    async getRegisterOtp(email) {
        try {
            const response = await springService.post(
                `${PUB_AUTH_PREFIX_PART}/auth/v1/get-register-otp`,
                { email }
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    },

    async getForgotPasswordOtp(email) {
        try {
            const response = await springService.post(
                `${PUB_AUTH_PREFIX_PART}/v1/get-forgot-password-otp`,
                { email }
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    },

    async verifyOtp(formData) {
        try {
            const response = await springService.post(
                `${PUB_AUTH_PREFIX_PART}/v1/verify-register-otp`,
                formData
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    },

    async generateRandomPassword(formData) {
        try {
            const response = await springService.post(
                `${PUB_AUTH_PREFIX_PART}/v1/generate-random-password`,
                formData
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    },

    async register(formData) {
        try {
            const response = await springService.post(
                `${PUB_AUTH_PREFIX_PART}/v1/register-user`,
                formData
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    },
};
