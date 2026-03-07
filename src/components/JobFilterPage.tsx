import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
import useDebounce from "@/hooks/useDebounce";

const JobFilterPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const limit = 10;

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
  const [city, setCity] = useState("");

  const debouncedTitle = useDebounce(title);
  const debouncedCity = useDebounce(city);
  const debouncedMinSalary = useDebounce(minSalary);
  const debouncedMaxSalary = useDebounce(maxSalary);

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
        title: debouncedTitle.trim() || undefined,
        city: debouncedCity.trim() || undefined,
        employmentType:
          selectedEmploymentTypes.length > 0
            ? selectedEmploymentTypes
            : undefined,
        experienceLevel: experienceLevel || undefined,
        location: locationType || undefined,
        minSalary: debouncedMinSalary.trim() || undefined,
        maxSalary: debouncedMaxSalary.trim() || undefined,
      };

      const validation = JobFilterSchema.safeParse(filterData);
      if (!validation.success) return;

      setIsLoading(true);
      const params = new URLSearchParams();

      if (filterData.title) params.append("title", filterData.title);
      if (filterData.city) params.append("city", filterData.city);
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
    debouncedTitle,
    debouncedCity,
    debouncedMinSalary,
    debouncedMaxSalary,
    locationType,
    experienceLevel,
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
    <div className="h-screen flex flex-col overflow-hidden bg-header-bg ">
      <div className="shrink-0  w-full py-12 flex flex-col items-center justify-center border-b border-gray-100">
        <h1 className="text-3xl text-center font-bold mb-3 text-gray-800">
          Jobs
        </h1>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8 p- pb-15 overflow-hidden">
        {payload?.role === "job_seeker" && (
          <div className="w-full lg:w-1/4 shrink-0 h-full overflow-y-auto pr-2 custom-scrollbar">
            <FilterSidebar
              filters={{
                title,
                locationType,
                experienceLevel,
                city,
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
                setCity: (v) => {
                  setCity(v);
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
        )}

        <main className="flex-1 h-full flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-50/20">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-44 bg-white rounded-lg border border-gray-100"
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
                  className="cursor-pointer transition-shadow duration-300 "
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

          <div className="shrink-0 px-6 py-4 border-t border-gray-100 flex items-center justify-between  gap-4 bg-white">
            <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              Page {page} of {totalPages || 1}
            </div>

            <div>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 disabled:opacity-30 transition-all disabled:cursor-not-allowed cursor-pointer"
              >
                Prev
              </button>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={
                  jobs.length < limit || (totalPages > 1 && page === totalPages)
                }
                className="p-2 disabled:opacity-30 transition-all disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobFilterPage;
