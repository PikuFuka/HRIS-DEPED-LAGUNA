import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import {
  ShieldAlert,
  UserCheck,
  FileCheck2,
  UploadCloud,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Skeleton } from "../components/ui/Skeleton";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Appointment {
  id: number;
  appointment_number: string;
  status: string;
  date_issued: string;
  decision: {
    application: {
      applicant: {
        first_name: string;
        last_name: string;
      }
    }
  };
  requirements: any[];
}

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/appointments")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch appointments");
        await new Promise(resolve => setTimeout(resolve, 800));
        return res.json();
      })
      .then((data) => {
        setAppointments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load appointments");
        setLoading(false);
      });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("document_name", "PDS Form 212");
    formData.append("document", file);

    fetch(`/api/appointments/${id}/requirements`, {
      method: "POST",
      body: formData,
    })
      .then(async res => {
        if (!res.ok) throw new Error("Failed to upload");
        return res.json();
      })
      .then((newReq) => {
        toast.success("Requirement uploaded successfully");
        setAppointments(appointments.map(apt => {
          if (apt.id === id) {
            return { ...apt, requirements: [...(apt.requirements || []), newReq] };
          }
          return apt;
        }));
      })
      .catch(() => toast.error("Failed to upload requirement"));
  };

  if (user?.role !== "hrmo" && user?.role !== "Superintendent" && user?.role !== "Super Admin") {
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
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Appointments</h2>
        <p className="text-xs md:text-sm text-slate-500 font-medium">Manage issued appointments and track pre-employment requirements.</p>
      </div>

      <div className="glass-card flex-1 flex flex-col overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] rounded-[20px] border border-slate-200/80 bg-white">
        <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50 flex gap-4">
          <div className="flex-1 flex items-center gap-3 font-bold text-slate-700">
            <UserCheck className="w-5 h-5 text-[#0038A8]" /> Issued Appointments
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50 space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)
          ) : appointments.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <FileCheck2 className="w-12 h-12 text-slate-200 mb-4" />
              <h3 className="text-lg font-black text-slate-900">No appointments found</h3>
              <p className="text-slate-500 mt-2 text-sm">Appointments will appear here once a final decision is made.</p>
            </div>
          ) : (
            appointments.map((apt) => (
              <div key={apt.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm hover:border-[#0038A8]/30 transition-all">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      APT: {apt.appointment_number}
                    </span>
                    <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded ${apt.status === 'Draft' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                      {apt.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {apt.decision?.application?.applicant?.first_name} {apt.decision?.application?.applicant?.last_name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Issued on {new Date(apt.date_issued).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto border-t md:border-none border-slate-100 pt-4 md:pt-0">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Requirements</span>
                    <span className="text-sm font-bold text-slate-700">{apt.requirements?.length || 0} / 5 Completed</span>
                  </div>
                  <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-[#0038A8] font-bold rounded-lg hover:bg-slate-200 transition-colors text-xs cursor-pointer">
                    <UploadCloud className="w-4 h-4" /> Upload Doc
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.doc,.docx,.png,.jpg"
                      onChange={(e) => handleFileChange(e, apt.id)} 
                    />
                  </label>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#0038A8] text-white font-bold rounded-lg hover:bg-[#002B80] transition-colors text-xs shadow-sm">
                    <CheckCircle2 className="w-4 h-4" /> Finalize
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
