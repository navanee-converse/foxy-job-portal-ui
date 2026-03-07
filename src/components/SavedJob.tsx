import React, { useEffect, useState } from "react";
import { request } from "../services/api";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JobCard from "@/components/JobCard";
import toast from "react-hot-toast";
import { FiBookmark } from "react-icons/fi";
import type { SavedJobItem, SavedJobsResponse } from "@/types/saved-jobs";

const SavedJobs: React.FC = () => {
  const [savedItems, setSavedItems] = useState<SavedJobItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });
  const navigate = useNavigate();

  const fetchSavedJobs = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await request<SavedJobsResponse>(
        `/users/me/saved-jobs?page=${page}&limit=10`,
        "GET"
      );

      if (response && response.savedJobs) {
        setSavedItems(response.savedJobs);
        setPagination({
          page: response.page || page,
          totalPages: response.totalPages || 1,
        });
      } else {
        setSavedItems([]);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load saved jobs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleBookmark = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    try {
      // Keep your local storage logic if needed
      const saved: string[] = JSON.parse(localStorage.getItem("bookmarked_jobs") || "[]");
      const updated = saved.filter((id) => id !== jobId);
      localStorage.setItem("bookmarked_jobs", JSON.stringify(updated));

      await request(`/users/me/saved-jobs`, "POST", { jobId });

      setSavedItems((prev) => prev.filter((item) => item.jobId._id !== jobId));
      toast.success("Job removed from saved");
    } catch (error) {
      toast.error("Could not update bookmark");
    }
  };

  useEffect(() => {
    fetchSavedJobs(1);
  }, []);

  return (
    // Added overflow-x-hidden to the wrapper to prevent horizontal scroll
    <div className="bg-slate-50 min-h-screen flex flex-col w-full overflow-x-hidden">
      {/* - Changed max-w-5xl to max-w-4xl for a tighter look on large screens 
         - Added w-full to ensure it fills small screens
      */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10 grow">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Saved Jobs
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Review the positions you've bookmarked.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 md:py-20 bg-white rounded-xl border border-slate-200">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-sm text-slate-500 animate-pulse">Loading bookmarks...</p>
          </div>
        ) : savedItems.length === 0 ? (
          <div className="bg-white rounded-xl p-8 md:p-16 text-center border border-dashed border-slate-300">
            <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBookmark className="text-slate-300" size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No saved jobs yet</h3>
            <button
              onClick={() => navigate("/jobs")}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {/* Ensured the grid doesn't force a width. 
                Using space-y instead of grid gap can be safer for overflow. 
            */}
            {savedItems.map((item) => {
              const safeJob = {
                ...item.jobId,
                jobTags: item.jobId?.jobTags || [],
                companyId: item.jobId?.companyId || { name: "Company", logo: "" },
              };

              return (
                <div key={item._id} className="w-full">
                  <JobCard
                    job={safeJob}
                    isBookmarked={true}
                    onToggleBookmark={handleToggleBookmark}
                  />
                </div>
              );
            })}

            {/* Pagination: Fully responsive wrapper */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-10 py-4 border-t border-slate-200 gap-4">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => fetchSavedJobs(pagination.page - 1)}
                  className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </button>

                <span className="text-sm text-slate-500 order-first sm:order-0">
                  Page <span className="font-semibold text-slate-900">{pagination.page}</span> of {pagination.totalPages}
                </span>

                <button
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => fetchSavedJobs(pagination.page + 1)}
                  className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;