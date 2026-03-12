import React from "react";
import { AlertCircle } from "lucide-react";

const Error400: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-100 rounded-full scale-150 animate-pulse" />
            <div className="relative bg-white p-6 rounded-full shadow-sm border border-yellow-200">
              <AlertCircle size={64} className="text-yellow-500" />
            </div>
          </div>
        </div>

        <h1 className="text-9xl font-black text-gray-200 mb-2">400</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Bad Request</h2>
        <p className="text-gray-600 mb-8">
          The server couldn't understand the request. This usually happens
          because of a technical glitch or an expired link.
        </p>
      </div>
    </div>
  );
};

export default Error400;
