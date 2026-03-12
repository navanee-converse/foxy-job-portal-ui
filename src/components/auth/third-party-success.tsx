import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const SocialAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (accessToken) {
      Cookies.set("access_token", accessToken, { expires: 1 });
      if (refreshToken)
        Cookies.set("refresh_token", refreshToken, { expires: 7 });
      navigate("/users/profile");
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return <div>Loading your profile...</div>;
};