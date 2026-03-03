import React, { useEffect, useState } from "react";
import { request } from "../services/api";
import { Calendar, MapPin, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Job {
  _id: string;
  title: string;
  companyName: string;
  location: string;
  createdAt: string;
}

const SavedJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const navigate = useNavigate();

  const fetchSavedJobs = async (page: number = 1) => {
    setIsLoading(true);
    try {
      // Assuming your backend has this endpoint
      const response = await request(`/jobs/saved?page=${page}`, "GET");
      setJobs(response.jobs);
      setPagination({
        page: response.currentPage,
        totalPages: response.totalPages,
      });
    } catch (error) {
      console.error("Failed to fetch saved jobs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (jobId: string) => {
    try {
      await request(`/jobs/save/${jobId}`, "DELETE");
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (error) {
      console.error("Failed to remove job");
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  if (isLoading)
    return <div className="p-10 text-center">Loading saved jobs...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-content-heading">
        Saved Jobs
      </h1>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center border border-dashed border-gray-300">
          <p className="text-gray-500">You haven't saved any jobs yet.</p>
          <button
            onClick={() => navigate("/jobs")}
            className="mt-4 text-brand-primary font-bold hover:underline"
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center"
            >
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/jobs/${job._id}`)}
              >
                <h3 className="font-bold text-lg text-content-heading">
                  {job.title}
                </h3>
                <p className="text-brand-primary font-medium">
                  {job.companyName}
                </p>

                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> Saved on{" "}
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleRemove(job._id)}
                className="p-3 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Remove from saved"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Basic Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <button
            disabled={pagination.page === 1}
            onClick={() => fetchSavedJobs(pagination.page - 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Prev
          </button>
          <span className="py-2 px-4">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            disabled={pagination.page === pagination.totalPages}
            onClick={() => fetchSavedJobs(pagination.page + 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
