import { Link } from "react-router-dom";
import { useMe } from "../../hooks/useMe";
import { User, Bell } from "lucide-react";

export default function Navbar() {
    const { data: me } = useMe();

    return (
        <nav className="h-16 bg-white shadow-sm flex items-center justify-between px-4 fixed top-0 w-full z-50">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10v6" /><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12Z" /><path d="M6 15v-6" /></svg>
                </div>
                <span className="font-bold text-xl text-gray-900 block">Inter-College Hub</span>
            </Link>

            {/* Right: Profile & Notifications */}
            <div className="flex items-center gap-6">

                <Link to="/profile" className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-gray-900 leading-none">{me?.name || "User"}</p>
                        <p className="text-xs text-gray-500 mt-1">{me?.college?.name || "College User"}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 text-blue-700 font-bold overflow-hidden">
                        {me?.avatarUrl ? (
                            <img src={me.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-5 h-5" />
                        )}
                    </div>
                </Link>
            </div>
        </nav>
    );
}
