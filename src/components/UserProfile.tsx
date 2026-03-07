import { useState, useEffect } from "react";
import { request } from "@/services/api";
import toast from "react-hot-toast";
import { User, Loader2 } from "lucide-react";
import { getDecodedToken } from "@/utils/auth";
import { EmployerProfileForm } from "@/components/profile/EmployerForm";
import { JobSeekerProfileForm } from "@/components/profile/JobSeekerForm";
import type { ProfileFormValues, UserMeResponse } from "@/types/user-profile";
import type { Tag } from "@/types/tag";

const UserProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState("");
  const [profileData, setProfileData] = useState<ProfileFormValues>();
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getDecodedToken();
        if (!token) return;
        setRole(token.role);

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
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleRemoveResume = async () => {
    try {
      setResumeUrl(null);
      toast.success("Resume removed from view");
    } catch (err) {
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
        setProfileData((prev) =>
          prev ? { ...prev, resume: undefined } : prev,
        );
        toast.success("Resume processed!");
      }
    };
    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      setIsSyncing(false);
      eventSource.close();
    };
    return () => eventSource.close();
  }, [role]);
  const handleUpdate = async (values: any) => {
    setIsSubmitting(true);
    try {
      await request("/users/me", "PATCH", {
        name: values.name,
        phone: values.phone,
      });

      if (role === "job_seeker") {
        const tagIds = values.tagIds?.map((t: Tag) => t._id);
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
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="bg-header-bg min-h-screen pb-20">
      <div className="max-w-6xl mx-auto pt-12 px-4">
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="font-semibold text-3xl text-slate-900">
            Update Profile
          </h1>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
          {role === "job_seeker" ? (
            <JobSeekerProfileForm
              initialData={profileData}
              onSave={handleUpdate}
              isSubmitting={isSubmitting}
              resumeUrl={resumeUrl}
              onRemoveResume={ handleRemoveResume}
              isSyncing={isSyncing}
            />
          ) : (
            <EmployerProfileForm
              initialData={profileData}
              onSave={handleUpdate}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
