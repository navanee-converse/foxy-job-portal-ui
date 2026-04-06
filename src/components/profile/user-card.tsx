import { useState, useEffect } from "react";
import {
  Loader2,
  Pencil,
  Check,
  X,
  UserSquare2,
} from "lucide-react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { request } from "@/services/api";
import { getDecodedToken } from "@/utils/auth";
import type { ProfileFormValues, UserMeResponse } from "@/types/user-profile";
import JobSeekerProfileCard from "./job-seeker-card";
import EmployerProfileCard from "./employer-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const UserProfileView = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [role, setRole] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

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
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-lg">
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
                      <Select
                        value={selectedRole}
                        onValueChange={(val) => setSelectedRole(val)}
                      >
                        <SelectTrigger className="w-40 h-8 bg-white rounded-lg border-blue-200 font-bold text-[10px] uppercase tracking-wider text-blue-700 focus:ring-blue-500/20">
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent className="font-bold text-xs">
                          <SelectItem value="job_seeker">Job Seeker</SelectItem>
                          <SelectItem value="employer">Employer</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex items-center gap-1.5 ml-1">
                        <button
                          onClick={handleSwitchRole}
                          disabled={isSwitching}
                          className="p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all active:scale-90 disabled:opacity-50 cursor-pointer"
                        >
                          {isSwitching ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingRole(false);
                            setSelectedRole(role);
                          }}
                          className="p-1.5 bg-slate-200 text-slate-600 rounded-md hover:bg-slate-300 transition-all active:scale-90 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
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
