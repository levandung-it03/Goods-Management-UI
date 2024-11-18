
export function timeAsKey() {
    return new Date().getTime();
}

export function checkIsBlank(val) {
    return val === null
    || val === undefined
    || (val instanceof Array && val.length === 0)
    || (val instanceof Object && Object.keys(val).length === 0)
    || (val instanceof Number && isNaN(val))
    || val === "";
}

export function showToast(msg, type) {
    alert(type + ": " + msg);
}

export class Cookie {
    static getCookies() {
        return document.cookie.split("; ").reduce((acc, pairs) => {
            const pair = pairs.split("=");
            return { ...acc, [pair[0].trim()]: pair[1] };
        }, {});
    }

    static upsertCookie(name, value, path="/") {
        if (checkIsBlank(name) || checkIsBlank(value)) {
            console.error("Error When Adding Cookies (undefined on params)");
            return;
        }
        document.cookie = `${name}=${value}; path=${path};`; // Add a cookie named 'testCookie'
    }

    static removeCookie(name, path = '/', domain = '') {
        if (checkIsBlank(name)) {
            console.warn("Removed Cookie can't reach undefined Cookie name");
            return;
        }
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; ${domain ? `domain=${domain};` : ''}`;
    }

    static clear() {
        const cookies = this.getCookies();
        Object.keys(cookies).forEach(key => this.removeCookie(key));
    }
}