import { Timer, Home } from "lucide-react";
const TooManyRequestError = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-10">
        <div className="relative flex justify-center mb-6">
          <div className="absolute inset-0 scale-150  animate-pulse" />
          <Timer size={80} className="text-blue-600 relative z-10" />
        </div>

        <h1 className="text-6xl font-black text-gray-900 mb-2">429</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Slow down, speed racer!
        </h2>

        <p className="text-gray-600 mb-8 leading-relaxed">
          You've sent too many requests in a short period. Our servers need a
          quick breather to keep things running smoothly for everyone.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            <Home size={18} />
            Back to Homepage
          </a>
        </div>

        <p className="mt-8 text-sm text-gray-400">
          Please wait about 1 minute before refreshing.
        </p>
      </div>
    </div>
  );
};

export default TooManyRequestError;
