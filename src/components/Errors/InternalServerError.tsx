import { useNavigate } from "react-router-dom";

const InternalServerError: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center max-w-lg">
        <h1 className="text-7xl font-bold text-red-500 mb-4">500</h1>

        <h2 className="text-2xl font-semibold text-content-heading mb-3">
          Internal Server Error
        </h2>

        <p className="text-content-body mb-8">
          Something went wrong on our side. Please try again later.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-lg bg-brand-primary text-white hover:bg-brand-hover transition"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default InternalServerError;
