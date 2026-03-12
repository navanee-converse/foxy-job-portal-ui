import React from "react";
import { FiBriefcase, FiBookmark, FiMapPin } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import { formatRelativeTime } from "@/utils/date-formatter";
import type { Job } from "@/types/job";
import { getDecodedToken } from "@/utils/auth";

interface JobCardProps {
  job: Job;
  isBookmarked: boolean;
  onToggleBookmark: (e: React.MouseEvent, id: string) => void;
}
const TAG_PALETTE = [
  { bg: "bg-emerald-50", text: "text-emerald-600" },
  { bg: "bg-violet-50", text: "text-violet-600" },
  { bg: "bg-amber-50", text: "text-amber-700" },
  { bg: "bg-rose-50", text: "text-rose-600" },
  { bg: "bg-cyan-50", text: "text-cyan-600" },
];

const JobCard: React.FC<JobCardProps> = ({
  job,
  isBookmarked,
  onToggleBookmark,
}) => {
  const activeBookmark = isBookmarked;
  const payload = getDecodedToken();
  const color =
    job.status === "draft"
      ? "bg-blue-50 text-blue-600"
      : job.status === "published"
        ? "bg-green-50 text-green-600"
        : "bg-red-50 text-red-600";

  return (
    <div className="bg-white p-7 rounded-lg border border-gray-300 hover:shadow transition-all relative group">
      {payload?.role === "job_seeker" ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(e, job._id);
          }}
          className="absolute top-4 right-3 rounded-full transition-colors z-10"
          title={activeBookmark ? "Remove Bookmark" : "Save Job"}
        >
          <FiBookmark
            size={22}
            className={
              activeBookmark
                ? "fill-blue-600 text-blue-600 cursor-pointer"
                : "text-gray-400 hover:text-blue-600 cursor-pointer transition-colors"
            }
          />
        </button>
      ) : (
        <div
          className={`absolute top-6 right-6 m-8 text-sm rounded-full ${color}`}
        >
          <div className="m-3"> {job.status}</div>
        </div>
      )}
      <div className="flex gap-6">
        <div className="w-14 h-14 bg-[#1E293B] rounded-lg flex items-center justify-center text-white shrink-0 overflow-hidden">
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
            <span className="px-4 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold capitalize">
              {job.experienceLevel}
            </span>
            {job.jobTags.map((tag, index) => {
              const theme = TAG_PALETTE[index % TAG_PALETTE.length];
              return (
                <span
                  className={`px-4 py-1 rounded-full text-xs font-semibold capitalize ${theme.bg} ${theme.text}`}
                >
                  {tag.tagId.name}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
