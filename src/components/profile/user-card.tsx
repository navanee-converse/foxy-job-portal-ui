import { useState, useEffect } from "react";
import { Loader2, Pencil } from "lucide-react";
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
  const [role, setRole] = useState("");
  const [profileData, setProfileData] = useState<Partial<ProfileFormValues>>(
    {},
  );
  const [resumeUrl, setResumeUrl] = useState<string | undefined>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getDecodedToken();
        if (!token) return;
        setRole(token.role);

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
        if (error && typeof error === "object" && "message" in error) {
          console.error((error as ApiError).message);
        } else {
          toast.error("Failed to load profile");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-medium text-slate-900">Profile</h1>
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
          <EmployerProfileCard profile={profileData}/>
        )}
      </div>
    </div>
  );
};

export default UserProfileView;
