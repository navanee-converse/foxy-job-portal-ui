import React, { useState, useEffect } from "react";
import AuthLayout from "../layouts/Auth";
import { request } from "../services/api";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { passwordSchema } from "@/validations/password";
import { getDecodedToken } from "@/utils/auth";
import { useNavigate } from "react-router-dom";

type FieldErrors = {
  password?: string[];
  confirmPassword?: string[];
};

const PasswordPage: React.FC = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    console.log(storedEmail);

    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      toast.error("Session expired. Please start again.");
      window.location.href = "/register";
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });

    if (errors[e.target.id as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [e.target.id]: undefined }));
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = passwordSchema.safeParse(formData);

    if (!validation.success) {
      const flattenedErrors = validation.error.flatten().fieldErrors;
      setErrors(flattenedErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = (await request("/auth/update-password", "POST", {
        email: email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })) as { access_token: string; refresh_token: string };
      if (response.access_token) {
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
      }
      navigate("/users/profile");

      toast.success("Password updated successfully!");
      localStorage.removeItem("email");
    } catch (error: any) {
      console.error("Update failed", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Set New Password"
      description="Create a strong password to secure your account."
    >
      <div className="flex flex-col justify-evenly">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-content-heading"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full rounded-xl bg-header-bg px-5 py-4 text-sm outline-none transition-all focus:ring-1 border ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-transparent focus:border-brand-primary focus:ring-brand-primary"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs font-medium text-red-500">
                {errors.password[0]}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-content-heading"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className={`w-full rounded-xl bg-header-bg px-5 py-4 text-sm outline-none transition-all focus:ring-1 border ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-transparent focus:border-brand-primary focus:ring-brand-primary"
              }`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs font-medium text-red-500">
                {errors.confirmPassword[0]}
              </p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer rounded-xl bg-brand-primary py-4 text-sm font-medium text-white shadow-xl shadow-brand-primary/20 transition-all hover:bg-brand-btn-hover active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default PasswordPage;
