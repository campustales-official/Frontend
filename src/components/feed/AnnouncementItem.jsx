import { Landmark, Users, Clock } from "lucide-react";

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

  const isClub = !!club;
  const entityName = isClub ? club.name : college?.name;
  const entitySubtext = isClub ? `${college?.name}` : "Administration Dept.";

  return (
    <article className="rounded-xl bg-white shadow-sm hover:shadow-md transition duration-200 border-0 border-l-4 border-l-orange-500 p-5">
      {/* Entity Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${isClub ? "bg-purple-50 border-purple-100 text-purple-600" : "bg-slate-50 border-slate-100 text-slate-600"
          }`}>
          {isClub ? <Users className="w-5 h-5" /> : <Landmark className="w-5 h-5" />}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-gray-900 leading-tight">{entityName}</h4>
          <div className="flex items-center justify-between mt-0.5">
            <p className="text-xs text-gray-500 font-medium">{entitySubtext}</p>
            <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
              <Clock className="w-3.5 h-3.5" />
              {timeAgo(createdAt || new Date().toISOString())}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-gray-900 leading-tight">{data.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{data.content || data.description || data.message}</p>
      </div>
    </article>
  );
}
