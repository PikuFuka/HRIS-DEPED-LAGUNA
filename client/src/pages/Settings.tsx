import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth";
import { Skeleton } from "../components/ui/Skeleton";

export default function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 opacity-50" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="md:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/2 opacity-50" />
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-10 w-full max-w-md rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-10 w-full max-w-md rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 md:space-y-8 sm:mt-2">
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
          Settings
        </h2>
        <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
        <div className="md:col-span-1 space-y-1">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <a className="whitespace-nowrap md:whitespace-normal bg-slate-100/80 text-slate-900 border border-slate-200 font-semibold px-4 py-2.5 rounded-lg text-sm cursor-pointer shadow-sm relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-slate-900 rounded-r-full"></div>
              Profile
            </a>
            <a className="whitespace-nowrap md:whitespace-normal text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium px-4 py-2.5 rounded-lg text-sm cursor-pointer transition-colors border border-transparent">
              Notifications
            </a>
            <a className="whitespace-nowrap md:whitespace-normal text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium px-4 py-2.5 rounded-lg text-sm cursor-pointer transition-colors border border-transparent">
              Security
            </a>
          </nav>
        </div>
        <div className="md:col-span-3 space-y-6">
          <div className="glass-card shadow-sm rounded-2xl overflow-hidden border border-slate-200 bg-white">
            <div className="border-b border-slate-100 p-5 md:p-6 bg-white">
              <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
                Profile Information
              </h3>
              <p className="text-sm text-slate-500 font-normal mt-1">
                Update your personal details.
              </p>
            </div>
            <div className="p-5 md:p-6 space-y-6 bg-white">
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-slate-700 block tracking-wider uppercase">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={user?.name || ""}
                  className="w-full max-w-md px-3.5 py-2.5 text-sm font-medium border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 hover:border-slate-300 focus:outline-none shadow-sm transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-slate-700 block tracking-wider uppercase">
                  System Role{" "}
                  <span className="text-slate-400 font-medium">
                    (Read-Only)
                  </span>
                </label>
                <input
                  type="text"
                  defaultValue={(user?.role || "").toUpperCase()}
                  className="w-full max-w-md px-3.5 py-2.5 text-sm font-semibold bg-slate-50/80 text-slate-500 border border-slate-200 rounded-lg shadow-inner"
                  disabled
                />
                <p className="text-[12px] font-medium text-slate-500 mt-1.5">
                  Your role dictates your workflow boundaries and permissions.
                </p>
              </div>
              <button className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-slate-800 hover:shadow transition-all mt-4 inline-block">
                Save Changes
              </button>
            </div>
          </div>

          <div className="glass-card shadow-sm rounded-2xl overflow-hidden border border-slate-200 bg-white">
            <div className="border-b border-slate-100 p-5 md:p-6 flex flex-row items-center justify-between bg-white">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
                  Notification Preferences
                </h3>
                <p className="text-sm text-slate-500 font-normal mt-1">
                  Choose what you want to be notified about.
                </p>
              </div>
            </div>
            <div className="p-5 md:p-6 space-y-6 bg-white">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-900 block">
                    Email Notifications
                  </label>
                  <p className="text-sm text-slate-500 font-normal">
                    Receive an email when you are assigned a new workflow step.
                  </p>
                </div>
                {/* Mock Toggle */}
                <div className="shrink-0 w-11 h-6 bg-slate-900 rounded-full flex items-center p-1 cursor-pointer shadow-inner relative transition-colors">
                  <div className="w-4 h-4 bg-white rounded-full translate-x-5 transition-transform shadow" />
                </div>
              </div>
              <div className="h-px bg-slate-100 w-full"></div>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-900 block">
                    In-App Alerts
                  </label>
                  <p className="text-sm text-slate-500 font-normal">
                    Show a badge when items in your queue are overdue.
                  </p>
                </div>
                <div className="shrink-0 w-11 h-6 bg-slate-200 rounded-full flex items-center p-1 cursor-pointer shadow-inner border border-slate-300 relative transition-colors">
                  <div className="w-4 h-4 bg-white shadow-sm rounded-full transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
