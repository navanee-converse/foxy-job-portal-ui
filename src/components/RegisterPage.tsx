import React, { useEffect, useState } from "react";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import AuthLayout from "../layouts/Auth";
import { FcGoogle } from "react-icons/fc";
import { IoBriefcaseSharp } from "react-icons/io5";
import { GoPerson } from "react-icons/go";
import { request } from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Role {
  _id: string;
  name: string;
}

const RegisterPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await request("/roles", "GET");
        const transformedRoles = response.map((role: Role) => {
          if (role.name === "job_seeker") return { ...role, name: "Candidate" };
          if (role.name === "employer") return { ...role, name: "Employer" };
          return role;
        });

        setRoles(transformedRoles);

        const defaultRole = transformedRoles.find(
          (r: Role) => r.name === "Candidate",
        );
        if (defaultRole) {
          setSelectedRoleId(defaultRole._id);
        } else if (transformedRoles.length > 0) {
          setSelectedRoleId(transformedRoles[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch roles:", err);
      }
    };
    fetchRoles();
  }, []);

  const handleSocialLogin = (provider: "google" | "linkedin" | "github") => {
    if (!selectedRoleId) {
      alert("Please select a role first!");
      return;
    }

    const baseUrl = import.meta.env.VITE_API_URL;
    window.location.href = `${baseUrl}/auth/${provider}?roleId=${selectedRoleId}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!selectedRoleId) {
      alert("Please select a role first.");
      return;
    }

    setIsLoading(true);

    const payload = {
      email: formData.email,
      role: selectedRoleId,
    };
    localStorage.setItem("email", formData.email);

    try {
      await request("/auth/register", "POST", payload);
      toast.success("Registration successful!");
      navigate("/verify-otp");
    } catch (error: any) {
      toast.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create a Free Hirely Account"
      description="Join Hirely today and start managing your talent."
    >
      <div className="flex flex-col justify-evenly">
        <div className="flex flex-1 w-full gap-4 mb-10">
          {roles.map((role) => {
            const isSelected = selectedRoleId === role._id;
            return (
              <div
                key={role._id}
                onClick={() => !isLoading && setSelectedRoleId(role._id)}
                className={`p-3 flex-1 cursor-pointer text-center rounded-lg transition-all duration-400 border border-transparent 
                ${
                  isSelected
                    ? "bg-button-active text-white shadow-lg"
                    : "bg-button-primary text-brand-primary hover:bg-brand-primary hover:text-white"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center justify-center gap-2">
                  {role.name === "Employer" ? (
                    <IoBriefcaseSharp className="text-lg" />
                  ) : (
                    <GoPerson className="text-lg" />
                  )}
                  <span className="font-bold">{role.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-sm font-medium text-content-heading label-required"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={isLoading}
                className="w-full rounded-lg cursor-pointer bg-header-bg px-5 py-4 text-sm outline-none transition-all focus:border-brand-primary focus:ring-blue-600 focus:bg-white border border-transparent disabled:opacity-50"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer rounded-xl bg-brand-primary py-4 text-sm font-medium text-white shadow-xl shadow-brand-primary/20 transition-all hover:bg-brand-btn-hover active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Processing..."
                  : `Register as ${roles.find((r) => r._id === selectedRoleId)?.name || "User"}`}
              </button>
            </div>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">
                or
              </span>
            </div>
          </div>

          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              className="flex flex-1 cursor-pointer items-center justify-center gap-3 rounded-xl border border-gray-100 py-3 text-sm font-bold text-content-heading hover:bg-gray-50"
            >
              <FcGoogle className="text-lg" /> Google
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("linkedin")}
              className="flex flex-1 cursor-pointer items-center justify-center gap-3 rounded-xl border border-gray-100 py-3 text-sm font-bold text-content-heading hover:bg-gray-50"
            >
              <FaLinkedinIn className="text-[#0077b5] text-lg" /> LinkedIn
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("github")}
              className="flex flex-1 cursor-pointer items-center justify-center gap-3 rounded-xl border border-gray-100 py-3 text-sm font-bold text-content-heading hover:bg-gray-50"
            >
              <FaGithub className="text-black text-lg" /> GitHub
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-content-body lg:text-left">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-bold text-brand-primary hover:underline"
            >
              Log In
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
