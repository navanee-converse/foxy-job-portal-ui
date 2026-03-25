import React from "react";
import { FiBriefcase, FiMapPin, FiClock, FiBookmark } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import { formatRelativeTime } from "@/utils/date-formatter";
import type { Job } from "@/types/job";
import { getDecodedToken } from "@/utils/auth";

interface JobHeaderProps {
  job: Job;
  onApply: () => void;
  onBookmark: (e: React.MouseEvent) => void;
}

const payload = getDecodedToken();
const JobHeader: React.FC<JobHeaderProps> = ({ job, onApply, onBookmark }) => (
  <div className="bg-header-bg py-8 md:py-12 px-4 md:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <div className="w-20 h-20 bg-slate-900 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
          <span className="text-white font-bold text-2xl">
            {job.companyId?.name?.charAt(0) || "S"}
          </span>
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 wrap-break-word">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1 whitespace-nowrap">
              <FiBriefcase /> {job.companyId?.name}
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <FiMapPin />{" "}
              {job.location !== "onsite"
                ? job.location
                : (job.companyId?.location.city ?? job.location)}
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <FiClock />{" "}
              {job.updatedAt
                ? formatRelativeTime(job.updatedAt)
                : "Recently posted"}
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <FaRupeeSign /> ₹{job.minSalary / 1000}k - ₹{job.maxSalary / 1000}
              k
            </span>
          </div>

          <div className="flex justify-center sm:justify-start gap-2 mt-4">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold capitalize">
              {job.employmentType?.replace("-", " ")}
            </span>
          </div>
        </div>
      </div>

      {payload?.role === "job_seeker" && (
        <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
          <button
            disabled={job.isApplied}
            onClick={onApply}
            className={`flex-1 md:flex-none px-8 py-3 font-bold rounded-lg transition-all ${
              job.isApplied
                ? "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"
                : "bg-brand-primary text-white hover:bg-brand-btn-hover active:scale-95 cursor-pointer"
            }`}
          >
            {job.isApplied ? "Applied" : "Apply For Job"}
          </button>

          <button
            onClick={onBookmark}
            className="p-3 transition-all active:scale-95 cursor-pointer shrink-0"
            title={job.isSaved ? "Remove from bookmarks" : "Save job"}
          >
            <FiBookmark
              className={`w-6 h-6 transition-colors ${
                job.isSaved ? "text-blue-600 fill-blue-600" : "text-gray-400"
              }`}
            />
          </button>
        </div>
      )}
    </div>
  </div>
);

export default JobHeader;
