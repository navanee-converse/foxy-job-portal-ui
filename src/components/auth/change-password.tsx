import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { request } from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/auth";
import type { ApiError } from "@/types/response";

const ChangePasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { oldPassword: "", newPassword: "", confirmPassword: "" };
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!formData.oldPassword) {
      newErrors.oldPassword = "Current password is required";
      isValid = false;
    } else if (!passwordRegex.test(formData.newPassword)) {
      newErrors.oldPassword =
        "Must be 8 chars with uppercase, lowercase, number, and symbol";
      isValid = false;
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (!passwordRegex.test(formData.newPassword)) {
      newErrors.newPassword =
        "Must be 8 chars with uppercase, lowercase, number, and symbol";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await request("/auth/change-password", "POST", {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmPassword,
      });

      toast.success("Password updated successfully!");
      navigate("/jobs");
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        const apiError = error as ApiError;
        console.error(apiError.message);
      } else toast.error("Failed to change password.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <AuthLayout title="Change Password">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="space-y-1">
          <label className="text-sm font-medium text-content-heading label-required">
            Old Password
          </label>
          <div className="relative">
            <input
              id="oldPassword"
              type={showPasswords.old ? "text" : "password"}
              value={formData.oldPassword}
              onChange={(e) => {
                handleChange(e);
                if (errors.oldPassword)
                  setErrors({ ...errors, oldPassword: "" });
              }}
              placeholder="Enter current password"
              required
              className={`w-full rounded-lg cursor-pointer bg-header-bg px-5 py-4 text-sm outline-none transition-all focus:border-brand-primary focus:bg-white border border-transparent disabled:opacity-50 
                ${errors.oldPassword ? "border-red-500" : "border-transparent focus:border-brand-primary"}`}
            />
            <button
              type="button"
              onClick={() => toggleVisibility("old")}
              className="absolute right-4 cursor-pointer top-1/2 -translate-y-1/2 text-gray-400 text-xl"
            >
              {showPasswords.old ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {errors.oldPassword}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-content-heading label-required">
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showPasswords.new ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) => {
                handleChange(e);
                if (errors.newPassword)
                  setErrors({ ...errors, newPassword: "" });
              }}
              placeholder="Minimum 8 characters"
              required
              className={`w-full rounded-lg cursor-pointer bg-header-bg px-5 py-4 text-sm outline-none transition-all focus:border-brand-primary focus:bg-white border border-transparent
                ${errors.newPassword ? "border-red-500" : "border-transparent focus:border-brand-primary"}`}
            />
            <button
              type="button"
              onClick={() => toggleVisibility("new")}
              className="absolute curpointer right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
            >
              {showPasswords.new ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {errors.newPassword}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-content-heading label-required">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showPasswords.confirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => {
                handleChange(e);
                if (errors.confirmPassword)
                  setErrors({ ...errors, confirmPassword: "" });
              }}
              placeholder="Re-enter new password"
              required
              className={`w-full rounded-lg cursor-pointer bg-header-bg px-5 py-4 text-sm outline-none transition-all focus:border-brand-primary focus:bg-white border border-transparent
                ${errors.confirmPassword ? "border-red-500" : "border-transparent focus:border-brand-primary"}`}
            />
            <button
              type="button"
              onClick={() => toggleVisibility("confirm")}
              className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
            >
              {showPasswords.confirm ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full cursor-pointer rounded-lg bg-brand-primary py-4 text-sm font-medium text-white shadow-md shadow-brand-primary/20 transition-all hover:bg-brand-btn-hover active:scale-[0.98] disabled:bg-gray-400"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full text-center cursor-pointer text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
        >
          Cancel
        </button>
      </form>
    </AuthLayout>
  );
};

export default ChangePasswordPage;
