import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  _id: string;
  email: string;
  exp: number;
  role: "employer" | "job_seeker";
}

export const getDecodedToken = (): DecodedToken | null => {
  try {
    const token = localStorage.getItem("access_token");
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
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) throw new Error("No refresh token available");

  const baseUrl = import.meta.env.VITE_API_URL;
  console.log(baseUrl);

  const response = await axios.post(`${baseUrl}/auth/refresh-token`, {
    refresh_token: refresh_token,
  });

  const { accessToken, refreshToken } = response.data.data;
  console.log(accessToken, refreshToken);

  localStorage.setItem("access_token", accessToken);
  if (refreshToken) {
    localStorage.setItem("refresh_token", refreshToken);
  }

  return accessToken;
};
