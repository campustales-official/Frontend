import { Landmark, Users, Clock, AlertTriangle } from "lucide-react";
import ActionMenu from "../common/ActionMenu";

export default function AnnouncementItem({ item, actions }) {
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

  const isCritical = data.priority === 'critical';
  const isClub = !!club;

  let entityName, entitySubtext, Icon, iconBgClass;

  if (isCritical) {
    entityName = "CampusTales";
    entitySubtext = "System Announcement";
    Icon = AlertTriangle;
    iconBgClass = "bg-red-50 border-red-100 text-red-600";
  } else if (isClub) {
    entityName = club.name;
    entitySubtext = college?.name;
    Icon = Users;
    iconBgClass = "bg-purple-50 border-purple-100 text-purple-600";
  } else {
    // College Announcement
    entityName = college?.name || "College Administration";
    entitySubtext = "Administrative Dept.";
    Icon = Landmark;
    iconBgClass = "bg-slate-50 border-slate-100 text-slate-600";
  }

  return (
    <article className={`rounded-xl bg-white shadow-sm hover:shadow-md transition duration-200 border-0 border-l-4 p-5 relative group ${isCritical ? 'border-l-red-500' : 'border-l-orange-500'
      }`}>
      {/* Admin Actions (Top Right) */}
      {actions && (
        <div className="absolute top-3 right-3">
          <ActionMenu
            onDelete={actions.onDelete}
            canDeleteOnly={true} // Announcements only delete
          />
        </div>
      )}

      {/* Entity Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${iconBgClass}`}>
          <Icon className="w-5 h-5" />
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
