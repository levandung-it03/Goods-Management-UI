import { checkIsBlank } from './validators';

export function timeAsKey() {
    return new Date().getTime();
}

export function showToast(msg, type) {
    alert(type + ': ' + msg);
}

export function getTokenPayload(token) {
    if (!token) return {};
    return JSON.parse(atob(token.split('.')[1]));
}

export const cookieHelpers = {
    getCookies() {
        return document.cookie.split('; ').reduce((acc, pairs) => {
            const pair = pairs.split('=');
            return { ...acc, [pair[0].trim()]: pair[1] };
        }, {});
    },

    upsertCookie(name, value, path = '/') {
        if (checkIsBlank(name) || checkIsBlank(value)) {
            console.error('Error When Adding Cookies (undefined on params)');
            return;
        }
        document.cookie = `${name}=${value}; path=${path};`; // Add a cookie named 'testCookie'
    },

    removeCookie(name, path = '/', domain = '') {
        if (checkIsBlank(name)) {
            console.warn("Removed Cookie can't reach undefined Cookie name");
            return;
        }
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; ${domain ? `domain=${domain};` : ''}`;
    },

    clear() {
        const cookies = this.getCookies();
        Object.keys(cookies).forEach((key) => this.removeCookie(key));
    },
};
