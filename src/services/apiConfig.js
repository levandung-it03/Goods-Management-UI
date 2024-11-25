import { cookieHelpers } from '@src/utils/helpers';
import axios from 'axios';

const API_PRIVATE_AUTH_PREFIX = process.env.REACT_APP_API_PRIVATE_AUTH_PREFIX;
const cookies = cookieHelpers.getCookies();

const springService = axios.create({ baseURL: process.env.REACT_APP_SPRING_PREFIX_URL });
const fastApiService = axios.create({ baseURL: process.env.REACT_APP_FAST_API_PREFIX_URL });

const reqInterceptor = (request) => {
    request.headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': true,
        ...request.headers,
    };
    const accessToken = cookies['accessToken'];
    const refreshToken = cookies['refreshToken'];

    if (request.url.toUpperCase().includes('AUTH')) request.headers['Authorization'] = refreshToken ? `Bearer ${refreshToken}` : 'none';
    else if (request.url.toUpperCase().includes('PRIVATE'))
        request.headers['Authorization'] = accessToken ? `Bearer ${accessToken}` : 'none';

    return request;
};

const resInterceptor = async (error) => {
    const { response } = error;
    const originalRequest = error.config;
    const appCode = Object.keys(response.data).includes('body')
        ? response.data.body.applicationCode // Srping service
        : response.data.applicationCode; // FastApi service

    if (response && response.status === 403 && appCode === 11003) {
        if (!originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Call API refresh token to get new access token
                const res = await springService.post(
                    `${API_PRIVATE_AUTH_PREFIX}/v1/refresh-token`,
                    // Automatically set-up headers by interceptor
                    { token: cookies['accessToken'] },
                );

                const newAccessToken = res.data.data.token;

                // Update access token in cookie and orignal request
                cookieHelpers.upsertCookie('accessToken', newAccessToken);

                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                // Resend the original request with a new access token
                return springService(response.config);
            } catch (e) {
                cookieHelpers.clear();
            }
        } else {
            cookieHelpers.clear();
        }
    }
    return Promise.reject(error);
};

springService.interceptors.request.use(reqInterceptor, (error) => Promise.reject(error));
fastApiService.interceptors.request.use(reqInterceptor, (error) => Promise.reject(error));
springService.interceptors.response.use((response) => response, resInterceptor);
fastApiService.interceptors.response.use((response) => response, resInterceptor);

export { springService, fastApiService };
