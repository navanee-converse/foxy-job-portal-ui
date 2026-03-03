export interface AppliedJob {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    companyId: { name: string } | null;
  };
  status: string;
  appliedAt: string;
  resumeUrl: string;
}

export interface PaginatedResponse {
  data: AppliedJob[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
