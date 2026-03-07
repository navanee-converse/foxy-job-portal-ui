import type { Job } from "./job";

export interface SavedJobItem {
  _id: string;
  userId: string;
  jobId: Job;
  savedAt: string;
  id: string;
}

export interface SavedJobsResponse {
  savedJobs: SavedJobItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
