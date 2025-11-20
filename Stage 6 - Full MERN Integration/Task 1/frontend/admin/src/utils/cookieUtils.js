import Cookies from 'js-cookie';

/**
 * Set a cookie with secure attributes.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {number} [expires=7] - Expiration time in days (default: 7 days).
 */
export const setCookie = (name, value, expires = 7) => {
  Cookies.set(name, value, {
    expires,
    secure: true,
    sameSite: 'Strict',
  });
};

/**
 * Get a cookie by name.
 * @param {string} name - The name of the cookie.
 * @returns {string | undefined} - The value of the cookie or undefined if not found.
 */
export const getCookie = (name) => {
  return Cookies.get(name);
};

/**
 * Remove a cookie by name.
 * @param {string} name - The name of the cookie.
 */
export const removeCookie = (name) => {
  Cookies.remove(name, { secure: true, sameSite: 'Strict' });
};