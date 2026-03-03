import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { request } from "@/services/api";
import {
  Loader2,
  FileText,
  Mail,
  ExternalLink,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import type {
  ApplicationDetailResponse as Application,
  Status,
} from "@/types/application";
import type { PaginationMeta } from "@/types/pagination";

const JobApplications = () => {
  const params = useParams<{ jobId: string }>();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      if (!params.jobId) return;
      setIsLoading(true);

      try {
        const res = await request<{
          applications: Application[];
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        }>(
          `applications/job/${params.jobId}?page=${currentPage}&limit=10`,
          "GET",
        );

        if (res && res.applications) {
          setApplications(res.applications);
          setMeta({
            total: res.total,
            page: res.page,
            limit: res.limit,
            totalPages: res.totalPages,
          });
        } else {
          setApplications([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load applications");
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [params.jobId, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (meta && newPage >= 1 && newPage <= meta.totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getStatusStyles = (status: Status) => {
    switch (status) {
      case "shortlisted":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-100";
      case "viewed":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "scheduled":
        return "bg-purple-50 text-purple-700 border-purple-100";
      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  if (isLoading && applications.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Job Applications</h1>
        <p className="text-slate-500 mt-2">
          Reviewing {meta?.total || 0} candidates for this position
        </p>
      </header>

      {applications.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-20 text-center">
          <p className="text-slate-400 font-medium">
            No candidates have applied yet.
          </p>
        </div>
      ) : (
        <>
          <div
            className={`space-y-4 ${isLoading ? "opacity-50" : ""} transition-opacity`}
          >
            {applications.map((app) => (
              <div
                key={app._id}
                className="group flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-blue-600 font-bold border border-slate-100 shadow-sm">
                    {app.candidateId.name?.charAt(0) ||
                      app.candidateId.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-slate-900 truncate max-w-62.5">
                      {app.candidateId.name ||
                        app.candidateId.email.split("@")[0]}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate max-w-50">
                        {app.candidateId.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2">
                  <Badge
                    variant="outline"
                    className={`capitalize px-3 py-1 font-medium ${getStatusStyles(app.status)}`}
                  >
                    {app.status}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="h-3 w-3" />
                    {new Date(app.appliedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 md:flex-none border-slate-200 hover:bg-slate-50"
                    onClick={() => {
                      if (app.resumeUrl.endsWith(".pdf")) {
                        window.open(app.resumeUrl, "_blank");
                      } else {
                        window.open(
                          `https://docs.google.com/gview?url=${app.resumeUrl}&embedded=true`,
                          "_blank",
                        );
                      }
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4 text-blue-600" />
                    Resume
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 md:flex-none bg-brand-primary hover:bg-brand-btn-hover"
                    onClick={() =>
                      navigate(`/jobs/${params.jobId}/applications/${app._id}`)
                    }
                  >
                    View Details
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="rounded-lg"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2 mx-2">
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isLoading}
                      className={`w-9 h-9 rounded-lg transition-all ${
                        currentPage === pageNum
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  ),
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === meta.totalPages || isLoading}
                className="rounded-lg"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobApplications;
