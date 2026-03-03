import { getDecodedToken } from "@/utils/auth";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const SocialAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
      if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
      const payload = getDecodedToken();
      if (payload?.role === "job_seeker") navigate("/jobs");
      else navigate("/users/profile");
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return <div>Loading your profile...</div>;
};
