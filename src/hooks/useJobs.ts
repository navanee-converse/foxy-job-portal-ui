import { useState, useCallback, useEffect } from "react";
import { request } from "../services/api";
import { JobFilterSchema } from "@/validations/job-filter";
import useDebounce from "@/hooks/useDebounce";
import type { Job } from "@/types/job";

export const useJobs = (initialFilters: any, limit: number) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  const debouncedTitle = useDebounce(initialFilters.title);
  const debouncedCity = useDebounce(initialFilters.city);
  const debouncedMinSalary = useDebounce(initialFilters.minSalary);
  const debouncedMaxSalary = useDebounce(initialFilters.maxSalary);

  const fetchJobs = useCallback(async () => {
    try {
      const filterData = {
        ...initialFilters,
        title: debouncedTitle?.trim() || undefined,
        city: debouncedCity?.trim() || undefined,
        minSalary: debouncedMinSalary?.trim() || undefined,
        maxSalary: debouncedMaxSalary?.trim() || undefined,
      };

      const validation = JobFilterSchema.safeParse(filterData);
      if (!validation.success) return;

      setIsLoading(true);
      const params = new URLSearchParams();

      // Append valid filters
      Object.entries(filterData).forEach(([key, value]) => {
        if (value === undefined) return;
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.append(key, String(value));
        }
      });
      console.log('triggered');
      

      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const response = await request(`/jobs?${params.toString()}`, "GET");
      setJobs(response?.data || response || []);
      setTotalJobs(response?.total || response?.length || 0);
    } catch (error) {
      console.error("Failed to load jobs", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    debouncedTitle,
    debouncedCity,
    debouncedMinSalary,
    debouncedMaxSalary,
    // DO NOT use initialFilters here if it's an object
    initialFilters.location,
    initialFilters.experienceLevel,
    JSON.stringify(initialFilters.employmentType), // Stringify arrays to keep depth check simple
    limit,
  ]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { jobs, isLoading, page, setPage, totalJobs, setJobs };
};
