export default function FeedSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border p-5 animate-pulse">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200" />
                            <div className="space-y-2">
                                <div className="w-32 h-3.5 bg-gray-200 rounded" />
                                <div className="w-24 h-2.5 bg-gray-200 rounded" />
                            </div>
                        </div>
                        <div className="w-12 h-6 bg-gray-200 rounded-full" />
                    </div>

                    {/* Content */}
                    <div className="space-y-3 mb-4">
                        <div className="w-full h-3 bg-gray-200 rounded" />
                        <div className="w-3/4 h-3 bg-gray-200 rounded" />
                        <div className="w-full h-3 bg-gray-200 rounded" />
                    </div>

                    {/* Image */}
                    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />

                    {/* Footer */}
                    <div className="w-24 h-4 bg-gray-200 rounded" />
                </div>
            ))}
        </div>
    );
}
