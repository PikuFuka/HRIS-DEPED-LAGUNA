import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import {
  Search,
  ShieldAlert,
  FileText,
  User,
  Briefcase,
  ChevronRight,
  ClipboardList
} from "lucide-react";
import { Skeleton } from "../components/ui/Skeleton";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { EvaluationModal } from "../components/EvaluationModal";

interface Applicant {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  type: string;
}

interface Vacancy {
  id: number;
  title: string;
  status: string;
  itemNo?: string;
}

interface Application {
  id: number;
  status: string;
  date_applied: string;
  application_type: string;
  applicant: Applicant;
  vacancy: Vacancy;
}

export default function Applications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/applications")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch applications");
        await new Promise(resolve => setTimeout(resolve, 800)); // Demo delay
        return res.json();
      })
      .then((data) => {
        setApplications(Array.isArray(data) ? data : (data.data || []));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load applications");
        setLoading(false);
      });
  }, []);

  const filteredApplications = applications.filter((app) => {
    if (statusFilter !== "All Status" && app.status !== statusFilter) return false;
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      const name = `${app.applicant.first_name} ${app.applicant.last_name}`.toLowerCase();
      return name.includes(query) || app.vacancy.title.toLowerCase().includes(query);
    }
    return true;
  });

  if (user?.role !== "hrmo" && user?.role !== "hrmpsb" && user?.role !== "Super Admin") {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-slate-50/50 rounded-[20px] border border-slate-200/80 p-6 shadow-sm">
        <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-rose-100">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Access Restricted</h2>
        <p className="text-sm text-slate-500 mb-8 max-w-sm text-center">
          You do not have clearance to view applications.
        </p>
        <Link to="/" className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 h-full flex flex-col w-full max-w-7xl mx-auto animate-in fade-in duration-300">
      <EvaluationModal 
        application={selectedApp} 
        onClose={() => setSelectedApp(null)}
        onSuccess={() => {
           setSelectedApp(null);
           // Ideally re-fetch or update state
        }}
      />
      {loading ? (
        <div className="space-y-6 flex flex-col h-full fade-in duration-300">
          <div className="space-y-2.5">
            <Skeleton className="h-8 w-48 rounded-xl shadow-sm" />
            <Skeleton className="h-4 w-72 rounded-lg opacity-60" />
          </div>
          <div className="glass-card flex-1 shadow-sm rounded-[20px] bg-white p-6">
             <Skeleton className="h-[52px] w-full max-w-2xl rounded-2xl mb-6" />
             <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                   <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
             </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="contents"
        >
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Application Pipeline
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              Manage and evaluate candidate applications for open vacancies.
            </p>
          </div>

          <div className="glass-card flex-1 flex flex-col overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] rounded-[20px] border border-slate-200/80 bg-white">
            <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row gap-6 bg-slate-50">
              <div className="relative w-full max-w-2xl group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3 text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search by applicant name or vacancy title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 bg-white border-2 border-slate-100 rounded-xl text-sm font-semibold shadow-sm focus:border-blue-500 outline-none"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-48 text-sm font-black text-slate-700 border-2 border-slate-100 rounded-xl px-4 py-3 bg-white outline-none shadow-sm cursor-pointer"
              >
                <option>All Status</option>
                <option>Submitted</option>
                <option>Screening</option>
                <option>Initial Evaluation</option>
                <option>Preparing Appointments</option>
              </select>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 space-y-4">
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  onClick={(e) => {
                    // Prevent navigation if clicking buttons
                    if ((e.target as HTMLElement).closest('button')) return;
                    navigate(`/applications/${app.id}`);
                  }}
                  className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-blue-200 cursor-pointer transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                      {app.applicant.first_name[0]}{app.applicant.last_name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                        {app.applicant.first_name} {app.applicant.last_name}
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] uppercase font-black">
                          {app.applicant.type}
                        </span>
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {app.vacancy.title}</span>
                        <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Applied: {app.date_applied}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full md:w-auto border-t md:border-none border-slate-100 pt-4 md:pt-0">
                    <div className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
                      {app.status}
                    </div>
                    {user?.role === "hrmpsb" && app.status !== "Preparing Appointments" && (
                       <button
                         onClick={() => setSelectedApp(app)}
                         className="flex items-center gap-2 px-4 py-2 bg-[#0038A8] text-white text-xs font-bold rounded-lg hover:bg-[#002B80] shadow-sm ml-auto"
                       >
                         <ClipboardList className="w-4 h-4" /> Evaluate
                       </button>
                    )}
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                       <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredApplications.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <User className="w-12 h-12 text-slate-200 mb-4" />
                  <h3 className="text-lg font-black text-slate-900">No applications found</h3>
                  <p className="text-slate-500 mt-2 text-sm">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
