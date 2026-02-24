import type { Response } from "@/types/response";
import axios, {
  type AxiosRequestConfig,
  type Method,
  type AxiosResponse,
} from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "x-requested-with": "XMLHttpRequest",
  },
});

export const request = async <T = any>(
  endpoint: string,
  method: Method = "GET",
  body: any = null,
  customHeaders: any = {},
): Promise<T> => {
  try {
    const config: AxiosRequestConfig = {
      url: endpoint,
      method,
      data: body,
      headers: { ...customHeaders },
    };

    const response: AxiosResponse<T> = await apiClient(config);

    if (method !== "GET") {
      const successMsg = (response.data as any).message || "Action successful!";
      toast.success(successMsg);
    }

    console.log(response.data);

    return (response.data as Response<T>).data;
  } catch (error: any) {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || "An unexpected error occurred";

    toast.error(message);

    if (status === 401) {
      console.warn("Unauthorized! Redirecting to login...");
    }

    throw { status, message };
  }
};
