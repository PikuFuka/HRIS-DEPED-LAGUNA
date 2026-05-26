import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  ChevronRight, 
  ShieldAlert,
  Plus
} from "lucide-react";
import { toast } from "sonner";

interface Vacancy {
  id: number;
  title: string;
  status: string;
  deadline: string;
  itemNo: string;
  type: "plantilla" | "non-plantilla";
  employmentStatus?: string;
  contractDuration?: string;
  bureauService?: string;
  divisionUnit?: string;
  salaryGrade?: string;
  monthlySalary?: string;
  incentives?: string;
  jobDescription?: string;
  qualificationEducation?: string;
  qualificationExperience?: string;
  qualificationTraining?: string;
  qualificationEligibility?: string;
  documentName?: string;
}

interface VacancyDetailsModalProps {
  vacancy: Vacancy | null;
  onClose: () => void;
  userRole?: string;
  onApply?: (vacancy: Vacancy) => void;
  onEdit?: (vacancy: Vacancy) => void;
}

export function VacancyDetailsModal({ vacancy, onClose, userRole, onApply, onEdit }: VacancyDetailsModalProps) {
  if (!vacancy) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-[32px] shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col relative z-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 border-b border-slate-100 flex justify-between items-start shrink-0 bg-slate-50/50">
          <div className="space-y-2">
            <div className="flex gap-2 mb-2">
               <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100">
                {vacancy.type}
              </span>
               <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100">
                {vacancy.status}
              </span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">
              {vacancy.title}
            </h3>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
                <Building2 className="w-4 h-4" /> {vacancy.bureauService || "N/A"}
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
                <MapPin className="w-4 h-4" /> {vacancy.divisionUnit || "N/A"}
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 bg-white shadow-sm border border-slate-200 rounded-full hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-600"
          >
            <ShieldAlert className="w-6 h-6 rotate-45" /> 
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Official Document Style Table */}
            <div className="bg-white border-2 border-slate-900 rounded-sm overflow-hidden shadow-sm font-sans text-slate-900">
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] border-b-2 border-slate-900">
                <div className="bg-white p-3 border-r-2 border-slate-900 font-black text-xs uppercase">BUREAU/SERVICE:</div>
                <div className="p-3 text-sm font-medium">{vacancy.bureauService || "Information and Communications Technology Service"}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] border-b-2 border-slate-900">
                <div className="bg-white p-3 border-r-2 border-slate-900 font-black text-xs uppercase">DIVISION/UNIT:</div>
                <div className="p-3 text-sm font-medium">{vacancy.divisionUnit || "Office of the Director"}</div>
              </div>

              <div className="bg-slate-200 p-2 text-center border-b-2 border-slate-900 font-black text-sm uppercase tracking-widest">
                POSITION PROFILE
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 border-b-2 border-slate-900">
                <div className="p-4 border-r-2 border-slate-900 space-y-6">
                  <div>
                    <span className="font-black text-xs uppercase block mb-1">Position:</span>
                    <span className="text-lg font-black">{vacancy.title}</span>
                  </div>
                  <div>
                    <span className="font-black text-xs uppercase block mb-1">Item No.:</span>
                    <span className="font-mono font-black text-sm text-[#0038A8] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{vacancy.itemNo}</span>
                  </div>
                </div>
                <div className="p-4 space-y-4 bg-slate-50/30">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-black text-xs uppercase block mb-1">Salary Grade:</span>
                      <span className="font-bold">{vacancy.salaryGrade || "9-1"}</span>
                    </div>
                    <div>
                      <span className="font-black text-xs uppercase block mb-1">Monthly Salary:</span>
                      <span className="font-black text-emerald-600">₱ {vacancy.monthlySalary || "24,329.00"}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <span className="font-black text-xs uppercase block mb-2">Other Incentives/Bonuses:</span>
                    <ul className="list-disc list-inside space-y-1 text-xs font-bold text-slate-600">
                      {(vacancy.incentives?.split(",") || ["Monthly Personnel Economic Relief Allowance (PERA)", "Mid-year bonus", "Productivity Enhancement Incentive"]).map((item, i) => (
                        <li key={i} className="leading-tight">{item.trim()}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-slate-200 p-2 text-center border-b-2 border-slate-900 font-black text-sm uppercase tracking-widest">
                JOB DESCRIPTION
              </div>
              <div className="p-6 border-b-2 border-slate-900">
                <p className="text-sm font-medium leading-relaxed italic">
                  {vacancy.jobDescription || "The position is responsible for providing prompt and quality administrative and clerical support in accordance with the Department's policies and procedures."}
                </p>
              </div>

              <div className="bg-slate-200 p-2 text-center border-b-2 border-slate-900 font-black text-sm uppercase tracking-widest">
                MINIMUM QUALIFICATIONS
              </div>
              <div className="divide-y-2 divide-slate-900">
                {[
                  { label: "Education", value: vacancy.qualificationEducation || "Completion of 2 years of studies in college OR Completion of Grade 12/Senior High School" },
                  { label: "Experience", value: vacancy.qualificationExperience || "1 year of relevant experience" },
                  { label: "Training", value: vacancy.qualificationTraining || "4 hours of relevant training" },
                  { label: "Eligibility", value: vacancy.qualificationEligibility || "Career Service (Subprofessional) First Level Eligibility" }
                ].map((q, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
                    <div className="p-3 border-r-2 border-slate-900 font-black text-xs bg-slate-50/50 flex items-center justify-center text-center">{q.label}</div>
                    <div className="p-4 text-sm font-medium leading-normal bg-white">{q.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {vacancy.documentName ? (
              <div className="p-6 bg-[#0038A8] rounded-2xl text-white shadow-xl shadow-blue-900/10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700 blur-2xl"></div>
                <div className="relative z-10 flex items-center gap-5">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                    <Plus className="w-8 h-8 text-white rotate-45" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black tracking-tight leading-none mb-1">Attached Document</h4>
                    <p className="text-sm text-white/70 font-bold">{vacancy.documentName}</p>
                    <p className="text-[10px] uppercase font-black tracking-widest text-[#FFD700] mt-1">Official Notice of Vacancy (PDF)</p>
                  </div>
                </div>
                <button 
                  onClick={() => toast.success("Opening vacancy document...")}
                  className="relative z-10 px-8 py-3.5 bg-white text-[#0038A8] font-black rounded-xl hover:bg-[#F2F2F2] transition-all shadow-lg active:scale-95 flex items-center gap-2 text-sm uppercase tracking-widest"
                >
                  View Document <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-6 bg-slate-100 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
                <ShieldAlert className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No detailed document attached</p>
              </div>
            )}

            {userRole === "hrmo" && onEdit && (
              <div className="flex justify-center pt-4">
                <button 
                  onClick={() => onEdit(vacancy)}
                  className="w-full max-w-md py-5 bg-slate-100 text-slate-900 border-2 border-slate-200 font-black rounded-3xl hover:bg-white hover:border-[#0038A8] hover:text-[#0038A8] transition-all flex items-center justify-center gap-4 text-xl tracking-tight"
                >
                  EDIT THIS VACANCY <Plus className="w-6 h-6" />
                </button>
              </div>
            )}

            {userRole === "applicant" && onApply && (
              <div className="flex justify-center pt-4">
                <button 
                  onClick={() => onApply(vacancy)}
                  className="w-full max-w-md py-5 bg-[#0038A8] text-white font-black rounded-3xl shadow-2xl shadow-blue-900/20 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-4 text-xl tracking-tight"
                >
                  SUBMIT APPLICATION <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">
            System Reference: {vacancy.itemNo}
          </p>
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-white border border-slate-200 text-slate-900 font-black rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm text-sm uppercase tracking-widest"
          >
            Close Details
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
