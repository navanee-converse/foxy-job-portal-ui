import React, { useState } from "react";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import AuthLayout from "../layouts/Auth";
import { request } from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSocialLogin = (provider: "google" | "linkedin" | "github") => {
    const baseUrl = import.meta.env.VITE_API_URL;
    window.location.href = `${baseUrl}/auth/${provider}`;
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await request("/auth/login", "POST", {
        email: formData.email,
        password: formData.password,
      });

      toast.success("Welcome back!");

      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      navigate("/jobs");
    } catch (error: any) {
      console.log(error);

      const errorMsg =
        error?.response?.data?.message || "Invalid email or password.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Login to Hirely"
      description="Welcome back! Please enter your credentials to access your account."
    >
      <div className="flex flex-col justify-evenly">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-content-heading"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              disabled={isLoading}
              className="w-full rounded-xl bg-header-bg px-5 py-4 text-sm outline-none transition-all focus:border-brand-primary focus:ring-1 focus:bg-white border border-transparent disabled:opacity-50"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="text-sm font-medium text-content-heading"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-xs font-bold text-brand-primary hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                disabled={isLoading}
                className="w-full rounded-xl bg-header-bg px-5 py-4 text-sm outline-none transition-all focus:border-brand-primary focus:ring-1 focus:bg-white border border-transparent disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer rounded-xl bg-brand-primary py-4 text-sm font-medium text-white shadow-xl shadow-brand-primary/20 transition-all hover:bg-brand-btn-hover active:scale-[0.98] disabled:bg-gray-400"
          >
            {isLoading ? "Signing in..." : "Log In"}
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">
              or continue with
            </span>
          </div>
        </div>

        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            className="flex flex-1 items-center justify-center gap-3 rounded-xl border border-gray-100 py-3 text-sm font-bold text-content-heading hover:bg-gray-50 transition-colors"
          >
            <FcGoogle className="text-lg" /> Google
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin("linkedin")}
            className="flex flex-1 items-center justify-center gap-3 rounded-xl border border-gray-100 py-3 text-sm font-bold text-content-heading hover:bg-gray-50 transition-colors"
          >
            <FaLinkedinIn className="text-[#0077b5] text-lg" /> LinkedIn
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin("github")}
            className="flex flex-1 items-center justify-center gap-3 rounded-xl border border-gray-100 py-3 text-sm font-bold text-content-heading hover:bg-gray-50 transition-colors"
          >
            <FaGithub className="text-black text-lg" /> GitHub
          </button>
        </div>

        <p className="mt-10 text-center text-sm text-content-body">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="font-bold text-brand-primary hover:underline"
          >
            Create an account
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
