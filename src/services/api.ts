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
  body: any = null,
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

      if (status === 401 && data?.isAccessTokenExpired) {
        try {
          console.warn("Access token expired. Attempting silent refresh...");
          const newAccessToken = await refreshAccessToken();
          console.log("access_token", newAccessToken);

          return await request<T>(endpoint, method, body, {
            ...customHeaders,
            Authorization: `Bearer ${newAccessToken}`,
          });
        } catch (refreshError) {
          console.log(refreshError);

          console.error("Refresh token expired or invalid.");

          throw refreshError;
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
