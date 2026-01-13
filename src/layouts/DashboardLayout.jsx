import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

export default function DashboardLayout() {
    return (
        <div className="min-h-screen bg-gray-200 flex flex-col">
            <Navbar />

            <div className="flex flex-1 pt-16">
                <Sidebar />

                {/* Main Content Area */}
                <main className="flex-1 md:pl-16 transition-all duration-300 w-full">
                    <div className="mx-auto w-full max-w-7xl h-full pb-20 md:pb-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
