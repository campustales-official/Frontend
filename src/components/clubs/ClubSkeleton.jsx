export default function ClubSkeleton() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden animate-pulse">
            {/* Cover Image */}
            <div className="h-32 bg-gray-200"></div>

            {/* Content Container */}
            <div className="px-5 pb-5 flex-1 flex flex-col relative">

                {/* Logo Area */}
                <div className="-mt-8 mb-3 flex justify-between items-end">
                    <div className="w-16 h-16 rounded-full bg-gray-300 border-4 border-white"></div>
                    {/* Badge */}
                    <div className="w-16 h-5 bg-gray-200 rounded-md"></div>
                </div>

                {/* Title & Category */}
                <div className="mb-4 space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>

                {/* Description */}
                <div className="space-y-2 mb-6 flex-1">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );
}
