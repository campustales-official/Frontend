import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, Calendar, Users, Megaphone, User, School } from "lucide-react";
import { useMe } from "../../hooks/useMe";

export default function Sidebar() {
    const location = useLocation();
    const { data: me } = useMe();

    const allLinks = [
        { name: "Feed", icon: LayoutGrid, path: "/" },
        { name: "College", icon: School, path: "/college" },
        { name: "Clubs", icon: Users, path: "/clubs" },
        { name: "Events", icon: Calendar, path: "/events" },
        { name: "Announcements", icon: Megaphone, path: "/announcements" },
    ];

    // Filter links for external users
    const links = allLinks.filter(link => {
        if (me?.roleInCollege === 'external') {
            const restricted = ["College", "Clubs", "Announcements"];
            return !restricted.includes(link.name);
        }
        return true;
    });

    return (
        <>
            {/* Desktop Sidebar (Hover Expand) */}
            <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white z-40 hidden md:flex flex-col transition-all duration-300 w-14 hover:w-56 group overflow-hidden shadow-sm hover:shadow-lg">
                <div className="flex-1 py-4 flex flex-col gap-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;

                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center gap-4 px-3 py-3 mx-2 rounded-lg transition-colors whitespace-nowrap ${isActive
                                    ? "bg-blue-50 text-blue-600 font-medium"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 min-w-[20px] ${isActive ? "text-blue-600" : "text-gray-500"}`} />
                                <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-75">
                                    {link.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </aside>

            {/* Mobile Bottom Tab Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-white h-14 flex items-center justify-around z-50 md:hidden px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;

                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${isActive ? "text-blue-600" : "text-gray-400"
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive && "fill-current"}`} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{link.name}</span>
                        </Link>
                    );
                })}
            </div>
        </>
    );
}
