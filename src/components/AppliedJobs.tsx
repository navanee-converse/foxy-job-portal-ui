import { useState, useEffect } from "react";
import { request } from "@/services/api";
import {
  Briefcase,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { AppliedJob, PaginatedResponse } from "@/types/applied-jobs";

const AppliedJobs = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AppliedJob[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppliedJobs = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await request<PaginatedResponse>(
        `applications/me?page=${page}&limit=10`,
        "GET"
      );
      if (res) {
        setData(res.data);
        setPagination({
          page: res.page,
          totalPages: res.totalPages,
          total: res.total,
        });
      }
    } catch (err) {
      toast.error("Failed to load your applications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedJobs(1);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "shortlisted":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "viewed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  const handleViewResume = (url: string) => {
    if (url.endsWith(".pdf")) {
      window.open(url, "_blank");
    } else {
      window.open(
        `https://docs.google.com/gview?url=${url}&embedded=true`,
        "_blank"
      );
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <div className="max-w-6xl w-full mx-auto px-4 py-10 grow">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Applied Jobs</h1>
            <p className="text-slate-500 mt-1">
              Track and manage your job applications
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-125 flex flex-col">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center grow py-20">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
              <p className="text-slate-500 animate-pulse">
                Fetching your applications...
              </p>
            </div>
          ) : data.length > 0 ? (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Job Title</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Applied Date</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider text-right">Resume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <div
                            className="flex items-center cursor-pointer gap-3 group"
                            onClick={() => navigate(`/jobs/${app.jobId._id}`)}
                          >
                            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                              <Briefcase className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {app.jobId?.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <Badge className={`capitalize px-3 py-1 font-medium border shadow-none ${getStatusColor(app.status)}`}>
                            {app.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center text-sm text-slate-600 gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleViewResume(app.resumeUrl)}
                          >
                            <FileText className="h-4 w-4 mr-2" /> View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden divide-y divide-slate-100">
                {data.map((app) => (
                  <div key={app._id} className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div 
                        className="flex gap-3" 
                        onClick={() => navigate(`/jobs/${app.jobId._id}`)}
                      >
                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 leading-snug">{app.jobId?.title}</h4>
                          <p className="text-xs text-slate-500 mt-1 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={`capitalize text-[10px] px-2 py-0 border shadow-none ${getStatusColor(app.status)}`}>
                        {app.status}
                      </Badge>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full justify-center text-blue-600 border-blue-100 bg-blue-50/30"
                      onClick={() => handleViewResume(app.resumeUrl)}
                    >
                      <FileText className="h-4 w-4 mr-2" /> View Resume
                    </Button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-centergrow py-20 px-4 text-center">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <Briefcase className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No applications found</h3>
              <p className="text-slate-500 max-w-sm mx-auto mt-2">
                It looks like you haven't applied to any jobs yet. Start your journey by browsing available openings.
              </p>
              <Button
                className="mt-8 bg-blue-600 hover:bg-blue-700 px-8"
                onClick={() => navigate("/jobs")}
              >
                Browse All Jobs
              </Button>
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="mt-auto px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <p className="text-sm text-slate-600 font-medium order-2 sm:order-1">
                Page <span className="text-slate-900">{pagination.page}</span> of{" "}
                <span className="text-slate-900">{pagination.totalPages}</span>
              </p>
              <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                  disabled={pagination.page === 1}
                  onClick={() => fetchAppliedJobs(pagination.page - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => fetchAppliedJobs(pagination.page + 1)}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppliedJobs;