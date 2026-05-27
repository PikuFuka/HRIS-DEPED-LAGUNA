import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { format } from "date-fns";
import { Skeleton } from "../../components/ui/Skeleton";
import {
  Activity,
  AlertCircle,
  Briefcase,
  FileText,
  FileCheck,
  Loader2,
  TrendingUp,
  Users,
} from "lucide-react";

interface AdminActivityItem {
  id: number;
  description: string;
  created_at: string;
  causer?: {
    name: string;
    email: string;
  } | null;
}

interface SuperAdminDashboardPayload {
  total_users: number;
  total_plantilla_items: number;
  filled_vacancies: number;
  unfilled_vacancies: number;
  pending_workflows: number;
  recent_logins: AdminActivityItem[];
  recent_activities: AdminActivityItem[];
}

export default function SuperAdminDashboard() {
  const [data, setData] = useState<SuperAdminDashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/admin/dashboard", {
      headers: { Accept: "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to load dashboard analytics");
        }

        return response.json();
      })
      .then((payload) => {
        if (!isMounted) return;
        setData(payload);
        setLoading(false);
      })
      .catch((fetchError: unknown) => {
        if (!isMounted) return;
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load dashboard analytics");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-6 h-full flex flex-col fade-in duration-300">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="space-y-2.5">
            <Skeleton className="h-4 w-32 rounded-md opacity-60" />
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-5 w-full max-w-2xl rounded-lg opacity-60" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-10 w-36 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-3 w-20 rounded-sm" />
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
                <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6 flex-1 min-h-0">
          <div className="rounded-[20px] border border-slate-200/80 bg-white p-6 space-y-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between gap-3 mb-4">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-3 w-16 rounded-sm opacity-60" />
            </div>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-20 rounded-xl w-full" />
            ))}
          </div>
          <div className="rounded-[20px] border border-slate-200/80 bg-white p-6 space-y-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between gap-3 mb-4">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-3 w-16 rounded-sm opacity-60" />
            </div>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-20 rounded-xl w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full max-w-7xl mx-auto h-full flex items-center justify-center">
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-6 py-5 text-rose-700 shadow-sm">
          {error || "Unable to load super admin analytics."}
        </div>
      </div>
    );
  }

  const metrics = [
    {
      label: "Total Users",
      value: data.total_users,
      icon: <Users className="w-5 h-5" />,
      tone: "text-[#0038A8]",
      bg: "bg-[#0038A8]/10",
    },
    {
      label: "Total Plantilla Items",
      value: data.total_plantilla_items,
      icon: <Briefcase className="w-5 h-5" />,
      tone: "text-slate-900",
      bg: "bg-slate-100",
    },
    {
      label: "Filled Vacancies",
      value: data.filled_vacancies,
      icon: <FileCheck className="w-5 h-5" />,
      tone: "text-emerald-700",
      bg: "bg-emerald-50",
    },
    {
      label: "Unfilled Vacancies",
      value: data.unfilled_vacancies,
      icon: <AlertCircle className="w-5 h-5" />,
      tone: "text-amber-700",
      bg: "bg-amber-50",
    },
    {
      label: "Pending Workflows",
      value: data.pending_workflows,
      icon: <TrendingUp className="w-5 h-5" />,
      tone: "text-violet-700",
      bg: "bg-violet-50",
    },
  ];

  const renderActivityList = (items: AdminActivityItem[]) => {
    if (items.length === 0) {
      return (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-sm text-slate-500 text-center">
          No activity yet.
        </div>
      );
    }

    return items.map((item) => (
      <div key={item.id} className="rounded-xl border border-slate-100 bg-white px-4 py-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">{item.description}</p>
            <p className="text-xs text-slate-500 mt-1">
              {item.causer?.name || "System"}
              {item.causer?.email ? ` · ${item.causer.email}` : ""}
            </p>
          </div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold whitespace-nowrap">
            {format(new Date(item.created_at), "MMM d, h:mm a")}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-7xl mx-auto space-y-6 h-full flex flex-col"
    >
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
            <Activity className="w-3.5 h-3.5" />
            <span>Super Admin</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            System Analytics
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            Review plantilla coverage, vacancy fill rate, and pending workflow activity across the platform.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/users"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0038A8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#002B80]"
          >
            <Users className="w-4 h-4" /> Manage Users
          </Link>
          <Link
            to="/admin/logs"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <FileText className="w-4 h-4" /> Audit Trail
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  {metric.label}
                </p>
                <p className={`mt-3 text-3xl font-black tracking-tight ${metric.tone}`}>
                  {metric.value}
                </p>
              </div>
              <div className={`rounded-xl p-3 ${metric.bg} ${metric.tone}`}>
                {metric.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <section className="rounded-[20px] border border-slate-200/80 bg-white p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col min-h-0">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-base font-bold text-slate-900">Recent Logins</h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Latest 5
            </span>
          </div>
          <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1">
            {renderActivityList(data.recent_logins)}
          </div>
        </section>

        <section className="rounded-[20px] border border-slate-200/80 bg-white p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col min-h-0">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Latest 5
            </span>
          </div>
          <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1">
            {renderActivityList(data.recent_activities)}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
