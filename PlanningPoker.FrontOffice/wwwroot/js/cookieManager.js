/*jshint esversion: 6 */

class CookieManager {
    setCookie(name, value, days) {
        let expires = "";

        const date = new Date();

        if (days) {
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        } else {
            date.setFullYear(9999);
        }

        expires = "; expires=" + date.toUTCString();

        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
    getCookie(name) {
        const nameEQ = name + "=";

        const ca = document.cookie.split(';');

        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];

            while (c.charAt(0) == ' ') {
                c = c.substring(1, c.length);
            }

            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }

        return null;
    }
    eraseCookie(name) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
}