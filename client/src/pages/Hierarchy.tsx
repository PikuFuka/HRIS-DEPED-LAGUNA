import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../lib/auth";
import { 
  Users, 
  ChevronRight, 
  Building2, 
  UserCircle2, 
  BadgeCheck, 
  GraduationCap, 
  Search,
  Filter,
  MoreVertical,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  Eye,
  X,
  CreditCard,
  Building,
  TrendingUp,
  Info,
  Calendar,
  Hash,
  Download,
  Edit,
} from "lucide-react";
import { Skeleton } from "../components/ui/Skeleton";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface Teacher {
  id: string;
  name: string;
  position: string;
  status: string;
}

interface School {
  id: string;
  name: string;
  principal: string;
  principalId: number;
  teachers: Teacher[];
}

interface District {
  id: string;
  name: string;
  supervisor: string;
  supervisorId: number;
  schools: School[];
}

export default function Hierarchy() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<District[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDistricts, setExpandedDistricts] = useState<string[]>([]);
  const [expandedSchools, setExpandedSchools] = useState<string[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/hierarchy")
      .then(async (res) => {
        // Artificial delay for training/demo purposes to show skeletons
        await new Promise(resolve => setTimeout(resolve, 1000));
        return res.json();
      })
      .then(hierarchyData => {
        setData(hierarchyData);
        setLoading(false);
        
        // Auto-expand if the user has a specific role
        if (user?.role === 'Supervisor') {
          const myDistrict = hierarchyData.find((d: District) => d.supervisorId === user.id);
          if (myDistrict) setExpandedDistricts([myDistrict.id]);
        } else if (user?.role === 'Principal') {
          hierarchyData.forEach((d: District) => {
            const mySchool = d.schools.find((s: School) => s.principalId === user.id);
            if (mySchool) {
              setExpandedDistricts([d.id]);
              setExpandedSchools([mySchool.id]);
            }
          });
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  const toggleDistrict = (id: string) => {
    setExpandedDistricts(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSchool = (id: string) => {
    setExpandedSchools(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Filter logic based on role
  const displayData = data.filter(district => {
    if (user?.role === 'Superintendent') return true;
    if (user?.role === 'Supervisor') return district.supervisorId === user.id;
    if (user?.role === 'Principal') return district.schools.some(s => s.principalId === user.id);
    return false;
  }).map(district => {
    if (user?.role === 'Principal') {
      return {
        ...district,
        schools: district.schools.filter(s => s.principalId === user.id)
      };
    }
    return district;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
            <Users className="w-3.5 h-3.5" />
            <span>Division of Laguna</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Personnel Hierarchy</h1>
          <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">
            Manage and view the organizational structure from division office to school level.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group flex-1 md:flex-none">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400 group-focus-within:text-[#0038A8] transition-all">
              <Search className="w-4 h-4" />
              <div className="w-px h-3 bg-slate-200 group-focus-within:bg-[#0038A8]/20 transition-colors"></div>
            </div>
            <input 
              type="text" 
              placeholder="Search personnel or schools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border-2 border-slate-100 rounded-2xl pl-12 pr-12 py-3 text-sm font-bold w-full md:w-80 focus:outline-none focus:border-[#0038A8]/20 focus:ring-8 focus:ring-[#0038A8]/5 transition-all shadow-sm placeholder:text-slate-400 placeholder:font-semibold"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:block">
              <span className="px-1.5 py-0.5 bg-slate-50 text-slate-300 rounded-md text-[9px] font-black border border-slate-100">⌘F</span>
            </div>
          </div>
          <button className="p-3 bg-white border-2 border-slate-100 rounded-2xl text-slate-400 hover:text-[#0038A8] hover:border-[#0038A8]/20 transition-all shadow-sm group">
            <Filter className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i}>
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      ) : displayData.length > 0 ? (
        <div className="space-y-6">
          {displayData.map((district) => (
            <div key={district.id}>
              <DistrictCard 
                district={district} 
                isExpanded={expandedDistricts.includes(district.id)}
                onToggle={() => toggleDistrict(district.id)}
                expandedSchools={expandedSchools}
                onToggleSchool={toggleSchool}
                onViewPersonnel={setSelectedTeacher}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-100 mt-8">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 border border-slate-100 shadow-xl shadow-slate-200/40">
            <Users className="w-10 h-10 text-slate-200" />
          </div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-3">No Hierarchy Found</h3>
          <p className="text-base text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
            There are no personnel records assigned to your current role hierarchy.
          </p>
        </div>
      )}

      {/* Personnel Detail Modal */}
      {selectedTeacher && createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTeacher(null)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[24px] shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col relative z-10"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-slate-100 bg-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0038A8] to-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-900/20 shrink-0 border-2 border-white">
                    <UserCircle2 className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight uppercase truncate">{selectedTeacher.name}</h3>
                    <div className="flex items-center gap-2 mt-1 px-1">
                      <span className={`px-2 py-0.5 text-[9px] uppercase font-black rounded-md border tracking-wider ${
                        selectedTeacher.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {selectedTeacher.status}
                      </span>
                      <div className="w-1 h-1 rounded-full bg-slate-200" />
                      <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase tracking-tight">
                        <Hash className="w-3 h-3 text-slate-400" />
                        <span className="font-mono">{selectedTeacher.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedTeacher(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg transition-all text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-auto p-0 custom-scrollbar bg-white">
                <div className="divide-y divide-slate-50">
                  <div className="p-6 space-y-5">
                    <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-1">
                        <Building className="w-3.5 h-3.5" />
                      </div>
                      Position & Employment
                    </h4>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                      <DataField label="Official Title" value={selectedTeacher.position} highlight="text-slate-900 font-bold text-sm" />
                      <DataField label="Service Status" value={selectedTeacher.status} highlight={selectedTeacher.status === 'Active' ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 w-fit' : 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 w-fit'} />
                      <DataField label="Employment Type" value="Permanent" />
                      <DataField label="Plantilla Item" value={`ITEM-${selectedTeacher.id}-2024`} highlight="text-[#0038A8] font-mono font-bold" />
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mr-1">
                        <Info className="w-3.5 h-3.5" />
                      </div>
                      Personal Details
                    </h4>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                      <DataField label="Sex" value="Female" />
                      <DataField label="TIN Number" value="123-456-789-000" />
                      <DataField label="Eligibility" value="LET Passer" highlight="text-slate-800 font-bold" />
                      <DataField label="Contact Number" value="+63 912 345 6789" />
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mr-1">
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                      Service History
                    </h4>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                      <DataField label="Original Appt." value="June 15, 2018" />
                      <DataField label="Last Promotion" value="May 20, 2022" />
                      <DataField label="Years in Service" value="6 Years" highlight="text-slate-800 font-bold" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                <div className="flex gap-2">
                   <button 
                    onClick={() => toast.info("Service record exported to PDF")}
                    className="p-2 bg-white border border-slate-200 text-slate-500 rounded-xl hover:text-[#0038A8] hover:border-[#0038A8]/30 hover:bg-blue-50 transition-all shadow-sm"
                    title="Export PDS"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedTeacher(null)}
                    className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => toast.info("Profile update request sent to HRMO")}
                    className="px-6 py-2.5 bg-[#0038A8] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#002B80] transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" /> Request Update
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

function DistrictCard({ district, isExpanded, onToggle, expandedSchools, onToggleSchool, onViewPersonnel }: { 
  district: District; 
  isExpanded: boolean; 
  onToggle: () => void;
  expandedSchools: string[];
  onToggleSchool: (id: string) => void;
  onViewPersonnel: (teacher: Teacher) => void;
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
      <div 
        onClick={onToggle}
        className="p-6 flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className={`w-14 h-14 rounded-2xl ${isExpanded ? 'bg-[#0038A8] text-white' : 'bg-slate-100 text-slate-400'} flex items-center justify-center transition-all duration-300 group-hover:scale-105`}>
              <BadgeCheck className="w-7 h-7" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald-500 border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">{district.name}</h3>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <UserCircle2 className="w-3.5 h-3.5 text-[#0038A8]" />
                {district.supervisor}
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider underline decoration-[#0038A8]/30 decoration-2 underline-offset-4">
                District Supervisor
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Managed Schools</span>
            <span className="text-xl font-black text-slate-900">{district.schools.length}</span>
          </div>
          <motion.div 
            animate={{ rotate: isExpanded ? 90 : 0 }}
            className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-slate-600 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100 bg-slate-50"
          >
            <div className="p-4 md:p-6 space-y-4">
              {district.schools.map((school) => (
                <div key={school.id}>
                  <SchoolCard 
                    school={school} 
                    isExpanded={expandedSchools.includes(school.id)}
                    onToggle={() => onToggleSchool(school.id)}
                    onViewPersonnel={onViewPersonnel}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SchoolCard({ school, isExpanded, onToggle, onViewPersonnel }: { school: School; isExpanded: boolean; onToggle: () => void; onViewPersonnel: (teacher: Teacher) => void }) {
  return (
    <div className="bg-white rounded-[20px] border border-slate-200/80 overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
      <div 
        onClick={onToggle}
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group"
      >
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl ${isExpanded ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'} flex items-center justify-center transition-all group-hover:scale-105`}>
            <Building2 className="w-5.5 h-5.5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 tracking-tight">{school.name}</h4>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{school.principal}</span>
              <span className="text-[10px] font-black text-slate-300">•</span>
              <span className="text-[10px] font-bold text-[#0038A8] uppercase tracking-widest">School Principal</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personnel</span>
            <span className="text-sm font-black text-slate-900">{school.teachers.length}</span>
          </div>
          <motion.div 
            animate={{ rotate: isExpanded ? 90 : 0 }}
            className="text-slate-300"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100 bg-white"
          >
            <div className="p-0">
              <div className="grid grid-cols-1 divide-y divide-slate-100">
                {school.teachers.map((teacher, idx) => (
                  <div key={teacher.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                        <UserCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <p className="text-sm font-bold text-slate-900">{teacher.name}</p>
                           <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                             teacher.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                           }`}>
                             {teacher.status}
                           </span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{teacher.position}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onViewPersonnel(teacher)}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl text-[10px] hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2 opacity-0 group-hover:opacity-100 uppercase tracking-widest shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#0038A8]" /> See More
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-slate-50 flex justify-center border-t border-slate-100">
                <button className="text-[10px] font-black text-[#0038A8] uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-3 transition-all">
                  Manage Complete Registry <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DataField({ label, value, highlight = "text-slate-900", className = "" }: { label: string; value?: string | number; highlight?: string; className?: string }) {
  const isHighlighted = highlight.includes('bg-');
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.05em]">{label}</span>
      <span className={`text-[13px] font-semibold tracking-tight ${highlight} ${isHighlighted ? '' : 'leading-relaxed'}`}>
        {value || "—"}
      </span>
    </div>
  );
}
