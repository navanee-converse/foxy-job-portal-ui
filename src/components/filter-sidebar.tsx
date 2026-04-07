import React from "react";
import { FiSearch } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import {
  EmploymentType,
  ExperienceLevel,
  Location,
  type EmploymentTypeValue,
  type ExperienceLevelValue,
  type LocationValue,
} from "@/validations/job-filter";
import CustomSelect from "./field/custom-select";

interface SidebarProps {
  filters: {
    title: string;
    locationType: LocationValue | "";
    experienceLevel: ExperienceLevelValue | "";
    city: string;
    minSalary: string;
    maxSalary: string;
    categoryId: string;
    companyName: string;
    selectedEmploymentTypes: EmploymentTypeValue[];
  };
  setters: {
    setTitle: (val: string) => void;
    setLocationType: (val: LocationValue | "") => void;
    setExperienceLevel: (val: ExperienceLevelValue | "") => void;
    setMinSalary: (val: string) => void;
    setMaxSalary: (val: string) => void;
    setCity: (val: string) => void;
    setCategoryId: (val: string) => void;
    setCompanyName: (val: string) => void;
  };
  handleEmploymentToggle: (type: EmploymentTypeValue) => void;
}

const FilterSidebar: React.FC<SidebarProps> = ({
  filters,
  setters,
  handleEmploymentToggle,
}) => {
  return (
    <aside className="w-full space-y-6 no-scrollbar">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
        <div className="space-y-3">
          <h4 className="font-bold text-gray-800">Search by title</h4>
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Job title..."
              value={filters.title}
              onChange={(e) => setters.setTitle(e.target.value)}
              className="w-full pl-11 cursor-pointer pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-gray-800">Experience Level</h4>
          <CustomSelect
            value={filters.experienceLevel}
            onChange={(val) => setters.setExperienceLevel(val)}
            options={Object.values(ExperienceLevel)}
            placeholder="Experience Levels"
          />
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-gray-800">Location Type</h4>
          <CustomSelect
            value={filters.locationType}
            onChange={(val) => setters.setLocationType(val)}
            options={Object.values(Location)}
            placeholder="Location Type"
          />
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-gray-800">Search by Company</h4>
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Company name..."
              value={filters.companyName}
              onChange={(e) => setters.setCompanyName(e.target.value)}
              className="w-full pl-11 cursor-pointer pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-gray-800">City</h4>
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="City"
              value={filters.city}
              onChange={(e) => setters.setCity(e.target.value)}
              className="w-full pl-11 cursor-pointer pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
            />
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
                    if (val === "" || Number(val) >= 0) {
                      setters.setMinSalary(val);
                    }
                  }}
                  className={`w-full pl-8 pr-2 cursor-pointer py-2 border border-[#e5e7eb] rounded-lg text-sm outline-none transition-colors${
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
                  className={`w-full pl-8 pr-2 cursor-pointer py-2 border rounded-lg text-sm outline-none transition-colors ${
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
                className="w-4 h-4 rounded cursor-pointer border-gray-300 text-blue-600 focus:ring-blue-500"
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
