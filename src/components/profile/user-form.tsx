import { useState, useEffect } from "react";
import { request } from "@/services/api";
import toast from "react-hot-toast";
import { User, Loader2, Pencil, X, UserSquare2, Check } from "lucide-react";
import { getDecodedToken } from "@/utils/auth";
import { EmployerProfileForm } from "@/components/profile/employer-form";
import { JobSeekerProfileForm } from "@/components/profile/job-seeker-form";
import type { ProfileFormValues, UserMeResponse } from "@/types/user-profile";
import type { Tag } from "@/types/tag";
import Cookies from "js-cookie";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserProfileForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [role, setRole] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const [profileData, setProfileData] = useState<ProfileFormValues>();
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = getDecodedToken();
      if (!token) return;
      setRole(token.role);
      setSelectedRole(token.role);

      const res = await request<UserMeResponse>("/users/me", "GET");
      if (res) {
        setResumeUrl(res.jobSeekerProfileId?.primaryResumeUrl || null);
        setProfileData({
          name: res.name || "",
          phone: res.phone || "",
          education: res.jobSeekerProfileId?.education || [],
          experience: res.jobSeekerProfileId?.experience || [],
          tagIds: res.tagIds || [],
          jobtitle: res.employerProfileId?.jobTitle || "",
          department: res.employerProfileId?.department || "",
          email: res.email,
          company: res?.companyId?.name,
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
      const res = await request<{
        access_token: string;
        refresh_token: string;
      }>(`/auth/switch-role/${selectedRole}`, "PATCH");

      if (res && res.access_token) {
        Cookies.set("access_token", res.access_token, {
          expires: 1,
          path: "/",
        });
        Cookies.set("refresh_token", res.refresh_token, {
          expires: 7,
          path: "/",
        });

        toast.success(`Switched to ${selectedRole.replace("_", " ")} mode`);
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to switch role");
    } finally {
      setIsSwitching(false);
    }
  };

  const handleRemoveResume = async () => {
    try {
      setResumeUrl(null);
      toast.success("Resume removed");
    } catch (error) {
      toast.error("Failed to remove resume");
    }
  };

  useEffect(() => {
    if (role !== "job_seeker") return;
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_URL}/users/me/resumes/events`,
      { withCredentials: true },
    );
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status === "completed" && data.url) {
        setResumeUrl(data.url);
        setIsSyncing(false);
        toast.success("Resume processed!");
      }
    };
    eventSource.onerror = () => {
      setIsSyncing(false);
      eventSource.close();
    };
    return () => eventSource.close();
  }, [role]);

  const handleUpdate = async (values: Partial<ProfileFormValues>) => {
    setIsSubmitting(true);
    try {
      await request("/users/me", "PATCH", {
        name: values.name,
        phone: values.phone,
      });
      if (role === "job_seeker") {
        const tagIds = values.tagIds?.map((tag: Tag) => tag._id);
        await request("/users/me/job-seeker-profile", "PUT", {
          education: values.education,
          experience: values.experience,
          tagIds,
        });
        if (values.resume instanceof File) {
          const formData = new FormData();
          formData.append("resume", values.resume);
          setIsSyncing(true);
          await request("/users/me/resumes", "POST", formData, {
            "Content-Type": "multipart/form-data",
          });
        }
      } else {
        await request("/users/me/employer-profile", "PUT", {
          jobTitle: values.jobtitle,
          department: values.department,
        });
      }
      toast.success("Profile saved successfully");
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-header-bg min-h-screen pb-20">
      <div className="max-w-5xl mx-auto pt-12 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="font-semibold text-3xl text-slate-900">
                My Profile
              </h1>

              <div className="flex items-center gap-2 mt-2">
                {!isEditingRole ? (
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-lg">
                    <UserSquare2 className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
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
                      onValueChange={setSelectedRole}
                    >
                      <SelectTrigger className="w-36 h-7 bg-white rounded-md border-blue-200 font-bold text-[10px] uppercase tracking-wider text-blue-700 focus:ring-blue-500/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="job_seeker"
                          className="text-xs font-bold uppercase"
                        >
                          Job Seeker
                        </SelectItem>
                        <SelectItem
                          value="employer"
                          className="text-xs font-bold uppercase"
                        >
                          Employer
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <button
                      onClick={handleSwitchRole}
                      disabled={isSwitching}
                      className="p-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                    >
                      {isSwitching ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingRole(false);
                        setSelectedRole(role);
                      }}
                      className="p-1 bg-slate-200 text-slate-600 rounded hover:bg-slate-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-2.5 text-white border border-slate-200 rounded-lg transition-colors shadow-sm font-semibold cursor-pointer bg-brand-primary hover:bg-brand-btn-hover"
            >
              <Pencil className="w-4 h-4 text-white" /> Edit
            </button>
          ) : (
            <button
              onClick={() => {
                setIsEditing(false);
                fetchProfile();
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors font-semibold cursor-pointer"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
          )}
        </div>

        <div
          className={`bg-white p-8 rounded-xl shadow-sm border border-slate-200 transition-all ${!isEditing ? "opacity-95 bg-slate-50/30" : "opacity-100"}`}
        >
          {role === "job_seeker" ? (
            <JobSeekerProfileForm
              initialData={profileData ?? {}}
              onSave={handleUpdate}
              isSubmitting={isSubmitting}
              resumeUrl={resumeUrl ?? undefined}
              onRemoveResume={handleRemoveResume}
              isSyncing={isSyncing}
              isDisabled={!isEditing}
            />
          ) : (
            <EmployerProfileForm
              initialData={profileData}
              onSave={handleUpdate}
              isSubmitting={isSubmitting}
              isDisabled={!isEditing}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;
