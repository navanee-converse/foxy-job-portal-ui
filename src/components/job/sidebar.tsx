import React from "react";
import { FiCalendar, FiClock, FiMapPin, FiUser } from "react-icons/fi";
import { PiMoneyBold } from "react-icons/pi";
import type { IconType } from "react-icons";
import { formatRelativeTime } from "@/utils/date-formatter";
import type { Job } from "@/types/job";

interface SidebarItemProps {
  icon: IconType;
  label: string;
  value: string | number | React.ReactNode;
}

const JobSidebar: React.FC<{ job: Job }> = ({ job }) => {
  const formatSalary = (min: number, max: number) => {
    return `₹${(min / 1000).toFixed(0)}k - ₹${(max / 1000).toFixed(0)}k`;
  };

  return (
    <aside className="sticky top-24">
      {" "}
      <div className="flex flex-col gap-5 bg-white p-8 rounded-lg border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Job Overview</h3>
        <div className="space-y-6">
          <SidebarItem
            icon={FiCalendar}
            label="Date Posted"
            value={
              job.updatedAt
                ? `Posted ${formatRelativeTime(job.updatedAt)}`
                : "Recently"
            }
          />
          {job.lastDate && (
            <SidebarItem
              icon={FiClock}
              label="Expiration date"
              value={new Date(job.lastDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            />
          )}
          <SidebarItem
            icon={FiMapPin}
            label="Location"
            value={
              job.location !== "onsite"
                ? job.location
                : (job.companyId?.location.city ?? job.location)
            }
          />
          <SidebarItem
            icon={FiUser}
            label="Job Category"
            value={job.title.split(" ")[0]}
          />
          <SidebarItem
            icon={PiMoneyBold}
            label="Salary"
            value={formatSalary(job.minSalary, job.maxSalary)}
          />
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-md font-bold text-gray-900 mb-4">
            Skills & Requirements
          </h3>
          <ul className="flex gap-2 flex-wrap">
            {job.jobTags.map((tag) => (
              <li
                key={tag.tagId._id}
                className="bg-slate-50 p-2 px-4 rounded-lg text-xs font-medium text-slate-600 border border-slate-100 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-default"
              >
                {tag.tagId.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon: Icon, label, value }: SidebarItemProps) => (
  <div className="flex items-start gap-4">
    <div className="p-2 bg-blue-50 rounded-lg">
      <Icon className="w-5 h-5 text-blue-600" />
    </div>
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

export default JobSidebar;
