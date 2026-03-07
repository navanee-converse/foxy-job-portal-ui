import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import { request } from "../services/api";
import toast from "react-hot-toast";

interface LogoutButtonProps {
  variant?: "button" | "menuItem";
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = "button",
  className = "",
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    const loadingToast = toast.loading("Logging out...");

    try {
      await request("/auth/logout", "POST");
    } catch (error) {
      console.error(
        "Backend logout failed, proceeding with local cleanup",
        error,
      );
    } finally {
      Cookies.remove("access_token", { path: "/" });
      Cookies.remove("refresh_token", { path: "/" });

      localStorage.clear();

      toast.dismiss(loadingToast);
      toast.success("Successfully logged out");

      navigate("/login");
    }
  };

  if (variant === "menuItem") {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={`flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer ${className}`}
      >
        {isLoggingOut ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut size={16} />
        )}
        <span>{isLoggingOut ? "Processing..." : "Logout"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-red-600 active:scale-95 transition-all disabled:opacity-50 cursor-pointer ${className}`}
    >
      {isLoggingOut ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut size={18} />
      )}
      {isLoggingOut ? "Logging out..." : "Logout"}
    </button>
  );
};

export default LogoutButton;
