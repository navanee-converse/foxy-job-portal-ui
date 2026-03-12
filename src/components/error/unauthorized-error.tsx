import { useNavigate } from "react-router-dom";

const UnauthorizedError: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center max-w-lg">
        <h1 className="text-7xl font-bold text-brand-primary mb-4">401</h1>

        <h2 className="text-2xl font-semibold text-content-heading mb-3">
          Unauthorized
        </h2>

        <p className="text-content-body mb-8">
          You must be logged in to access this page.
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

export default UnauthorizedError;
