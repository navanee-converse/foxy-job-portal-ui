import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { request } from "@/services/api";
import {
  Loader2,
  Mail,
  Phone,
  Calendar,
  FileText,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import {
  type ApplicationDetailResponse,
  type Status,
} from "@/types/application";
import type { ApiError } from "@/types/response";

const ApplicationDetail = () => {
  const { jobId, appId } = useParams<{ jobId: string; appId: string }>();
  const navigate = useNavigate();

  const [app, setApp] = useState<ApplicationDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | "">("");
  const allStatuses: Status[] = [
    "pending",
    "viewed",
    "shortlisted",
    "scheduled",
    "rejected",
  ];
  const documentViewUrl = import.meta.env.VITE_DOC_VIEW_URL;

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await request<ApplicationDetailResponse>(
          `applications/${appId}`,
          "GET",
        );
        if (res) {
          setApp(res);
          setSelectedStatus(res.status);
        }
      } catch (error: unknown) {
        if (error && typeof error === "object" && "message" in error) {
          const apiError = error as ApiError;
          toast.error(apiError.message);
        } else toast.error("Failed to load application details");
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId && appId) fetchApplication();
  }, [jobId, appId]);

  const handleUpdateStatus = async () => {
    if (!app || !selectedStatus || selectedStatus === app.status) return;

    setIsUpdating(true);
    try {
      await request(`applications/${app._id}`, "PATCH", {
        status: selectedStatus,
      });
      setApp((prev) =>
        prev ? { ...prev, status: selectedStatus as Status } : null,
      );
      toast.success(`Application updated to ${selectedStatus}`);
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        const apiError = error as ApiError;
        toast.error(apiError.message);
      } else toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!app)
    return (
      <div className="p-20 text-center text-slate-500">
        Application not found.
      </div>
    );

  const { candidateId: candidate } = app;
  const profile = candidate?.jobSeekerProfileId;

  const getBadgeColor = (status: Status) => {
    switch (status) {
      case "shortlisted":
        return "bg-emerald-100 text-emerald-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "viewed":
        return "bg-indigo-100 text-indigo-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <div className="bg-header-bg">
      <div className="mx-auto max-w-5xl px-4 py-8 ">
        <div className="mb-8 flex flex-col  md:flex-row md:items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="w-fit text-slate-600 hover:bg-header-bg"
          >
            <ArrowLeft className="h-4 w-4" /> Back to List
          </Button>

          <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
            <Select
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value as Status)}
            >
              <SelectTrigger className="w-45 border-none focus  :ring-0 shadow-none capitalize font-medium">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                {allStatuses.map((status) => {
                  if (status === "pending" && app.status !== "pending") {
                    return null;
                  }

                  return (
                    <SelectItem
                      key={status}
                      value={status}
                      className="capitalize"
                    >
                      {status}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-6" />

            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              onClick={handleUpdateStatus}
              disabled={isUpdating || selectedStatus === app.status}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Update
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-4 h-24 w-24 rounded-full bg-blue-50 flex items-center justify-center text-3xl font-bold text-blue-600 border-4 border-white shadow-md">
                  {candidate.name?.charAt(0) ||
                    candidate.email.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {candidate.name}
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  {app.jobId.title}
                </p>
                {app.tags && app.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {app.tags.map((tagObj) => (
                      <Badge
                        key={tagObj._id}
                        variant="outline"
                        className="bg-blue-50/50 text-blue-600 border-blue-200 text-[10px] px-2 py-0"
                      >
                        {tagObj.tagId.name}
                      </Badge>
                    ))}
                  </div>
                )}
                <Badge
                  className={`mt-3 px-3 py-1 capitalize border-none ${getBadgeColor(app.status)}`}
                >
                  {app.status}
                </Badge>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="h-4 w-4 text-blue-500" />
                  <span className="text-sm truncate font-medium">
                    {candidate.email}
                  </span>
                </div>
                {candidate.phone && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">
                      {candidate.phone}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-slate-600">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">
                    Applied {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <Button
                className="w-full mt-6 cursor-pointer bg-brand-primary hover:bg-brand-btn-hover"
                onClick={() => {
                  if (app.resumeUrl.endsWith(".pdf")) {
                    window.open(app.resumeUrl, "_blank");
                  } else {
                    const encodedResumeUrl = encodeURIComponent(app.resumeUrl);
                    window.open(
                      `${documentViewUrl}${encodedResumeUrl}&embedded=true`,
                      "_blank",
                    );
                  }
                }}
              >
                <FileText className="mr-2 h-4 w-4 " /> View Resume
              </Button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="mb-8 flex items-center gap-2 text-lg font-bold text-slate-900">
                <Briefcase className="h-5 w-5 text-blue-600" /> Professional
                Experience
              </h3>
              <div className="space-y-8">
                {profile?.experience?.length ? (
                  profile.experience.map((exp, idx) => (
                    <div
                      key={idx}
                      className="relative pl-8 border-l-2 border-blue-50 last:border-0 pb-4"
                    >
                      <div className="absolute -left-2.25 top-1 h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-sm" />
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900">
                            {exp.title}
                          </h4>
                          <p className="text-sm font-semibold text-blue-600">
                            {exp.company}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100/50 px-2 py-1 rounded-sm">
                          {exp.startYear} - {exp.endYear || "Present"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic">
                    No professional experience listed.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-900">
                <GraduationCap className="h-5 w-5 text-blue-600" /> Academic
                Background
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile?.education?.length ? (
                  profile.education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-lg border border-slate-100 bg-slate-100/50 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-blue-100 text-blue-700 border-none capitalize">
                          {edu.level}
                        </Badge>
                        <span className="text-xs font-bold text-slate-400">
                          {edu.startYear} - {edu.endYear}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900">
                        {edu.degree} in {edu.fieldOfStudy}
                      </h4>
                      <p className="text-sm text-slate-500 mt-1">
                        {edu.institution}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Score
                        </span>
                        <span className="text-sm font-bold text-blue-600">
                          {edu.percentage}%
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic">No education listed.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
