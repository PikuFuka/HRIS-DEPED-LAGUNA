import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../lib/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { Skeleton, CardSkeleton, ApplicationSkeleton, TableSkeleton, StatsSkeleton } from "../components/ui/Skeleton";
import { 
  Clock,
  Plus,
  FileText,
  Briefcase,
  FileCheck,
  Users,
  ScrollText,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileSearch,
  ArrowRight,
  ChevronRight,
  Check,
  Activity,
  CheckCircle,
  BarChart3,
  Layers,
  Zap,
  Building2,
  Info,
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Cell,
  AreaChart,
  Area
} from "recharts";
import { WORKFLOW_STEPS, getStepByNumber } from "../lib/constants";
import { VacancyDetailsModal } from "../components/VacancyDetailsModal";
import Reports from "./Reports";

interface Application {
  id: number;
  applicantId: number;
  applicantName: string;
  vacancyId: number;
  position: string;
  status: string;
  step: number;
  submittedAt: string;
  vacancy?: any;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeAppId, setActiveAppId] = useState<number | null>(null);
  const [selectedVacancy, setSelectedVacancy] = useState<any>(null);

  useEffect(() => {
    if (user?.role === "Super Admin") {
      setApplications([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch("/api/applications")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        // Artificial delay for training/demo purposes to show skeletons
        await new Promise(resolve => setTimeout(resolve, 1000));
        return res.json();
      })
      .then((data) => {
        setApplications(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  // Filter tasks based on role
  // If user is 'applicant', show their applications
  const myApplications = applications.filter(
    (app) => app.applicantId === user?.id,
  );

  // If user is staff, show pending tasks matching their role assigned step
  const pendingTasks = applications.filter((app) => {
    if (user?.role === "applicant") return false; // Handled by myApplications

    const p = window.location.pathname;
    const isMasterlist = p.includes("/applications");

    // Get the workflow step logic
    const stepDef = getStepByNumber(app.step);

    if (isMasterlist) {
      // HRMO/Admin sees all applications on the /applications tab
      if (user?.role !== "hrmo" && user?.role !== "records") return false;
      if (app.step < 3) return false;
    } else {
      // On Dashboard Overview, HRMO sees everything pending
      if (location.pathname === "/" && user?.role === "hrmo") return app.step > 3 && app.step < 16;

      // Otherwise, filter by role
      if (stepDef?.role !== user?.role) return false;

      if (p.includes("/screening") && app.step !== 5) return false;
      if (p.includes("/evaluations") && (app.step < 6 || app.step > 7))
        return false;
      if (p.includes("/deliberations") && (app.step < 8 || app.step > 10))
        return false;
      if (p.includes("/verification") && app.step !== 4) return false;
      if (p.includes("/approvals") && app.step !== 11) return false;
      if (p.includes("/csc-submissions") && app.step !== 15) return false;
      if (
        p.includes("/appointments") &&
        (app.step < 12 || app.step > 16 || app.step === 15)
      )
        return false;
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        app.applicantName.toLowerCase().includes(q) ||
        app.position.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const isMasterlist =
    window.location.pathname.includes("/applications") && user?.role === "hrmo";

  const isOverview = location.pathname === "/";

  const dashboardTitle = isMasterlist 
    ? "Workflow Tracker" 
    : isOverview 
      ? user?.role === "Supervisor"
        ? "District Management Overview"
        : user?.role === "Principal"
          ? "School Personnel Dashboard"
          : "HR Management Dashboard" 
      : "Active Task Queue";

  // Data for the Funnel Chart
  const funnelData = [
    { name: 'Submission', count: applications.filter(a => a.step <= 3).length, color: '#94a3b8' },
    { name: 'Verification', count: applications.filter(a => a.step === 4).length, color: '#3b82f6' },
    { name: 'Screening', count: applications.filter(a => a.step === 5).length, color: '#6366f1' },
    { name: 'Evaluation', count: applications.filter(a => a.step >= 6 && a.step <= 7).length, color: '#8b5cf6' },
    { name: 'Deliberation', count: applications.filter(a => a.step >= 8 && a.step <= 10).length, color: '#a855f7' },
    { name: 'Appointment', count: applications.filter(a => a.step >= 11 && a.step <= 14).length, color: '#d946ef' },
    { name: 'Appointed', count: applications.filter(a => a.step === 15).length, color: '#10b981' },
  ];

  if (user?.role === "Super Admin") {
    return <Reports />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 h-full flex flex-col">
      <VacancyDetailsModal 
        vacancy={selectedVacancy}
        onClose={() => setSelectedVacancy(null)}
        userRole={user?.role}
      />

      {loading ? (
        <div className="flex flex-col gap-6 shrink-0 sm:mt-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Skeleton className="h-9 w-64 rounded-xl shadow-sm" />
            <Skeleton className="h-11 w-40 rounded-xl shadow-sm" />
          </div>
          <StatsSkeleton />
          <div className="flex-1 min-h-[400px]">
            <TableSkeleton rows={6} cols={5} />
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="contents"
        >
          {user?.role !== "applicant" ? (
        <>
          <div className="flex flex-col gap-6 shrink-0 sm:mt-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                  {dashboardTitle}
                </h2>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 rounded-full border border-green-100/50">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Live</span>
                </div>
              </div>
              {user?.role === "hrmo" && (
                <button 
                  onClick={() => navigate("/vacancies", { state: { openCreateModal: true } })}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#0038A8] text-white hover:bg-[#002B80] rounded-xl text-sm font-bold shadow-sm hover:shadow-[#0038A8]/20 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create Vacancy
                </button>
              )}
            </div>

            {!isMasterlist &&
              (user?.role === "hrmo" ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <StatsCard
                    title="Personnel Records Pending"
                    value={applications
                      .filter(
                        (a) =>
                          a.step >= 4 &&
                          getStepByNumber(a.step)?.role === "records",
                      )
                      .length.toString()}
                    icon={<FileCheck className="w-4 h-4 text-slate-500" />}
                  />
                  <StatsCard
                    title="ADAS Pending"
                    value={applications
                      .filter(
                        (a) =>
                          a.step >= 4 &&
                          getStepByNumber(a.step)?.role === "adas",
                      )
                      .length.toString()}
                    icon={<Users className="w-4 h-4 text-slate-500" />}
                  />
                  <StatsCard
                    title="HRMPSB Pending"
                    value={applications
                      .filter(
                        (a) =>
                          a.step >= 4 &&
                          getStepByNumber(a.step)?.role === "hrmpsb",
                      )
                      .length.toString()}
                    icon={<Users className="w-4 h-4 text-slate-500" />}
                  />
                  <StatsCard
                    title="Superintendent Pending"
                    value={applications
                      .filter(
                        (a) =>
                          a.step >= 4 &&
                          getStepByNumber(a.step)?.role === "Superintendent",
                      )
                      .length.toString()}
                    icon={<CheckCircle2 className="w-4 h-4 text-slate-500" />}
                  />
                  <StatsCard
                    title="CSC Pending"
                    value={applications
                      .filter(
                        (a) =>
                          a.step >= 4 &&
                          getStepByNumber(a.step)?.role === "csc",
                      )
                      .length.toString()}
                    icon={<ScrollText className="w-4 h-4 text-slate-500" />}
                  />
                  <StatsCard
                    title="HRMO Pending"
                    value={applications
                      .filter(
                        (a) =>
                          a.step >= 4 &&
                          getStepByNumber(a.step)?.role === "hrmo",
                      )
                      .length.toString()}
                    icon={<Briefcase className="w-4 h-4 text-slate-500" />}
                  />
                </div>
              ) : user?.role === "Supervisor" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard
                    icon={<Building2 className="w-5 h-5 text-blue-500" />}
                    title="Managed Schools"
                    value="12"
                    active
                  />
                  <StatsCard
                    icon={<Users className="w-5 h-5 text-slate-400" />}
                    title="Total Personnel"
                    value="245"
                  />
                  <StatsCard
                    icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
                    title="Active Hires"
                    value="8"
                  />
                  <StatsCard
                    icon={<AlertCircle className="w-5 h-5 text-amber-500" />}
                    title="Open Vacancies"
                    value="15"
                  />
                </div>
              ) : user?.role === "Principal" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard
                    icon={<Users className="w-5 h-5 text-blue-500" />}
                    title="School Faculty"
                    value="42"
                    active
                  />
                  <StatsCard
                    icon={<Briefcase className="w-5 h-5 text-slate-400" />}
                    title="Vacancies"
                    value="3"
                  />
                  <StatsCard
                    icon={<FileCheck className="w-5 h-5 text-emerald-500" />}
                    title="Applicant Pool"
                    value="12"
                  />
                  <StatsCard
                    icon={<Activity className="w-5 h-5 text-amber-500" />}
                    title="Retirements Due"
                    value="2"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard
                    icon={<Briefcase className="w-5 h-5 text-slate-400" />}
                    title="Open Plantilla Items"
                    value="0"
                    active
                  />
                  <StatsCard
                    icon={<FileCheck className="w-5 h-5 text-slate-500" />}
                    title="Pending Validation"
                    value={applications
                      .filter((a) => a.step === 4)
                      .length.toString()}
                    color="text-slate-800"
                  />
                  <StatsCard
                    icon={<Users className="w-5 h-5 text-slate-500" />}
                    title="HRMPSB Deliberation"
                    value={applications
                      .filter((a) => a.step > 4 && a.step < 11)
                      .length.toString()}
                    color="text-slate-800"
                  />
                  <StatsCard
                    icon={<ScrollText className="w-5 h-5 text-slate-500" />}
                    title="CSC Submissions"
                    value={applications
                      .filter((a) => a.step === 15)
                      .length.toString()}
                    color="text-slate-800"
                  />
                </div>
              ))}
          </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 min-h-0 mt-4">
              {(user?.role !== "Supervisor" && user?.role !== "Principal") ? (
                <div className="xl:col-span-12 flex flex-col overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow min-h-0">
                  <div className="p-6 md:p-10 border-b border-slate-100/80 flex flex-col items-center justify-center bg-transparent relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-50/20 to-transparent -z-10"></div>
                    <div className="w-full max-w-3xl relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <FileSearch className="w-5 h-5" />
                        <div className="w-px h-4 bg-slate-200 group-focus-within:bg-indigo-200 transition-colors"></div>
                      </div>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={isMasterlist ? "Search across all applications, names, or positions..." : "Search urgent tasks, pending reviews, or personnel..."}
                        className="w-full pl-16 pr-6 py-4 bg-white/60 border border-slate-200/80 rounded-[20px] text-base font-medium shadow-sm focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-900/5 transition-all placeholder:text-slate-400 text-slate-900 focus:bg-white"
                      />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                        {pendingTasks.length > 0 && (
                          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                            <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                            {pendingTasks.length} {isMasterlist ? "Live" : "Active"}
                          </div>
                        )}
                        <span className="hidden sm:inline-block px-2 py-1 bg-slate-50 text-slate-300 rounded-lg text-[9px] font-black border border-slate-100">ESC</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto bg-transparent custom-scrollbar">
                    <div className="min-w-[800px]">
                      <table className="w-full text-left text-sm border-separate border-spacing-0">
                        <thead className="bg-slate-50/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200/80">
                          <tr className="text-slate-500 font-bold text-[11px] uppercase tracking-wider border-b border-slate-200/80">
                            <th className="px-5 py-4">Applicant Name</th>
                            <th className="px-5 py-4">Position Applied</th>
                            <th className="px-5 py-4">
                              {isMasterlist ? "Current Status" : "Required Action"}
                            </th>
                            <th className="px-5 py-4">
                              {isMasterlist ? "Date Submitted" : "Time in Queue"}
                            </th>
                            <th className="px-5 py-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/80">
                          {pendingTasks.length === 0 ? (
                            <tr>
                              <td
                                colSpan={5}
                                className="py-24 px-6"
                              >
                                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center py-8">
                                    <div className="w-16 h-16 rounded-full bg-slate-50/50 border border-slate-100 flex items-center justify-center mb-5">
                                      <FileCheck className="w-8 h-8 text-slate-300" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-2">
                                      {isMasterlist
                                        ? "No Applications Found"
                                        : "Queue is Clear"}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                      {isMasterlist
                                        ? "There are currently no applications matching your criteria."
                                        : "You're all caught up! There are no pending tasks requiring your attention."}
                                    </p>
                                  </div>
                              </td>
                            </tr>
                          ) : (
                            pendingTasks.map((task, index) => {
                              const stepDef = getStepByNumber(task.step);
                              return (
                                <tr
                                  key={task.id}
                                  className="hover:bg-blue-50/30 transition-colors cursor-pointer bg-white/40 group border-b border-slate-100/80 last:border-0"
                                  onClick={() => navigate(`/applications/${task.id}`)}
                                >
                                  <td className="px-5 py-4 font-bold text-slate-900 text-sm">
                                    {task.applicantName}
                                  </td>
                                  <td className="px-5 py-4 font-medium text-slate-700 text-sm">
                                    {task.position}
                                  </td>
                                  <td className="px-5 py-4">
                                    <span
                                      className={`inline-flex items-center px-2.5 py-1 border ${isMasterlist ? "bg-slate-50 text-slate-600 border-slate-200/60" : "bg-indigo-50/50 text-indigo-700 border-indigo-200/60"} rounded-lg text-[10px] font-bold uppercase tracking-widest whitespace-nowrap`}
                                    >
                                      Step {task.step}:{" "}
                                      {stepDef
                                        ? stepDef.action || stepDef.title
                                        : "Unknown Phase"}
                                    </span>
                                  </td>
                                  <td className="px-5 py-4 text-slate-500 font-medium text-[12px] tabular-nums">
                                    {task.submittedAt}
                                  </td>
                                  <td className="px-5 py-4 text-right">
                                    <button className="text-indigo-600 font-bold text-[12px] hover:text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all border border-transparent hover:border-indigo-100 uppercase tracking-widest">
                                      {isMasterlist ? "View Profile" : "Open Queue"}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="xl:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[300px]">
                   <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center justify-center text-center shadow-sm">
                      <div className="w-20 h-20 bg-blue-50 text-[#0038A8] rounded-full flex items-center justify-center mb-6">
                        <Users className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2 uppercase tracking-widest">Team Management</h3>
                      <p className="text-slate-500 text-sm max-w-sm">Access the personnel hierarchy to manage your division and school subordinates efficiently.</p>
                      <button 
                        onClick={() => navigate('/hierarchy')}
                        className="mt-6 px-6 py-2.5 bg-slate-100 text-slate-800 font-bold rounded-xl text-xs hover:bg-slate-200 transition-all uppercase tracking-widest"
                      >
                        Open Hierarchy
                      </button>
                   </div>
                   <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center justify-center text-center shadow-sm">
                      <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                        <TrendingUp className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2 uppercase tracking-widest">Division Reports</h3>
                      <p className="text-slate-500 text-sm max-w-sm">View statistical data and performance metrics for recruitment and personnel lifecycle.</p>
                      <button 
                        onClick={() => navigate('/reports')}
                        className="mt-6 px-6 py-2.5 bg-slate-100 text-slate-800 font-bold rounded-xl text-xs hover:bg-slate-200 transition-all uppercase tracking-widest"
                      >
                        View Analytics
                      </button>
                   </div>
                </div>
              )}
            </div>

        </>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0 bg-transparent">
          {/* Left Column: Stats & Cards */}
          <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1 pb-4">
            {/* Header */}
            <div className="flex flex-col gap-2 shrink-0 pt-2">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Applicant Dashboard
              </h2>
              <p className="text-slate-500 text-sm">
                Track and manage your job applications across DepEd Division of
                Laguna.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
              <StatsCard
                title="Total Applied"
                value={myApplications.length.toString()}
                icon={<Briefcase className="w-5 h-5 text-slate-500" />}
              />
              <StatsCard
                title="In Progress"
                value={myApplications
                  .filter((a) => a.step > 3 && a.step < 15)
                  .length.toString()}
                icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
                color="text-blue-600"
                active={true}
              />
              <StatsCard
                title="Action Req."
                value={myApplications
                  .filter((a) => a.step === 3)
                  .length.toString()}
                icon={<AlertCircle className="w-5 h-5 text-red-500" />}
                color="text-red-600"
              />
              <StatsCard
                title="Approved"
                value={myApplications
                  .filter((a) => a.step === 15)
                  .length.toString()}
                icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
                color="text-green-600"
              />
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2 shrink-0">
              <h3 className="text-lg font-bold text-slate-800">
                My Applications
              </h3>
              <div className="relative w-full sm:w-80 group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400 group-focus-within:text-[#0038A8] transition-colors">
                  <FileSearch className="w-4 h-4" />
                  <div className="w-px h-3 bg-slate-200 group-focus-within:bg-[#0038A8]/20 transition-colors"></div>
                </div>
                <input
                  type="text"
                  placeholder="Search your applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-xl text-sm font-medium shadow-sm focus:outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-900/5 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Application Cards */}
            <div className="grid grid-cols-1 gap-4 shrink-0">
              {myApplications.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-center border border-dashed border-slate-200 rounded-[24px] bg-white transition-all">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 mb-6">
                    <Briefcase className="w-8 h-8 text-slate-300" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-2">
                    No Applications Yet
                  </h3>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed font-medium">
                    You haven't submitted any job applications. Browse the open
                    plantilla items to find the right position for you.
                  </p>
                  <button
                    onClick={() => navigate("/vacancies")}
                    className="px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    Browse Job Openings
                  </button>
                </div>
              )}
              {myApplications
                .filter(
                  (app) =>
                    !searchTerm ||
                    app.position
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()),
                )
                .map((app, index) => {
                  const isActive = activeAppId === app.id;
                  const stepDef = getStepByNumber(app.step);
                  return (
                    <div
                      key={app.id}
                      className={`bg-white/80 backdrop-blur-xl border rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all cursor-pointer p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 ${isActive ? "border-indigo-300 ring-2 ring-indigo-500/20 bg-indigo-50/30" : "border-slate-200/60"}`}
                      onClick={() => setActiveAppId(app.id)}
                    >
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 
                              className="font-semibold text-slate-900 text-lg group-hover:text-slate-700 transition-colors cursor-pointer hover:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (app.vacancy) {
                                  setSelectedVacancy(app.vacancy);
                                } else {
                                  setSelectedVacancy({
                                    title: app.position,
                                    itemNo: "ITEM-" + app.id,
                                    type: "plantilla",
                                    status: "Published",
                                    bureauService: "Information and Communications Technology Service",
                                    divisionUnit: "IT Support Division"
                                  });
                                }
                              }}
                            >
                              {app.position}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                              <Clock className="w-3.5 h-3.5" />
                              Applied on {app.submittedAt}
                            </div>
                          </div>
                          <div className="md:hidden">
                            {app.step === 3 ? (
                              <span className="px-2.5 py-1 bg-red-50 text-red-700 rounded border border-red-100 text-xs font-semibold">
                                Action Req.
                              </span>
                            ) : app.step === 15 ? (
                              <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded border border-green-100 text-xs font-semibold">
                                Approved
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded border border-blue-100 text-xs font-semibold">
                                In Progress
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-sm">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                Step {app.step} of 15
                              </span>
                              <span className="text-[11px] font-semibold text-slate-500">
                                {stepDef?.phase}
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-1000 ease-out ${app.step === 3 ? "bg-red-500" : app.step === 15 ? "bg-green-500" : "bg-[#0038A8]"}`}
                                style={{ width: `${(app.step / 15) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="text-sm font-medium text-slate-700 mt-1 flex items-center gap-2">
                          Current:{" "}
                          <span className="text-slate-500">
                            {stepDef?.title}
                          </span>
                          {app.step === 3 && (
                            <span className="flex items-center gap-1.5 text-red-600 text-[11px] font-bold bg-red-50 px-2 py-0.5 rounded border border-red-100 ml-2">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                              </span>
                              Needs Upload
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-3 shrink-0 w-full md:w-auto">
                        {app.step === 3 && (
                          <button
                            onClick={() => navigate(`/applications/${app.id}`)}
                            className="flex-1 md:flex-none px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 font-semibold rounded-lg text-sm border border-red-200 transition-colors shadow-sm whitespace-nowrap"
                          >
                            Upload Documents
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (app.vacancy) {
                              setSelectedVacancy(app.vacancy);
                            } else {
                              // Fallback for demo
                              setSelectedVacancy({
                                title: app.position,
                                itemNo: "ITEM-" + app.id,
                                type: "plantilla",
                                status: "Published",
                                bureauService: "Information and Communications Technology Service",
                                divisionUnit: "IT Support Division"
                              });
                            }
                          }}
                          className="flex-1 md:flex-none px-4 py-2 bg-blue-50 text-[#0038A8] hover:bg-blue-100 font-bold rounded-lg text-sm border border-blue-100 transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                          <Info className="w-4 h-4" /> Vacancy Info
                        </button>
                        <button
                          onClick={() => navigate(`/applications/${app.id}`)}
                          className="flex-1 md:flex-none px-4 py-2 bg-white text-slate-700 hover:bg-slate-50 font-medium rounded-lg text-sm border border-slate-200 transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                          View Progress <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Right Column: Timeline Panel */}
          <div className="hidden lg:flex w-[340px] xl:w-[380px] shrink-0 flex-col bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden h-[calc(100vh-8rem)] sticky top-4">
            <div className="p-6 border-b border-slate-100/80 bg-gradient-to-b from-slate-50/50 to-transparent">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                Application Timeline
              </h3>
              <p className="text-[12px] text-slate-500 font-medium mt-1">
                {activeAppId
                  ? "Track your progress through the 16 steps"
                  : "Select an application to view progress"}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {activeAppId ? (
                <div className="relative">
                  <div className="absolute left-[11px] top-2 bottom-6 w-[2px] bg-slate-100 rounded-full"></div>
                  <div className="flex flex-col gap-5 relative">
                    {WORKFLOW_STEPS.filter((s) => s.step >= 3).map(
                      (step, idx, arr) => {
                        const currentApp = myApplications.find(
                          (a) => a.id === activeAppId,
                        );
                        const isLast = idx === arr.length - 1;
                        if (!currentApp) return null;

                        const isCompleted = step.step < currentApp.step;
                        const isCurrent = step.step === currentApp.step;
                        const isUpcoming = step.step > currentApp.step;

                        return (
                          <div
                            key={step.step}
                            className={`flex gap-4 relative ${isUpcoming ? "opacity-40" : ""}`}
                          >
                            <div className="shrink-0 mt-0.5 bg-white relative z-10 w-6 h-6 rounded-full flex items-center justify-center">
                              {isCompleted ? (
                                <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center">
                                  <Check className="w-3 h-3" strokeWidth={3} />
                                </div>
                              ) : isCurrent ? (
                                <div className="w-4 h-4 rounded-full border-[3px] border-[#0038A8] bg-white ring-4 ring-[#0038A8]/10"></div>
                              ) : (
                                <div className="w-3 h-3 rounded-full bg-slate-200 border-2 border-white ring-1 ring-slate-200"></div>
                              )}
                            </div>
                            <div className={`flex-1 pb-1 ${isLast ? "" : ""}`}>
                              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                                {step.phase}
                              </div>
                              <div
                                className={`text-sm font-semibold leading-tight ${isCurrent ? "text-[#0038A8]" : "text-slate-700"}`}
                              >
                                {step.title}
                              </div>
                              <div className="text-[12px] text-slate-500 mt-1">
                                {step.action}
                              </div>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <FileCheck className="w-10 h-10 text-slate-300 mb-3" />
                  <p className="text-sm font-medium text-slate-500">
                    No application selected
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )}
</div>
  );
}

function StatsCard({
  title,
  value,
  color = "text-slate-900",
  active = false,
  icon,
}: {
  title: string;
  value: string;
  color?: string;
  active?: boolean;
  icon?: ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden group rounded-3xl transition-all duration-300 flex flex-col justify-between p-6 ${active ? "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-slate-300 ring-1 ring-slate-900/5 translate-y-[-2px]" : "bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1"}`}
    >
      <div className="flex items-start justify-between mb-6 relative z-10">
        <p
          className={`text-[11px] font-bold uppercase tracking-widest ${active ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700"} transition-colors`}
        >
          {title}
        </p>
        {icon && (
          <div
            className={`p-2.5 rounded-2xl transition-all duration-300 ${active ? "bg-indigo-50 text-indigo-600 scale-110" : "bg-slate-50 text-slate-500 group-hover:scale-110 group-hover:bg-indigo-50 group-hover:text-indigo-600"}`}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2 relative z-10">
        <p
          className={`text-4xl font-black tracking-tight ${active ? "text-slate-900" : color}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
