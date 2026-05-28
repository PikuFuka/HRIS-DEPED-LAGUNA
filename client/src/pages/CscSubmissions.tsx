import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import {
  ShieldAlert,
  Send,
  Building,
  FileCheck,
  AlertCircle
} from "lucide-react";
import { Skeleton } from "../components/ui/Skeleton";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function CscSubmissions() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
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
        toast.error("Failed to load appointments for CSC");
        setLoading(false);
      });
  }, []);

  const submitToCsc = (appointmentId: number) => {
    fetch(`/api/appointments/${appointmentId}/csc-submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference_no: `CSC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
        remarks: "Initial submission bundle"
      })
    })
      .then(res => res.json())
      .then(() => {
        toast.success("Successfully submitted bundle to CSC");
        // Refetch appointments
      })
      .catch(() => toast.error("Failed to submit to CSC"));
  };

  const recordAction = (submissionId: number, action: string) => {
    fetch(`/api/csc-submissions/${submissionId}/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action_taken: action,
        remarks: `CSC has ${action.toLowerCase()} the appointment.`
      })
    })
      .then(res => res.json())
      .then(() => {
        toast.success(`CSC Action recorded: ${action}`);
      })
      .catch(() => toast.error("Failed to record CSC action"));
  };

  if (user?.role !== "hrmo" && user?.role !== "csc" && user?.role !== "Super Admin") {
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
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">CSC Compliance</h2>
        <p className="text-xs md:text-sm text-slate-500 font-medium">Track appointment submissions and actions from the Civil Service Commission.</p>
      </div>

      <div className="glass-card flex-1 flex flex-col overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] rounded-[20px] border border-slate-200/80 bg-white">
        <div className="p-6 md:p-8 border-b border-slate-100 bg-[#0038A8] text-white flex gap-4">
          <div className="flex-1 flex items-center gap-3 font-bold">
            <Building className="w-5 h-5 text-white/80" /> Submissions & Actions
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50 space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)
          ) : appointments.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-12 h-12 text-slate-200 mb-4" />
              <h3 className="text-lg font-black text-slate-900">No appointments to submit</h3>
            </div>
          ) : (
            appointments.map((apt) => {
              const latestSubmission = apt.csc_submissions?.[apt.csc_submissions.length - 1];

              return (
                <div key={apt.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm hover:border-[#0038A8]/30 transition-all">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        APT: {apt.appointment_number}
                      </span>
                      {latestSubmission ? (
                        <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded ${latestSubmission.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                          CSC: {latestSubmission.status}
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded bg-amber-50 text-amber-700">
                          Not Submitted
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">
                      {apt.decision?.application?.applicant?.first_name} {apt.decision?.application?.applicant?.last_name}
                    </h3>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto border-t md:border-none border-slate-100 pt-4 md:pt-0">
                    {!latestSubmission ? (
                      <button 
                        onClick={() => submitToCsc(apt.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0038A8] text-white font-bold rounded-lg hover:bg-[#002B80] transition-colors text-xs shadow-sm"
                      >
                        <Send className="w-4 h-4" /> Transmit to CSC
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => recordAction(latestSubmission.id, 'Approved')}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold rounded-lg hover:bg-emerald-100 transition-colors text-xs"
                        >
                          <FileCheck className="w-4 h-4" /> Log Approval
                        </button>
                        <button 
                          onClick={() => recordAction(latestSubmission.id, 'Returned')}
                          className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 font-bold rounded-lg hover:bg-rose-100 transition-colors text-xs"
                        >
                          <AlertCircle className="w-4 h-4" /> Log Return
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
