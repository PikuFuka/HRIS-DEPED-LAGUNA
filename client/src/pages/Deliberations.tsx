import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import {
  ShieldAlert,
  FileText,
  Users,
  Briefcase,
  PenTool,
  CheckCircle2
} from "lucide-react";
import { Skeleton } from "../components/ui/Skeleton";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Vacancy {
  id: number;
  title: string;
  status: string;
}

interface Report {
  id: number;
  vacancy_id: number;
  status: string;
  report_date: string;
  preparer: { name: string };
  signatories: any[];
}

export default function Deliberations() {
  const { user } = useAuth();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [selectedVacancy, setSelectedVacancy] = useState<number | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingReports, setLoadingReports] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/vacancies")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch vacancies");
        await new Promise(resolve => setTimeout(resolve, 800));
        return res.json();
      })
      .then((data) => {
        const vacs = Array.isArray(data) ? data : (data.data || []);
        // Only show vacancies that might need deliberation
        setVacancies(vacs.filter((v: Vacancy) => v.status !== "Draft" && v.status !== "Closed"));
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load vacancies");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedVacancy) {
      setLoadingReports(true);
      fetch(`/api/deliberations/${selectedVacancy}`)
        .then(res => res.json())
        .then(data => {
          setReports(Array.isArray(data) ? data : []);
          setLoadingReports(false);
        })
        .catch(() => {
          toast.error("Failed to load reports");
          setLoadingReports(false);
        });
    } else {
      setReports([]);
    }
  }, [selectedVacancy]);

  const generateReport = () => {
    if (!selectedVacancy) return;
    fetch("/api/deliberations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vacancy_id: selectedVacancy })
    })
      .then(res => res.json())
      .then(data => {
        setReports([...reports, data]);
        toast.success("Deliberation report generated successfully!");
      })
      .catch(() => toast.error("Failed to generate report"));
  };

  const signReport = (id: number) => {
    fetch(`/api/deliberations/${id}/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ designation: "HRMPSB Member" })
    })
      .then(res => res.json())
      .then((newSignatory) => {
        toast.success("Successfully signed report");
        setReports(reports.map(report => {
          if (report.id === id) {
            return {
              ...report,
              signatories: [...(report.signatories || []), newSignatory]
            };
          }
          return report;
        }));
      })
      .catch(() => toast.error("Failed to sign report"));
  };

  if (user?.role !== "hrmo" && user?.role !== "hrmpsb" && user?.role !== "Super Admin") {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-slate-50/50 rounded-[20px] border border-slate-200/80 p-6">
        <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Access Restricted</h2>
        <Link to="/" className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 h-full flex flex-col w-full max-w-7xl mx-auto animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Deliberations</h2>
        <p className="text-xs md:text-sm text-slate-500 font-medium">Generate and sign HRMPSB Deliberation Reports.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Left Column: Vacancies */}
        <div className="w-full lg:w-1/3 glass-card rounded-[20px] bg-white border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-800 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-slate-400" /> Active Vacancies
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <Skeleton className="h-20 w-full rounded-xl" />
            ) : vacancies.length === 0 ? (
              <div className="text-center text-slate-400 text-sm py-8">No active vacancies</div>
            ) : (
              vacancies.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVacancy(v.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedVacancy === v.id ? "border-[#0038A8] bg-blue-50/50 shadow-sm" : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                  }`}
                >
                  <h4 className={`font-bold text-sm ${selectedVacancy === v.id ? "text-[#0038A8]" : "text-slate-800"}`}>{v.title}</h4>
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-2 block">{v.status}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Reports */}
        <div className="flex-1 glass-card rounded-[20px] bg-white border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <span className="font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" /> Reports
            </span>
            {selectedVacancy && (
              <button onClick={generateReport} className="px-3 py-1.5 bg-[#0038A8] text-white text-xs font-bold rounded-lg hover:bg-[#002B80] shadow-sm">
                Generate Report
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            {!selectedVacancy ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Users className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-sm font-medium">Select a vacancy to view or generate reports</p>
              </div>
            ) : loadingReports ? (
              <Skeleton className="h-32 w-full rounded-xl" />
            ) : reports.length === 0 ? (
              <div className="text-center text-slate-500 text-sm py-12 bg-white rounded-xl border border-dashed border-slate-200">
                No deliberation reports have been generated for this vacancy yet.
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map(report => (
                  <div key={report.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                          Official Deliberation Report
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] uppercase font-black">{report.status}</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">Generated: {new Date(report.report_date).toLocaleDateString()}</p>
                      </div>
                      <button onClick={() => signReport(report.id)} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold rounded-lg transition-colors border border-slate-200">
                        <PenTool className="w-3.5 h-3.5" /> Sign Report
                      </button>
                    </div>
                    
                    <div className="border-t border-slate-100 pt-4">
                      <h5 className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-3">Signatories</h5>
                      <div className="flex flex-wrap gap-2">
                        {report.signatories?.length > 0 ? (
                          report.signatories.map((sig, i) => (
                            <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> {sig.user?.name || "Member"} ({sig.designation})
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">No signatures yet</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
