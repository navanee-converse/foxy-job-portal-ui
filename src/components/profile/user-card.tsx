import { useState, useEffect } from "react";
import {
  Loader2,
  Pencil,
  Check,
  X,
  ChevronDown,
  UserSquare2,
} from "lucide-react"; // Added icons
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { request } from "@/services/api";
import { getDecodedToken } from "@/utils/auth";
import type { ProfileFormValues, UserMeResponse } from "@/types/user-profile";
import type { ApiError } from "@/types/response";
import JobSeekerProfileCard from "./job-seeker-card";
import EmployerProfileCard from "./employer-card";

const UserProfileView = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false); // For API loading state
  const [isEditingRole, setIsEditingRole] = useState(false); // Toggle for dropdown
  const [role, setRole] = useState("");
  const [selectedRole, setSelectedRole] = useState(""); // Local dropdown state

  const [profileData, setProfileData] = useState<Partial<ProfileFormValues>>(
    {},
  );
  const [resumeUrl, setResumeUrl] = useState<string | undefined>();

  const fetchProfile = async () => {
    try {
      const token = getDecodedToken();
      if (!token) return;
      setRole(token.role);
      setSelectedRole(token.role);

      const res = await request<UserMeResponse>("/users/me", "GET");
      if (res) {
        setResumeUrl(res.jobSeekerProfileId?.primaryResumeUrl || undefined);
        setProfileData({
          name: res.name || "",
          phone: res.phone || "",
          email: res.email || "",
          education: res.jobSeekerProfileId?.education || [],
          experience: res.jobSeekerProfileId?.experience || [],
          tagIds: res.tagIds || [],
          jobtitle: res.employerProfileId?.jobTitle || "",
          department: res.employerProfileId?.department || "",
          company: res?.companyId?.name || "",
        });
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle Switch Role API Call
  const handleSwitchRole = async () => {
    if (selectedRole === role) {
      setIsEditingRole(false);
      return;
    }

    try {
      setIsSwitching(true);
      const res = await request<
        { access_token: string; refresh_token: string } | undefined
      >(`/auth/switch-role/${selectedRole}`, "PATCH");

      if (res && typeof res !== "string") {
        Cookies.set("access_token", res.access_token, {
          expires: 1,
          path: "/",
        });

        Cookies.set("refresh_token", res.refresh_token, {
          expires: 7,
          path: "/",
        });

        toast.success(`Switched to ${selectedRole.replace("_", " ")} mode`);
        setRole(selectedRole);
        setIsEditingRole(false);
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to switch role");
    } finally {
      setIsSwitching(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="bg-header-bg h-fit pb-20">
      <div className="max-w-3xl mx-auto pt-12 px-4">
        <div className="flex flex-wrap items-center justify-between mb-10 gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-medium text-slate-900">Profile</h1>

            <div className="flex items-center gap-2 mt-2">
              {!isEditingRole ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full">
                  <UserSquare2 className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    {role.replace("_", " ")}
                  </span>
                  <button
                    onClick={() => setIsEditingRole(true)}
                    className="p-1 hover:bg-blue-100 rounded-full transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3 h-3 text-blue-400" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="appearance-none pl-3 pr-8 py-1 text-xs font-bold uppercase tracking-wider bg-white border border-blue-300 text-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="job_seeker">Job Seeker</option>
                      <option value="employer">Employer</option>
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none" />
                  </div>

                  <button
                    onClick={handleSwitchRole}
                    disabled={isSwitching}
                    className="p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                  >
                    {isSwitching ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Check className="w-3 h-3" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingRole(false);
                      setSelectedRole(role);
                    }}
                    className="p-1.5 bg-slate-200 text-slate-600 rounded-md hover:bg-slate-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate("/users/profile")}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-btn-hover cursor-pointer rounded-lg border border-slate-200 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <Pencil className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        {role === "job_seeker" ? (
          <JobSeekerProfileCard profile={profileData} resumeUrl={resumeUrl} />
        ) : (
          <EmployerProfileCard profile={profileData} />
        )}
      </div>
    </div>
  );
};

export default UserProfileView;
