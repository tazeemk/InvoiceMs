"use client";
import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} from "./cookies";

// Base URL for API - dynamically detect backend server
let SM_BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL;

// If not set in environment, dynamically detect from current host
if (!SM_BASE_URL && typeof window !== "undefined") {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  SM_BASE_URL = `${protocol}//${hostname}:8060/`;
}

// Fallback for server-side rendering
if (!SM_BASE_URL) {
  SM_BASE_URL = "http://192.168.1.63:8060/";
}

// Create axios instance
const smInstance = axios.create({
  baseURL: SM_BASE_URL,
});

// Request interceptor - add auth token to requests
smInstance.interceptors.request.use(
  (config) => {
    // Get token from cookies if available
    if (typeof window !== "undefined") {
      const token = getAccessToken();

      // If token exists, add it to the headers
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
       console.log("🔥 Sending Token:", token || "NO TOKEN FOUND");
    }

    console.log("📤 Request:", config.method?.toUpperCase(), config.baseURL + config.url);
    console.log("📦 Request Data:", config.data);
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh
smInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Response status:", response.status);
    console.log("📥 Response data:", response.data);
    return response;
  },
  async (error) => {
    console.error("❌ Response error details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });
    
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();

        // Create a new axios instance without interceptors for refresh token request
        const refreshAxios = axios.create({
          baseURL: SM_BASE_URL,
        });

        // Call refresh token endpoint without any Authorization headers
        const response = await refreshAxios.post("/api/v1/auth/refresh", {
          token: refreshToken,
        });

        // Update tokens in cookies
        setAuthCookies({
          accessToken: response.data.token,
          refreshToken: response.data.refreshToken,
        });

        // Retry the original request with the new token
        originalRequest.headers.set("Authorization", `Bearer ${response.data.token}`);
        return smInstance(originalRequest);
      } catch (refreshError) {
        console.log(refreshError);
        if (typeof window !== "undefined") {
          clearAuthCookies();
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    console.error("Response error:", error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export const smClient = smInstance;
