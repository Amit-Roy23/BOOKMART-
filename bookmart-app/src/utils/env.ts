/**
 * Retrieves the API URL from the environment variables.
 * Fallback to the default production API URL if not defined.
 */
export const getApiUrl = (): string => {
  return process.env.EXPO_PUBLIC_API_URL || "https://bookmart-ej4t.onrender.com/api/v1";
};

