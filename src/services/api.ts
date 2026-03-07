import { refreshAccessToken } from "@/utils/auth";
import axios, {
  type AxiosRequestConfig,
  type Method,
  type AxiosResponse,
} from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const request = async <T = any>(
  endpoint: string,
  method: Method = "GET",
  body: any = {},
  customHeaders: any = {},
): Promise<T> => {
  const token = Cookies.get("access_token");
  const headers = {
    ...customHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config: AxiosRequestConfig = {
    url: endpoint,
    method,
    data: body,
    headers,
  };

  try {
    const response: AxiosResponse<T> = await apiClient(config);

    if (method !== "GET") {
      const successMsg = (response.data as any).message || "Action successful!";
      toast.success(successMsg);
    }

    return (response.data as any).data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as {
        isAccessTokenExpired: boolean;
        message?: string;
      };
      const status = error.response?.status;

      if (status === 429) {
        window.location.href = "/error/429";
        throw { status: 429, message: "Rate limit exceeded" };
      }
      if (status === 403) {
        window.location.href = "/error/403";
        throw { status: 403, message: "Forbidden access" };
      }
      if (status === 404) {
        window.location.href = "/error/404";
        throw { status: 404, message: "Not found" };
      }
      if (status && status >= 500) {
        window.location.href = "/error/500";
        throw { status, message: "Internal server error" };
      }

      if (status === 401) {
        if (data.isAccessTokenExpired) {
          {
            try {
              console.warn(
                "Access token expired. Attempting silent refresh...",
              );
              const newAccessToken = await refreshAccessToken();

              return await request<T>(endpoint, method, body, {
                ...customHeaders,
                Authorization: `Bearer ${newAccessToken}`,
              });
            } catch (refreshError) {
              console.error("Refresh token expired or invalid.");

              throw refreshError;
            }
          }
        } else {
          window.location.href = "/error/401";
          throw { status: 401, message: "Unauthorized access" };
        }
      }

      const message = data?.message || "An unexpected error occurred";
      toast.error(message);
      throw { status, message };
    }

    const genericMessage =
      error instanceof Error ? error.message : "A client-side error occurred";
    toast.error(genericMessage);
    throw { status: 500, message: genericMessage };
  }
};
