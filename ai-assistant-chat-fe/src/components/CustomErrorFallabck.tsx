import React from "react";
import { useError } from "../contexts/ErrorContext";

export const CustomErrorFallback: React.FC<{ error?: Error }> = ({ error }) => {
  const { error: contextError } = useError();
  const displayError = error || contextError;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-red-600 mb-4">Oops!</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        {displayError?.message || "We're sorry, but something went wrong."}
      </p>
      {displayError && (
        <div className="max-w-md p-4 mb-6 bg-gray-200 dark:bg-gray-800 rounded">
          <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
            {displayError.stack}
          </pre>
        </div>
      )}
      <button
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  );
};
