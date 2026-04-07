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
import JobSortControls from "./sort-control";

const JobFilterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const payload = getDecodedToken();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  const [title, setTitle] = useState(searchParams.get("title") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [companyName, setCompanyName] = useState(
    searchParams.get("companyName") || "",
  );
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

  const [sort, setSort] = useState("default");
  const [limit, setLimit] = useState(10);
  const dTitle = useDebounce(title, 800);
  const dCity = useDebounce(city);
  const dMinSalary = useDebounce(minSalary);
  const dMaxSalary = useDebounce(maxSalary);
  const dCompanyName = useDebounce(companyName);

  const isFiltered =
    title !== "" ||
    city !== "" ||
    categoryId !== "" ||
    minSalary !== "" ||
    companyName !== "" ||
    maxSalary !== "" ||
    locationType !== "" ||
    experienceLevel !== "" ||
    selectedEmploymentTypes.length > 0 ||
    sort !== "default" ||
    limit !== 10;

  const handleClearAll = () => {
    setTitle("");
    setCity("");
    setCategoryId("");
    setMinSalary("");
    setMaxSalary("");
    setLocationType("");
    setExperienceLevel("");
    setSelectedEmploymentTypes([]);
    setCompanyName("");
    setSort("default");
    setLimit(10);
    setPage(1);
  };
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
        companyName: dCompanyName.trim() || undefined,
      };

      const validation = JobFilterSchema.safeParse(filterData);
      if (!validation.success) return;

      setIsLoading(true);
      const params = new URLSearchParams();

      Object.entries(filterData).forEach(([key, value]) => {
        if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
        else if (value) params.append(key, value as string);
      });

      if (sort === "newest") {
        params.append("sortBy", "updatedAt");
        params.append("sortOrder", "desc");
      } else if (sort === "oldest") {
        params.append("sortBy", "updatedAt");
        params.append("sortOrder", "asc");
      }

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
    dCompanyName,
    selectedEmploymentTypes,
    categoryId,
    limit,
    sort,
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
    <div className="min-h-screen lg:min-h-screen flex flex-col bg-header-bg pb-5">
      <header className="bg-header-bg shrink-0 w-full py-6 md:py-10 flex flex-col items-center border-b border-gray-100">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Jobs</h1>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8 pb-4 pr-4 lg:overflow-hidden min-h-200">
        {payload?.role !== "employer" && (
          <aside className="w-full lg:w-1/4 shrink-0 overflow-y-visible lg:overflow-y-auto custom-scrollbar">
            <FilterSidebar
              filters={{
                title,
                locationType,
                experienceLevel,
                companyName,
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
                setCompanyName
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

        <main className="flex-1 flex flex-col p-1 overflow-hidden min-h-125 lg:h-200">
          <div className="bg-header-bg">
            <JobSortControls
              sort={sort}
              limit={limit}
              onSortChange={(val) => {
                setSort(val);
                setPage(1);
              }}
              onLimitChange={(val) => {
                setLimit(val);
                setPage(1);
              }}
              onClear={handleClearAll}
              showClear={isFiltered}
            />
          </div>
          <div className="h-162.5 rounded-t-lg border border-gray-200 bg-white p-3 md:p-4 lg:p-6 flex flex-col shadow-sm">
            {" "}
            <div className="p-2 border-t-gray-200 overflow-y-auto space-y-4 custom-scrollbar rounded-xl h-full">
              {" "}
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
                    className="group transition-all"
                  >
                    <JobCard
                      job={job}
                      isBookmarked={bookmarks.includes(job._id)}
                      onToggleBookmark={toggleBookmark}
                    />
                  </div>
                ))
              ) : (
                <div className="bg-white border border-dashed border-gray-300 rounded-xl py-20 text-center text-gray-500">
                  No jobs found matching your criteria.
                </div>
              )}
            </div>
          </div>
          <div className="">
            <JobPagination
              page={page}
              totalPages={totalPages}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => p + 1)}
              disableNext={
                jobs.length < limit || (totalPages > 1 && page === totalPages)
              }
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobFilterPage;
