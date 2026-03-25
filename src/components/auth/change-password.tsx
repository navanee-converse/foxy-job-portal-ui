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

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])(?=.{8,})/;
    return regex.test(password);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!validatePassword(formData.newPassword)) {
      toast.error(
        "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.",
      );
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
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-sm font-medium text-content-heading label-required">
            Old Password
          </label>
          <div className="relative">
            <input
              id="oldPassword"
              type={showPasswords.old ? "text" : "password"}
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              required
              className="w-full rounded-lg cursor-pointer bg-header-bg px-5 py-4 text-sm outline-none transition-all focus:border-brand-primary focus:bg-white border border-transparent disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => toggleVisibility("old")}
              className="absolute right-4 cursor-pointer top-1/2 -translate-y-1/2 text-gray-400 text-xl"
            >
              {showPasswords.old ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
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
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              required
              className="w-full rounded-lg cursor-pointer bg-header-bg px-5 py-4 text-sm outline-none transition-all focus:border-brand-primary focus:bg-white border border-transparent"
            />
            <button
              type="button"
              onClick={() => toggleVisibility("new")}
              className="absolute curpointer right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
            >
              {showPasswords.new ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
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
              onChange={handleChange}
              placeholder="Re-enter new password"
              required
              className="w-full rounded-lg cursor-pointer bg-header-bg px-5 py-4 text-sm outline-none transition-all focus:border-brand-primary focus:bg-white border border-transparent"
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
