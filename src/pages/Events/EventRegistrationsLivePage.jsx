import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
    ArrowLeft, Download, RefreshCcw, Loader2,
    Table as TableIcon, LayoutList, FileSpreadsheet, ExternalLink
} from "lucide-react";
import { useMe } from "../../hooks/useMe";
import { getEventDetails, getRegistrationTable, downloadRegistrationsExcel } from "../../api/events.api";
import { useState } from "react";

export default function EventRegistrationsLivePage() {
    const navigate = useNavigate();
    const { eventId } = useParams();
    const queryClient = useQueryClient();
    const { data: me } = useMe();
    const collegeId = me?.college?.id;
    const [isExporting, setIsExporting] = useState(false);

    // Fetch Event Details to get clubId for API path
    const { data: event, isLoading: eventLoading } = useQuery({
        queryKey: ["event", eventId],
        queryFn: () => getEventDetails(eventId),
        enabled: !!eventId
    });

    const clubId = event?.club?._id || event?.club?.id || null;

    // Live Table Data
    const { data: tableData, isLoading: tableLoading, isError: tableError } = useQuery({
        queryKey: ["registrations-table", eventId],
        queryFn: () => getRegistrationTable({ collegeId, clubId, eventId }),
        enabled: !!eventId && !!collegeId && !!event,
        refetchOnWindowFocus: true,
    });

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ["registrations-table", eventId] });
        toast.info("Updating live entry data...");
    };

    const handleExport = async () => {
        if (isExporting) return;
        setIsExporting(true);
        const loadingToast = toast.loading("Preparing Excel file...");
        try {
            const data = await downloadRegistrationsExcel({ collegeId, clubId, eventId });
            const blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `registrations-${event?.title || 'event'}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);
            toast.update(loadingToast, { render: "Excel downloaded successfully!", type: "success", isLoading: false, autoClose: 3000 });
        } catch (err) {
            toast.update(loadingToast, { render: "Export failed. Please try again.", type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setIsExporting(false);
        }
    };

    if (eventLoading || tableLoading) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Live Registry...</p>
            </div>
        );
    }

    if (tableError || !tableData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <LayoutList className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Failed to load registry</h2>
                    <p className="text-gray-500 mb-8">We couldn't fetch the live registration table for this event.</p>
                    <button onClick={() => navigate(-1)} className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col h-screen overflow-hidden">
            {/* Minimal Header */}
            <div className="bg-white border-b flex-shrink-0">
                <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="min-w-0">
                            <h1 className="text-sm font-black text-gray-900 leading-none truncate">Live Responses: {event?.title}</h1>
                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Real-time Data Grid</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleRefresh}
                            className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-all border border-gray-200 shadow-sm"
                            title="Refresh Data"
                        >
                            <RefreshCcw className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-500/20"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            {isExporting ? 'Exporting...' : 'Export Excel'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Live Counter Info */}
            <div className="bg-blue-600 px-6 py-2 flex items-center justify-center gap-4 flex-shrink-0">
                <p className="text-[10px] font-black text-white/80 uppercase tracking-widest flex items-center gap-2">
                    <RefreshCcw className="w-3 h-3 animate-spin" /> Live Sync Active
                </p>
                <div className="h-4 w-px bg-white/20"></div>
                <p className="text-[10px] font-black text-white uppercase tracking-widest">
                    Total Rows: {tableData.rows?.length || 0}
                </p>
            </div>

            {/* Data Grid Section */}
            <div className="flex-1 overflow-auto bg-gray-200">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden border-r border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200 border-collapse bg-white">
                            <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                                    </th>
                                    {tableData.columns.map((col) => (
                                        <th
                                            key={col.key}
                                            className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest border-r border-gray-200/50 whitespace-nowrap bg-gray-50"
                                        >
                                            {col.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {tableData.rows.map((row, i) => (
                                    <tr
                                        key={i}
                                        className="hover:bg-blue-50/50 transition-colors group cursor-default"
                                    >
                                        <td className="px-4 py-4 text-[10px] font-black text-gray-300 text-center border-r border-gray-100">
                                            {i + 1}
                                        </td>
                                        {tableData.columns.map((col) => {
                                            const value = row[col.key];
                                            const isUrl = typeof value === 'string' && value.startsWith('http');

                                            return (
                                                <td
                                                    key={col.key}
                                                    className="px-6 py-4 text-sm font-bold text-gray-700 border-r border-gray-100/50 whitespace-nowrap max-w-[300px] truncate"
                                                    title={String(value ?? "")}
                                                >
                                                    {isUrl ? (
                                                        <a
                                                            href={value}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1.5 underline underline-offset-4 decoration-2 decoration-blue-200"
                                                        >
                                                            View File <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    ) : (
                                                        String(value ?? "")
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Footer / Hint */}
            <div className="bg-white border-t px-6 py-3 flex items-center justify-between flex-shrink-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    Tip: Scroll horizontally to view all fields. Data updates when you switch tabs or click refresh.
                </p>
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2 text-[10px] font-black text-green-600 uppercase">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        Connected
                    </span>
                </div>
            </div>
        </div>
    );
}
