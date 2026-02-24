import React from "react";
import { FiSearch, FiMapPin, FiChevronDown } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import {
  EmploymentType,
  ExperienceLevel,
  Location,
  type EmploymentTypeValue,
  type ExperienceLevelValue,
  type LocationValue,
} from "@/validations/job-filter";

interface SidebarProps {
  filters: {
    title: string;
    locationType: LocationValue | "";
    experienceLevel: ExperienceLevelValue | "";
    minSalary: string;
    maxSalary: string;
    selectedEmploymentTypes: EmploymentTypeValue[];
  };
  setters: {
    setTitle: (val: string) => void;
    setLocationType: (val: LocationValue | "") => void;
    setExperienceLevel: (val: ExperienceLevelValue | "") => void;
    setMinSalary: (val: string) => void;
    setMaxSalary: (val: string) => void;
  };
  handleEmploymentToggle: (type: EmploymentTypeValue) => void;
}

const FilterSidebar: React.FC<SidebarProps> = ({
  filters,
  setters,
  handleEmploymentToggle,
}) => {
  return (
    <aside className="w-full space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-8">
        <div className="space-y-3">
          <h4 className="font-bold text-gray-800">Search by title</h4>
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Job title..."
              value={filters.title}
              onChange={(e) => setters.setTitle(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-gray-800">Experience Level</h4>
          <div className="relative">
            <select
              value={filters.experienceLevel}
              onChange={(e) =>
                setters.setExperienceLevel(
                  e.target.value as ExperienceLevelValue | "",
                )
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none appearance-none bg-white cursor-pointer focus:border-blue-500"
            >
              <option value="">All Experience Levels</option>
              {Object.values(ExperienceLevel).map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              <FiChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-gray-800">Location Type</h4>
          <div className="relative">
            <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filters.locationType}
              onChange={(e) =>
                setters.setLocationType(e.target.value as LocationValue | "")
              }
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg text-sm outline-none appearance-none bg-white cursor-pointer"
            >
              <option value="">All Locations</option>
              {Object.values(Location).map((loc) => (
                <option key={loc} value={loc} className="capitalize">
                  {loc}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              <FiChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-gray-800">Salary Range</h4>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <input
                  type="number"
                  placeholder="Min"
                  min="0"
                  value={filters.minSalary}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Only allow positive numbers
                    if (val === "" || Number(val) >= 0) {
                      setters.setMinSalary(val);
                    }
                  }}
                  className={`w-full pl-8 pr-2 py-2 border rounded-lg text-sm outline-none transition-colors ${
                    filters.maxSalary &&
                    Number(filters.minSalary) > Number(filters.maxSalary)
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                />
              </div>
              <span className="text-gray-400">-</span>
              <div className="relative flex-1">
                <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <input
                  type="number"
                  placeholder="Max"
                  min="0"
                  value={filters.maxSalary}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || Number(val) >= 0) {
                      setters.setMaxSalary(val);
                    }
                  }}
                  className={`w-full pl-8 pr-2 py-2 border rounded-lg text-sm outline-none transition-colors ${
                    filters.maxSalary &&
                    Number(filters.maxSalary) < Number(filters.minSalary)
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                />
              </div>
            </div>

            {filters.maxSalary &&
              filters.minSalary &&
              Number(filters.maxSalary) < Number(filters.minSalary) && (
                <p className="text-[10px] text-red-500 font-medium italic">
                  * Max salary must be greater than min salary
                </p>
              )}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-gray-800">Job Type</h4>
          {Object.values(EmploymentType).map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.selectedEmploymentTypes.includes(type)}
                onChange={() => handleEmploymentToggle(type)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 capitalize">
                {type.replace("-", " ")}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
