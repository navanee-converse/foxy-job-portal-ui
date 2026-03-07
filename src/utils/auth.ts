import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  _id: string;
  email: string;
  exp: number;
  role: "employer" | "job_seeker";
}

export const getDecodedToken = (): DecodedToken | null => {
  try {
    const token = Cookies.get("access_token");
    if (!token) return null;

    const decoded = jwtDecode<DecodedToken>(token);

    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn("Token has expired");
    }

    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export const refreshAccessToken = async () => {
  const refresh_token = Cookies.get("refresh_token");
  if (!refresh_token) throw new Error("No refresh token available");

  const baseUrl = import.meta.env.VITE_API_URL;

  const response = await axios.post(`${baseUrl}/auth/refresh-token`, {
    refresh_token: refresh_token,
  });

  const { accessToken, refreshToken } = response.data.data;

  Cookies.set("access_token", accessToken, { expires: 1 });

  if (refreshToken) {
    Cookies.set("refresh_token", refreshToken, { expires: 7 });
  }

  return accessToken;
};
