import React from "react";
import { FiBriefcase, FiBookmark, FiMapPin } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { formatRelativeTime } from "@/utils/dateFormatter";
import type { Job } from "@/types/job";

interface JobCardProps {
  job: Job;
  isBookmarked: boolean;
  onToggleBookmark: (e: React.MouseEvent, id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  isBookmarked,
  onToggleBookmark,
}) => {
  const navigate = useNavigate();

  const activeBookmark = isBookmarked

  return (
    <div className="bg-white p-7 rounded-2xl border border-gray-300 hover:shadow-lg transition-all relative group">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleBookmark(e, job._id);
        }}
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-50 transition-colors z-10"
        title={activeBookmark ? "Remove Bookmark" : "Save Job"}
      >
        <FiBookmark
          size={22}
          className={
            activeBookmark
              ? "fill-blue-600 text-blue-600"
              : "text-gray-400 hover:text-blue-600"
          }
        />
      </button>

      <div className="flex gap-6">
        <div className="w-14 h-14 bg-[#1E293B] rounded-xl flex items-center justify-center text-white shrink-0 overflow-hidden">
          {job.companyId?.logo ? (
            <img
              src={job.companyId.logo}
              className="w-full h-full object-cover"
              alt={`${job.companyId.name} logo`}
            />
          ) : (
            <FiBriefcase size={24} />
          )}
        </div>

        <div className="flex-1">
          <h3
            className="font-bold text-lg text-gray-800 mb-2 cursor-pointer hover:text-blue-600 inline-block"
            onClick={() => navigate(`/jobs/${job._id}`)}
          >
            {job.title}
          </h3>

          <div className="flex flex-wrap gap-y-2 gap-x-5 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1.5">
              <FiBriefcase className="text-gray-400" />{" "}
              {job.companyId?.name || "Company"}
            </span>
            <span className="flex items-center gap-1.5">
              <FiMapPin className="text-gray-400" /> {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-gray-400">🕒</span>
              {job.updatedAt
                ? formatRelativeTime(job.updatedAt)
                : "Recently posted"}
            </span>

            <span className="flex items-center gap-1.5 font-medium text-gray-700">
              <FaRupeeSign className="text-gray-400" />
              {job.minSalary ? `${job.minSalary / 1000}k` : "N/A"} -
              {job.maxSalary ? `${job.maxSalary / 1000}k` : "N/A"}
            </span>
          </div>

          <div className="flex gap-2">
            <span className="px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold capitalize">
              {job.employmentType}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
