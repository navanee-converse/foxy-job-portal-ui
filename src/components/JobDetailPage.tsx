import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { request } from "../services/api";
import {
  FiMapPin,
  FiBriefcase,
  FiClock,
  FiCalendar,
  FiUser,
  FiBookmark,
} from "react-icons/fi";
import { PiMoneyBold } from "react-icons/pi";
import toast from "react-hot-toast";
import { getOrSetSessionId } from "@/utils/session";
import type { Job } from "@/types/job";
import { formatRelativeTime } from "@/utils/dateFormatter";
import { FaRupeeSign } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";

const JobDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sessionId = useRef(getOrSetSessionId());

  const jobUrl = window.location.href;
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

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!job) return null;

  return (
    <div className="min-h-screen pb-20">
      <div className="header-gradient bg-white border-b border-gray-100 py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-slate-900 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
              <span className="text-white font-bold text-2xl">
                {job.companyId?.name?.charAt(0) || "S"}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <FiBriefcase /> {job.companyId?.name || "Company"}
                </span>
                <span className="flex items-center gap-1">
                  <FiMapPin /> {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <FiClock />
                  {job.updatedAt
                    ? formatRelativeTime(job.updatedAt)
                    : "Recently posted"}
                </span>
                <span className="flex items-center gap-1">
                  <FaRupeeSign /> ₹{job.minSalary / 1000}k - ₹
                  {job.maxSalary / 1000}k
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold capitalize">
                  {job.employmentType?.replace("-", " ")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              disabled={job.isApplied}
              onClick={handleApplyJob}
              className={`flex-1 md:flex-none px-8 py-3 font-bold rounded-lg transition-all ${
                job.isApplied
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
              }`}
            >
              {job.isApplied ? "Applied" : "Apply For Job"}
            </button>

            <button
              onClick={handleToggleBookmark}
              className={`p-3 rounded-4xl transition-all active:scale-95 hover:bg-gray-50`}
            >
              <FiBookmark
                className={`w-6 h-6 text-blue-600${job.isSaved ? " fill-blue-600" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

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

          {job.responsibilities?.length > 0 && (
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

          {job.skillsAndQualifications?.length > 0 && (
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
        </div>

        <aside>
          <div className="flex flex-col gap-5 bg-header-bg p-8 rounded-2xl border border-gray-100 shadow-sm sticky top-25">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Job Overview
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <FiCalendar className="w-6 h-6 text-blue-500 mt-1" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      Date Posted:
                    </p>
                    <p className="text-sm text-gray-500">
                      Posted{" "}
                      {job.updatedAt
                        ? formatRelativeTime(job.updatedAt)
                        : "Recently posted"}
                    </p>
                  </div>
                </div>
                {job.lastDate && (
                  <div className="flex items-start gap-4">
                    <FiClock className="w-6 h-6 text-blue-500 mt-1" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Expiration date:
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(job.lastDate).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <FiMapPin className="w-6 h-6 text-blue-500 mt-1" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Location:</p>
                    <p className="text-sm text-gray-500">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <FiUser className="w-6 h-6 text-blue-500 mt-1" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      Job Title:
                    </p>
                    <p className="text-sm text-gray-500">
                      {job.title.split(" ")[0]}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <PiMoneyBold className="w-6 h-6 text-blue-500 mt-1" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Salary:</p>
                    <p className="text-sm text-gray-500">
                      ₹{job.minSalary / 1000}k - ₹{job.maxSalary / 1000}k
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {" "}
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Skills & Requirements
              </h3>
              <div>
                <ul className="flex gap-4 flex-wrap">
                  {job.jobTags.map((tag) => (
                    <li
                      key={tag.tagId._id || tag.tagId.name}
                      className="bg-white p-2 px-4 rounded-lg shadow-sm"
                    >
                      {tag.tagId.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </aside>
        <div className="flex gap-4">
          <div className="font-medium">Share this job</div>
          <FaFacebookSquare
            size={30}
            className="text-button-fb"
            onClick={shareOnFacebook}
          />
          <div className="">
            <FaLinkedin
              onClick={shareOnLinkedIn}
              size={30}
              className="bg-white text-button-linkedin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
