// src/utils/cookies.js
import Cookies from 'js-cookie';

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const ROLE_KEY = 'role';
const USER_KEY="user"

export const setAuthCookies = ({ accessToken, refreshToken, role, user }) => {
  Cookies.set(TOKEN_KEY, accessToken);
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken);
  Cookies.set(ROLE_KEY, role);
  Cookies.set(USER_KEY, JSON.stringify(user));
};

export const clearAuthCookies = () => {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  Cookies.remove(ROLE_KEY);
  Cookies.remove(USER_KEY)
};

export const getAccessToken = () => Cookies.get(TOKEN_KEY);
export const getRefreshToken = () => Cookies.get(REFRESH_TOKEN_KEY);
export const getUserRole = () => Cookies.get(ROLE_KEY);
export const getUserDetail = () => {
  const userStr = Cookies.get(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};
