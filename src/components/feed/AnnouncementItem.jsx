import { GraduationCap } from "lucide-react";

export default function AnnouncementItem({ item }) {
  const { data, college, club, createdAt } = item;

  // Calculate generic "time ago" string
  const timeAgo = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / 60000); // minutes
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition duration-200 border-0 border-l-4 border-l-orange-500 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">
            Announcement
          </span>
          <span className="text-gray-400 text-xs">•</span>
          <span className="text-gray-500 text-sm">{timeAgo(createdAt || new Date().toISOString())}</span>
        </div>

        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
          <GraduationCap className="w-4 h-4" />
          <span className="font-medium text-gray-700">{college?.name}</span>
          {club && (
            <>
              <span>•</span>
              <span>{club.name}</span>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-gray-900 mb-2">{data.title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{data.content || data.description || data.message}</p>

      {/* No "View Full Notice" as requested */}
    </article>
  );
}
