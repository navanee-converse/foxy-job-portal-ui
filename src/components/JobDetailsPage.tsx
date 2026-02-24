import { FaFacebookSquare, FaLinkedin } from "react-icons/fa";
import JobSidebar from "./JobSidebar";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import type { Job } from "@/types/job";
import { getOrSetSessionId } from "@/utils/session";
import JobHeader from "./JobHeader";
import { request } from "@/services/api";
import toast from "react-hot-toast";

const JobDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sessionId = useRef(getOrSetSessionId());
  const jobUrl = window.location.href;

  const handleApplyJob = async () => {
    try {
      await request("/applications", "POST", { jobId: job?._id });

      setJob((prev) => (prev ? { ...prev, isApplied: true } : null));
      toast.success("Application submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit application.");
    }
  };
  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await request("/users/me/saved-jobs", "POST", { jobId: job?._id });

      setJob((prev) => (prev ? { ...prev, isSaved: !prev.isSaved } : null));
    } catch (error) {
      toast.error("Could not update bookmark.");
    }
  };

  const shareOnFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}`;
    window.open(shareUrl, "facebook-share-dialog", "width=626,height=436");
  };
  const shareOnLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`;
    window.open(shareUrl, "linkedin-share-dialog", "width=600,height=600");
  };

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setIsLoading(true);
        const response = await request(`/jobs/${id}`, "GET", null, {
          "x-session-id": sessionId.current,
        });
        sessionId.current = getOrSetSessionId();
        setJob(response);
      } catch (error) {
        toast.error("Could not load job details");
        navigate("/jobs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobDetails();
  }, [id, navigate]);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!job) return null;

  return (
    <div className="min-h-screen pb-20 bg-white">
      <JobHeader
        job={job}
        onApply={handleApplyJob}
        onBookmark={handleToggleBookmark}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
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
          <div className="flex gap-4 items-center lg:col-span-3">
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

        <JobSidebar job={job} />
      </div>
    </div>
  );
};

export default JobDetailsPage;
