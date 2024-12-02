
export class UtilMethods {
    static timeAsKey() {
        return new Date().getTime();
    }
    
    static checkIsBlank(val) {
        return val === null
        || val === undefined
        || (val instanceof String && val.length === 0)
        || (val instanceof Array && val.length === 0)
        || (val instanceof Object && Object.keys(val).length === 0)
        || (val instanceof Number && isNaN(val))
        || val === "";
    }
    
    static showToast(msg, type) {
        alert(type + ": " + msg);
    }
}

export class UtilCookie {
    static getCookies() {
        return document.cookie.split("; ").reduce((acc, pairs) => {
            const pair = pairs.split("=");
            return { ...acc, [pair[0].trim()]: pair[1] };
        }, {});
    }

    static upsertCookie(name, value, path="/") {
        if (UtilMethods.checkIsBlank(name) || UtilMethods.checkIsBlank(value)) {
            console.error("Error When Adding Cookies (undefined on params)");
            return;
        }
        document.cookie = `${name}=${value}; path=${path};`; // Add a cookie named 'testCookie'
    }

    static removeCookie(name, path = '/', domain = '') {
        if (UtilMethods.checkIsBlank(name)) {
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

export class UtilAxios {
    static paramsSerializerToGetWithSortAndFilter(params) {
        let filterFields = {};

        if ("filterFields" in params && params.filterFields !== null & params.filterFields !== undefined) {
            filterFields = params["filterFields"];
            delete params["filterFields"];
        }
        //--Parsing Regular Params
        const result = Object.entries(params).reduce((acc, [key, value]) =>
            (value !== null && value !== undefined) ? [...acc, `${encodeURIComponent(key)}=${encodeURIComponent(value)}`] : acc
            , []);

        //--Parsing Nested Object Params
        if (Object.keys(filterFields).length !== 0) {
            result.push(Object.entries(filterFields).reduce((acc, [key, value]) =>
                (value !== null && value !== undefined)
                    ? [...acc, Array.isArray(value)
                        ? `filterFields[${encodeURIComponent(key)}]=[${value.join(',')}]`
                        : `filterFields[${encodeURIComponent(key)}]=${encodeURIComponent(value)}`]
                    : acc
                , []).join("&"));
        }
        return result.join('&');
    }

    static checkAndReadBase64Token(token) {
        if (!token)
            return {};
        return JSON.parse(atob(token.split(".")[1]));
    }
}