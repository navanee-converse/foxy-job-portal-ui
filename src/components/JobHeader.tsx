import React from "react";
import { FiBriefcase, FiMapPin, FiClock, FiBookmark } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import { formatRelativeTime } from "@/utils/dateFormatter";
import type { Job } from "@/types/job";

interface JobHeaderProps {
  job: Job;
  onApply: () => void;
  onBookmark: (e: React.MouseEvent) => void;
}

const JobHeader: React.FC<JobHeaderProps> = ({ job, onApply, onBookmark }) => (
  <div className="header-gradient bg-white border-b border-gray-100 py-12 px-6 lg:px-8">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-start gap-6">
        <div className="w-20 h-20 bg-slate-900 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
          <span className="text-white font-bold text-2xl">
            {job.companyId?.name?.charAt(0) || "S"}
          </span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FiBriefcase /> {job.companyId?.name}
            </span>
            <span className="flex items-center gap-1">
              <FiMapPin /> {job.location}
            </span>
            <span className="flex items-center gap-1">
              <FiClock />{" "}
              {job.updatedAt
                ? formatRelativeTime(job.updatedAt)
                : "Recently posted"}
            </span>
            <span className="flex items-center gap-1">
              <FaRupeeSign /> ₹{job.minSalary / 1000}k - ₹{job.maxSalary / 1000}
              k
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
          onClick={onApply}
          className={`flex-1 md:flex-none px-8 py-3 font-bold rounded-lg transition-all ${
            job.isApplied
              ? "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
          }`}
        >
          {job.isApplied ? "Applied" : "Apply For Job"}
        </button>
        <button
          onClick={onBookmark}
          className="p-3 rounded-4xl transition-all active:scale-95 hover:bg-gray-50"
        >
          <FiBookmark
            className={`w-6 h-6 text-blue-600 ${job.isSaved ? "fill-blue-600" : ""}`}
          />
        </button>
      </div>
    </div>
  </div>
);

export default JobHeader;
