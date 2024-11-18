import { checkIsBlank, Cookie } from "../handmade_compos/Utils";

const expiredTokenCode = process.env.REACT_APP_EXPIRED_TOKEN_CODE;
const springService = axios.create({ baseURL: process.env.REACT_APP_SPRING_PREFIX_URL });

export class AxiosActions {
    static defaultHeaders = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': true,
    }

    static getStoredAuthToken(tokenName) {
        const cookies = Cookie.getCookies();
        let token = cookies[tokenName];
        if (checkIsBlank(cookies) || checkIsBlank(token)) {
            console.error(`Cookies is empty or '${tokenName}' not found`);
            return "";
        }
        if (!token.includes("Bearer "))
            return "Bearer " + token;
        else
            return token; 
    }

    static getSpringResponseBodyData(axiosResponse) {
        return axiosResponse.data.body;
    }
}

export class AxiosInterceptors {
    static authorizedRequest = {
        request: (config) => {
            config.headers.Authorization = AxiosActions.getStoredAuthToken("accessToken");
            return config;
        },
        catching: (error) => Promise.reject(error)
    }

    static authorizedResponse = {   
        response: (res) => res,
        catching: async (error) => {
            const { response } = error;
            const data = AxiosActions.getSpringResponseBodyData(response);
            if (!checkIsBlank(response) && !checkIsBlank(config) && response.status === 403 && data.applicationCode === expiredTokenCode) {
                if (!error.config._retry) {
                    error.config._retry = true; //--Mark that this failed-request had been retried once.
                    try {
                        const refreshTokenResponse = await springService.post(
                            `${REACT_APP_SPRING_PREFIX_URL}/api/private/auth/v1/refresh-token`,
                            { token: AxiosActions.getStoredAuthToken("accessToken") }
                        );
                        let newAccessToken = refreshTokenResponse.data.data.token;
                        if (!newAccessToken.includes("Bearer "))
                            newAccessToken = "Bearer " + newAccessToken;

                        Cookie.upsertCookie("accessToken", newAccessToken);
                        error.config.headers.Authorization = newAccessToken;

                        return springService()
                    } catch (e) {
                        Cookie.clear();
                    }
                } else {
                    Cookie.clear();
                }
            }

            return Promise.reject(error);   //--Pay "config" back to Axios.
        }
    }
}

springService.interceptors.request.use(
    AxiosInterceptors.authorizedRequest.request,
    AxiosInterceptors.authorizedRequest.catching
);
springService.interceptors.response.use(
    AxiosInterceptors.authorizedResponse.response,
    AxiosInterceptors.authorizedResponse.catching
);

export { springService };