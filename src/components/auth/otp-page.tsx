import React, { useState, useEffect } from "react";
import { request } from "../../services/api";
import toast from "react-hot-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { useNavigate } from "react-router-dom";
import type { ApiError } from "@/types/response";
import AuthLayout from "@/layouts/auth";

const OtpPage: React.FC = () => {
  const [otpValue, setOtpValue] = useState("");
  const [email, setEmail] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setEmail(storedEmail);

    const calculateTimeLeft = () => {
      const expiryTime = localStorage.getItem("otp_expiry");
      if (!expiryTime) {
        const newExpiry = Date.now() + 120 * 1000;
        localStorage.setItem("otp_expiry", newExpiry.toString());
        return 120;
      }
      const remaining = Math.round((Number(expiryTime) - Date.now()) / 1000);
      return remaining > 0 ? remaining : 0;
    };
    setTimeLeft(calculateTimeLeft());
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    setCanResend(false);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOtpSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (otpValue.length < 6)
      return toast.error("Please enter the 6-digit code.");

    try {
      await request("/auth/verify-otp", "POST", { email, otp: otpValue });
      toast.success("Email verified successfully!");
      localStorage.removeItem("otp_expiry");
      navigate("/update-password");
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        const apiError = error as ApiError;
        console.error(apiError.message);
      } else toast.error("Verification failed");
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    try {
      await request("/auth/resend-otp", "POST", { email });

      const newExpiry = Date.now() + 120 * 1000;
      localStorage.setItem("otp_expiry", newExpiry.toString());
      setTimeLeft(120);
      setOtpValue("");
      toast.success("New code sent to your email!");
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        const apiError = error as ApiError;
        toast.error(apiError.message);
      } else toast.error("Otp resend failed");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout title="Verify your Email">
      <div className="flex flex-col justify-evenly">
        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={(value) => setOtpValue(value)}
            >
              <InputOTPGroup className="gap-2">
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="rounded-lg text-lg font-bold h-14 w-12 data-[focused=true]:ring-2 data-[focused=true]:ring-brand-primary transition-all"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="text-center text-sm">
            {timeLeft > 0 ? (
              <p className="text-content-body">
                Resend code in{" "}
                <span className="font-bold text-brand-primary">
                  {Math.floor(timeLeft / 60)}:
                  {String(timeLeft % 60).padStart(2, "0")}
                </span>
              </p>
            ) : (
              <p className="text-red-500 font-medium">Code has expired.</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer rounded-xl bg-brand-primary py-4 text-sm font-medium text-white shadow-xl transition-all hover:bg-brand-btn-hover active:scale-[0.98] disabled:opacity-50"
          >
            Verify OTP
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-content-body">
          <p>
            Didn't receive a code?{" "}
            <button
              onClick={handleResendOtp}
              disabled={!canResend || isResending}
              className={`font-bold transition-all ${
                canResend && !isResending
                  ? "text-brand-primary hover:underline cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              {isResending ? "Sending..." : "Resend Code"}
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default OtpPage;
