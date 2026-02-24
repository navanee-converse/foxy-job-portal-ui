import React from "react";
import { FiCalendar, FiClock, FiMapPin, FiUser } from "react-icons/fi";
import { PiMoneyBold } from "react-icons/pi";
import { formatRelativeTime } from "@/utils/dateFormatter";
import type { Job } from "@/types/job";

const JobSidebar: React.FC<{ job: Job }> = ({ job }) => (
  <aside>
    <div className="flex flex-col gap-5 bg-header-bg p-8 rounded-2xl border border-gray-100 shadow-sm sticky top-25">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Job Overview</h3>
      <div className="space-y-6">
        <SidebarItem icon={FiCalendar} label="Date Posted" value={job.updatedAt ? `Posted ${formatRelativeTime(job.updatedAt)}` : "Recently"} />
        {job.lastDate && (
          <SidebarItem icon={FiClock} label="Expiration date" value={new Date(job.lastDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
        )}
        <SidebarItem icon={FiMapPin} label="Location" value={job.location} />
        <SidebarItem icon={FiUser} label="Job Title" value={job.title.split(" ")[0]} />
        <SidebarItem icon={PiMoneyBold} label="Salary" value={`₹${job.minSalary / 1000}k - ₹${job.maxSalary / 1000}k`} />
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Skills & Requirements</h3>
        <ul className="flex gap-2 flex-wrap">
          {job.jobTags.map((tag) => (
            <li key={tag.tagId._id} className="bg-white p-2 px-4 rounded-lg shadow-sm text-sm border border-gray-50">
              {tag.tagId.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </aside>
);

const SidebarItem = ({ icon: Icon, label, value }: any) => (
  <div className="flex items-start gap-4">
    <Icon className="w-6 h-6 text-blue-500 mt-1" />
    <div>
      <p className="text-sm font-bold text-gray-900">{label}:</p>
      <p className="text-sm text-gray-500">{value}</p>
    </div>
  </div>
);

export default JobSidebar;