import { useState, useEffect } from "react";
import { request } from "../services/api";
import toast from "react-hot-toast";
import type { Job } from "@/types/job";

export const useBookmarks = (jobs: Job[]) => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarked_jobs") || "[]");
    const apiSaved = jobs.filter((job) => job.isSaved).map((job) => job._id);
    setBookmarks(Array.from(new Set([...saved, ...apiSaved])));
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
      setBookmarks(JSON.parse(localStorage.getItem("bookmarked_jobs") || "[]"));
      toast.error("Failed to sync bookmark.");
    }
  };

  return { bookmarks, toggleBookmark };
};
