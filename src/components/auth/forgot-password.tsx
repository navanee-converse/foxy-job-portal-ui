import React, { useState } from "react";
import { request } from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { ApiError } from "@/types/response";
import AuthLayout from "@/layouts/auth";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError("Email address is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    setError("");
    return true;
  };
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    try {
      await request("/auth/resend-otp", "POST", { email });
      localStorage.setItem("email", email);
      toast.success("OTP sent successfully to your email!");

      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        const apiError = error as ApiError;
        console.error(apiError.message);
      } else toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot Password?">
      <div className="flex flex-col justify-evenly">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder="Enter your registered email"
              required
              disabled={isLoading}
              className={`w-full rounded-xl bg-header-bg px-5 py-4 text-sm outline-none transition-all focus:border-brand-primary focus:ring-1 focus:bg-white border border-transparent 
                ${error ? "border-red-500 focus:border-red-500" : "border-transparent focus:border-brand-primary"} disabled:opacity-50`}
            />
            {error && (
              <p className="mt-1 text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full cursor-pointer rounded-xl bg-brand-primary py-4 text-sm font-medium text-white shadow-xl shadow-brand-primary/20 transition-all hover:bg-brand-btn-hover active:scale-[0.98] disabled:bg-gray-400"
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-content-body">
          Remember your password?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-bold text-brand-primary hover:underline"
          >
            Back to Login
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
