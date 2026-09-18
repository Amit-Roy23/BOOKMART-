import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { getApiUrl } from "@/utils/env";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || getApiUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Attach JWT access token and normalize path prefixes
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error fetching token from SecureStore:", error);
    }

    // Normalize URL to avoid double /api/v1 prefix if callers supply full relative paths
    if (config.url) {
      if (config.url.startsWith("/api/v1/")) {
        config.url = config.url.replace(/^\/api\/v1/, "");
      } else if (config.url.startsWith("api/v1/")) {
        config.url = config.url.replace(/^api\/v1/, "");
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle 401s by refreshing token via SimpleJWT endpoint
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 Unauthorized and we haven't retried yet
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Avoid infinite loops if the refresh call itself fails with 401
      if (originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");

        if (refreshToken) {
          const refreshUrl = `${API_BASE_URL.replace(/\/+$/, "")}/auth/refresh/`;

          // Call refresh endpoint directly with vanilla axios to avoid interceptor loops
          const refreshResponse = await axios.post(refreshUrl, {
            refresh: refreshToken,
          });

          const newAccessToken = refreshResponse.data?.access;

          if (newAccessToken) {
            // Save the new tokens
            await SecureStore.setItemAsync("accessToken", newAccessToken);
            if (refreshResponse.data?.refresh) {
              await SecureStore.setItemAsync("refreshToken", refreshResponse.data.refresh);
            }

            // Update Authorization header for the original request and retry
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Clear invalid tokens on refresh failure
        await SecureStore.deleteItemAsync("accessToken").catch(() => {});
        await SecureStore.deleteItemAsync("refreshToken").catch(() => {});
      }
    }

    return Promise.reject(error);
  }
);
