import axios from "axios";
import { UtilMethods, UtilCookie } from "../components/reusable/Utils";

const expiredTokenCode = Number.parseInt(process.env.REACT_APP_EXPIRED_TOKEN_CODE);
const springService = axios.create({ baseURL: process.env.REACT_APP_SPRING_PREFIX_URL });
const PRI_AUTH_PREFIX_PART = process.env.REACT_APP_SPRING_PRI_AUTH_PREFIX_PART;

export class AxiosActions {
    static defaultHeaders = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': true,
    }

    static getStoredAuthToken(tokenName) {
        const cookies = UtilCookie.getCookies();
        let token = cookies[tokenName];
        if (UtilMethods.checkIsBlank(cookies) || UtilMethods.checkIsBlank(token)) {
            console.error(`Cookies is empty or '${tokenName}' not found`);
            return "";
        }
        if (!token.includes("Bearer "))
            return "Bearer " + token;
        else return token;
    }

    static getSpringResponseBodyData(axiosResponse) {
        return axiosResponse.data.body;
    }
}

export class AxiosInterceptors {
    static authorizedRequest = {
        request: (config) => {
            if (UtilMethods.checkIsBlank(config.headers["Authorization"]))
                config.headers["Authorization"] = AxiosActions.getStoredAuthToken("accessToken");
            return config;
        },
        catching: (error) => Promise.reject(error)
    }

    static authorizedResponse = {
        response: (res) => res,
        catching: async (error) => {
            if (!error.config._retry) {
                try {
                    if (!UtilMethods.checkIsBlank(error.response)
                        && !UtilMethods.checkIsBlank(error.config)
                        && error.response.status === 403
                        && AxiosActions.getSpringResponseBodyData(error.response).applicationCode === expiredTokenCode
                    ) {
                        const refreshTokenResponse = await springService.post(
                            `${PRI_AUTH_PREFIX_PART}/v1/refresh-token`,
                            { token: AxiosActions.getStoredAuthToken("accessToken") },
                            { headers: {
                                ...AxiosActions.defaultHeaders,
                                'Authorization': AxiosActions.getStoredAuthToken("refreshToken")
                            }}
                        );
                        let newAccessToken = refreshTokenResponse.data.data.token;
                        if (!newAccessToken.includes("Bearer "))
                            newAccessToken = "Bearer " + newAccessToken;

                        UtilCookie.upsertCookie("accessToken", newAccessToken);
                        error.config.headers["Authorization"] = newAccessToken;
                        error.config._retry = true;
                        return springService(error.config);
                    }
                    else UtilCookie.clear();
                } catch (e) {
                    UtilCookie.clear();
                }
            }
            error.config._retry = true;
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