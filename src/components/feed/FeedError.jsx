import { AlertCircle, RefreshCw } from "lucide-react";

export default function FeedError({ onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl shadow-sm border border-red-100 max-w-lg mx-auto mt-10">
            <div className="p-3 bg-red-50 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">
                Feed Unavailable
            </h3>

            <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                We ran into a problem loading the latest posts. Please check your connection and try again.
            </p>

            <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2.5 rounded-lg transition active:scale-95"
            >
                <RefreshCw className="w-4 h-4" />
                Retry Feed
            </button>
        </div>
    );
}
