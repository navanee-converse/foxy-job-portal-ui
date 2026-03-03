import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { request } from "../services/api";
import {
  JobFilterSchema,
  type EmploymentTypeValue,
  type ExperienceLevelValue,
  type LocationValue,
} from "@/validations/job-filter";
import JobCard from "@/components/JobCard";
import FilterSidebar from "./FilterSideBar";
import type { Job } from "@/types/job";
import { getDecodedToken } from "@/utils/auth";

const JobFilterPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const limit = 3;

  const [title, setTitle] = useState("");
  const [locationType, setLocationType] = useState<LocationValue | "">("");
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<
    EmploymentTypeValue[]
  >([]);
  const [experienceLevel, setExperienceLevel] = useState<
    ExperienceLevelValue | ""
  >("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");

  const handleEmploymentToggle = (type: EmploymentTypeValue) => {
    setPage(1);
    setSelectedEmploymentTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };
  const payload = getDecodedToken();
  const fetchJobs = useCallback(async () => {
    try {
      const filterData = {
        title: title.trim() || undefined,
        employmentType:
          selectedEmploymentTypes.length > 0
            ? selectedEmploymentTypes
            : undefined,
        experienceLevel: experienceLevel || undefined,
        location: locationType || undefined,
        minSalary: minSalary || undefined,
        maxSalary: maxSalary || undefined,
      };

      const validation = JobFilterSchema.safeParse(filterData);
      if (!validation.success) return;

      setIsLoading(true);
      const params = new URLSearchParams();

      if (filterData.title) params.append("title", filterData.title);
      if (filterData.location) params.append("location", filterData.location);
      if (filterData.experienceLevel)
        params.append("experienceLevel", filterData.experienceLevel);
      if (filterData.minSalary)
        params.append("minSalary", filterData.minSalary);
      if (filterData.maxSalary)
        params.append("maxSalary", filterData.maxSalary);
      selectedEmploymentTypes.forEach((type) =>
        params.append("employmentType", type),
      );

      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const response = await request(`/jobs?${params.toString()}`, "GET");

      if (response?.data) {
        setJobs(response.data);
        setTotalJobs(response.total);
      } else {
        setJobs(response || []);
        setTotalJobs(response?.length || 0);
      }
    } catch (error) {
      toast.error("Failed to load jobs.");
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    title,
    locationType,
    experienceLevel,
    minSalary,
    maxSalary,
    selectedEmploymentTypes,
  ]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarked_jobs") || "[]");
    const apiSaved = jobs.filter((job) => job.isSaved).map((job) => job._id);
    const combined = Array.from(new Set([...saved, ...apiSaved]));
    setBookmarks(combined);
  }, [jobs]);

  const toggleBookmark = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();

    const isCurrentlySaved = bookmarks.includes(jobId);

    const updated = isCurrentlySaved
      ? bookmarks.filter((id) => id !== jobId)
      : [...bookmarks, jobId];

    setBookmarks(updated);
    localStorage.setItem("bookmarked_jobs", JSON.stringify(updated));

    try {
      await request(`/users/me/saved-jobs`, "POST", { jobId });
    } catch (error) {
      const rollback = JSON.parse(
        localStorage.getItem("bookmarked_jobs") || "[]",
      );
      setBookmarks(rollback);
      toast.error("Failed to sync bookmark. Please try again.");
    }
  };

  const totalPages = Math.ceil(totalJobs / limit);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="shrink-0 header-gradient w-full py-12 flex flex-col items-center justify-center border-b border-gray-100">
        <h1 className="text-3xl text-center font-bold mb-3 text-gray-800">
          Find Jobs
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <p
            className="hover:text-blue-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Home
          </p>
          <span>/</span>
          <p className="text-gray-400">Jobs</p>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8 p-6 pb-15 overflow-hidden">
        <div className="w-full lg:w-1/4 shrink-0 h-full overflow-y-auto pr-2 custom-scrollbar">
          <FilterSidebar
            filters={{
              title,
              locationType,
              experienceLevel,
              minSalary,
              maxSalary,
              selectedEmploymentTypes,
            }}
            setters={{
              setTitle: (v) => {
                setTitle(v);
                setPage(1);
              },
              setLocationType: (v) => {
                setLocationType(v);
                setPage(1);
              },
              setExperienceLevel: (v) => {
                setExperienceLevel(v);
                setPage(1);
              },
              setMinSalary: (v) => {
                setMinSalary(v);
                setPage(1);
              },
              setMaxSalary: (v) => {
                setMaxSalary(v);
                setPage(1);
              },
            }}
            handleEmploymentToggle={handleEmploymentToggle}
          />
        </div>

        <main className="flex-1 h-full flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="shrink-0 px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
            {" "}
            <p className="text-gray-500 text-sm">
              Showing{" "}
              <span className="font-bold text-gray-800">{jobs.length}</span> of{" "}
              <span className="font-bold text-gray-800">{totalJobs}</span> total
              results
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-50/20">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-44 bg-white rounded-2xl border border-gray-100"
                  />
                ))}
              </div>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <div
                  key={job._id}
                  onClick={() => {
                    if (payload?.role === "job_seeker") {
                      navigate(`/jobs/${job._id}`);
                    } else {
                      navigate(`/update-job/${job._id}`);
                    }
                  }}
                  className="cursor-pointer transition-transform hover:scale-[1.01]"
                >
                  <JobCard
                    job={job}
                    isBookmarked={bookmarks.includes(job._id)}
                    onToggleBookmark={toggleBookmark}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-gray-500">
                No jobs found matching your criteria.
              </div>
            )}
          </div>

          <div className="shrink-0 px-6 py-4 border-t border-gray-100 flex items-center justify-center gap-4 bg-white">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30 transition-all"
            >
              <FiChevronLeft size={20} />
            </button>

            <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              Page {page} of {totalPages || 1}
            </div>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={
                jobs.length < limit || (totalPages > 1 && page === totalPages)
              }
              className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30 transition-all"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobFilterPage;
