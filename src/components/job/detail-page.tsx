import { FaFacebookSquare, FaLinkedin } from "react-icons/fa";
import JobSidebar from "./sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import type { Job } from "@/types/job";
import { getOrSetSessionId } from "@/utils/session";
import JobHeader from "./header";
import { request } from "@/services/api";
import toast from "react-hot-toast";
import { Skeleton } from "../ui/skeleton";
import type { ApiError } from "@/types/response";

const JobDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sessionId = useRef(getOrSetSessionId());
  const jobUrl = window.location.href;

  const fbUrl = import.meta.env.VITE_FB_URL;
  const linkedInUrl = import.meta.env.VITE_LINKEDIN_URL;

  const handleApplyJob = async () => {
    try {
      await request("/applications", "POST", { jobId: job?._id });

      setJob((prev) => (prev ? { ...prev, isApplied: true } : null));
      toast.success("Application submitted successfully!");
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        const apiError = error as ApiError;
        console.error(apiError.message);
      } else toast.error("Failed to submit application.");
    }
  };
  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!job?._id) return;
    try {
      await request("/users/me/saved-jobs", "POST", { jobId: job?._id });

      const storageKey = "bookmarked_jobs";
      const storedIds: string[] = JSON.parse(
        localStorage.getItem(storageKey) || "[]",
      );

      let updatedIds: string[];
      if (job.isSaved) {
        updatedIds = storedIds.filter((id) => id !== job._id);
        toast.success("Removed from bookmarks");
      } else {
        updatedIds = [...storedIds, job._id];
        toast.success("Job saved successfully!");
      }

      localStorage.setItem(storageKey, JSON.stringify(updatedIds));

      setJob((prev) => (prev ? { ...prev, isSaved: !prev.isSaved } : null));
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        const apiError = error as ApiError;
        console.error(apiError.message);
      } else toast.error("Could not update bookmark.");
    }
  };

  const shareOnFacebook = () => {
    const shareUrl = `${fbUrl}${encodeURIComponent(jobUrl)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };
  const shareOnLinkedIn = () => {
    const shareUrl = `${linkedInUrl}${encodeURIComponent(jobUrl)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setIsLoading(true);
        const response = await request<Job>(`/jobs/${id}`, "GET", null, {
          "x-session-id": sessionId.current,
        });
        setJob(response);
      } catch (error) {
        if (error && typeof error === "object" && "message" in error) {
          const apiError = error as ApiError;
          console.error(apiError.message);
        } else toast.error("Could not load job details");
        navigate("/jobs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobDetails();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen pb-20 relative bg-white">
        <div className="absolute top-25 left-75 flex gap-2 z-10">
          <Skeleton className="h-20 w-20 rounded-md" />
          <div>
            <Skeleton className="h-10 w-80 mb-4" />
            <Skeleton className="h-6 w-60 mb-4" />
          </div>
          <Skeleton className="ml-120 h-15 w-40 rounded-md" />
        </div>
        <Skeleton className="h-62.5 w-full rounded-none bg-white" />

        <div className="max-w-7xl mx-auto px-6 xl:px-0 z-10 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <Skeleton className="h-7 w-48 mb-4" />{" "}
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[92%]" />
              </div>
            </section>

            <section>
              <Skeleton className="h-7 w-56 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </section>

            <section>
              <Skeleton className="h-7 w-64 mb-4" />
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-[85%]" />
                  </div>
                ))}
              </div>
            </section>

            <div className="flex gap-4 items-center">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>

          <div className="lg:col-span-1">
            <Skeleton className="h-112.5 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen pb-20 bg-header-bg">
      <JobHeader
        job={job}
        onApply={handleApplyJob}
        onBookmark={handleToggleBookmark}
      />

      <div className="max-w-7xl mx-auto px-6 xl:px-0 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Job Description
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {job.description || "No description provided."}
            </p>
          </section>

          {job.responsibilities && job.responsibilities.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Key Responsibilities
              </h3>
              <ul className="space-y-3">
                {job.responsibilities.map((item: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-gray-600"
                  >
                    <span className="mt-2 w-1.5 h-1.5 bg-gray-400 rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {job.skillsAndQualifications &&
            job.skillsAndQualifications.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Skills & Qualifications
                </h3>
                <ul className="space-y-3">
                  {job.skillsAndQualifications.map(
                    (item: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-gray-600"
                      >
                        <span className="mt-2 w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0" />
                        {item}
                      </li>
                    ),
                  )}
                </ul>
              </section>
            )}

          <div className="flex gap-4 items-center">
            <div className="font-medium text-gray-700">Share this job:</div>
            <FaFacebookSquare
              size={32}
              className="text-[#1877F2] cursor-pointer"
              onClick={shareOnFacebook}
            />
            <FaLinkedin
              size={32}
              className="text-[#0A66C2] cursor-pointer"
              onClick={shareOnLinkedIn}
            />
          </div>
        </div>
        <div className="lg:col-span-1">
          <JobSidebar job={job} />
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
