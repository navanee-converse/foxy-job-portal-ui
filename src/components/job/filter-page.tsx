import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { request } from "../../services/api";
import {
  JobFilterSchema,
  type EmploymentTypeValue,
  type ExperienceLevelValue,
  type LocationValue,
} from "@/validations/job-filter";
import JobCard from "@/components/job/card";
import type { Job } from "@/types/job";
import { getDecodedToken } from "@/utils/auth";
import useDebounce from "@/hooks/useDebounce";
import { JobCardSkeleton } from "./card-skeleton";
import JobPagination from "./pagination";
import FilterSidebar from "../filter-sidebar";
import type { PaginationMeta } from "@/types/pagination";

const JobFilterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const payload = getDecodedToken();
  const limit = 10;

  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  const [title, setTitle] = useState(searchParams.get("title") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [categoryId, setCategoryId] = useState(
    searchParams.get("categoryId") || "",
  );
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [locationType, setLocationType] = useState<LocationValue | "">("");
  const [experienceLevel, setExperienceLevel] = useState<
    ExperienceLevelValue | ""
  >("");
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<
    EmploymentTypeValue[]
  >([]);

  const dTitle = useDebounce(title, 800);
  const dCity = useDebounce(city);
  const dMinSalary = useDebounce(minSalary);
  const dMaxSalary = useDebounce(maxSalary);

  const fetchJobs = useCallback(async () => {
    try {
      const filterData = {
        title: dTitle.trim() || undefined,
        city: dCity.trim() || undefined,
        employmentType:
          selectedEmploymentTypes.length > 0
            ? selectedEmploymentTypes
            : undefined,
        categoryId: categoryId || undefined,
        experienceLevel: experienceLevel || undefined,
        location: locationType || undefined,
        minSalary: dMinSalary.trim() || undefined,
        maxSalary: dMaxSalary.trim() || undefined,
      };

      const validation = JobFilterSchema.safeParse(filterData);
      if (!validation.success) return;

      setIsLoading(true);
      const params = new URLSearchParams();
      Object.entries(filterData).forEach(([key, value]) => {
        if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
        else if (value) params.append(key, value as string);
      });
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const response = await request<{ data: Job[] } & Partial<PaginationMeta>>(
        `/jobs?${params.toString()}`,
        "GET",
      );

      const data = response.data;
      setJobs(data);
      setTotalJobs(response?.total || data.length || 0);
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    dTitle,
    dCity,
    dMinSalary,
    dMaxSalary,
    locationType,
    experienceLevel,
    selectedEmploymentTypes,
    categoryId,
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
    } catch {
      setBookmarks(JSON.parse(localStorage.getItem("bookmarked_jobs") || "[]"));
      toast.error("Failed to sync bookmark.");
    }
  };

  const totalPages = Math.ceil(totalJobs / limit);

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-header-bg pb-5">
      <header className="bg-header-bg shrink-0 w-full py-6 md:py-10 flex flex-col items-center border-b border-gray-100">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Jobs</h1>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8 pb-4 pr-4 overflow-y-auto lg:overflow-hidden min-h-0">
        {payload?.role !== "employer" && (
          <aside className="w-full lg:w-1/4 shrink-0 overflow-y-visible lg:overflow-y-auto custom-scrollbar">
            <FilterSidebar
              filters={{
                title,
                locationType,
                experienceLevel,
                city,
                minSalary,
                maxSalary,
                selectedEmploymentTypes,
                categoryId,
              }}
              setters={{
                setTitle,
                setCity,
                setLocationType,
                setExperienceLevel,
                setMinSalary,
                setMaxSalary,
                setCategoryId,
              }}
              handleEmploymentToggle={(type) => {
                setPage(1);
                setSelectedEmploymentTypes((prev) =>
                  prev.includes(type)
                    ? prev.filter((t) => t !== type)
                    : [...prev, type],
                );
              }}
            />
          </aside>
        )}

        <main className="flex-1 flex flex-col p-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden min-h-125 lg:min-h-0">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50/20 custom-scrollbar">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <div
                  key={job._id}
                  onClick={() =>
                    navigate(
                      payload?.role === "employer"
                        ? `/update-job/${job._id}`
                        : `/jobs/${job._id}`,
                    )
                  }
                  className="cursor-pointer"
                >
                  <JobCard
                    job={job}
                    isBookmarked={bookmarks.includes(job._id)}
                    onToggleBookmark={toggleBookmark}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-gray-500 font-medium">
                No jobs found matching your criteria.
              </div>
            )}
          </div>

          <JobPagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => p + 1)}
            disableNext={
              jobs.length < limit || (totalPages > 1 && page === totalPages)
            }
          />
        </main>
      </div>
    </div>
  );
};

export default JobFilterPage;
