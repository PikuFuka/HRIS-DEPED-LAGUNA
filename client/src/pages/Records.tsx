import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Skeleton } from "../components/ui/Skeleton";
import {
  Search,
  User,
  Calendar,
  Building,
  ShieldAlert,
  Edit,
  FileDigit,
  Download,
  Filter,
  Users,
  Eye,
  Info,
  ChevronRight,
  TrendingUp,
  X,
  CreditCard,
  Hash,
  MapPin,
} from "lucide-react";
import { useAuth } from "../lib/auth";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ItemHistoryModal } from "../components/ItemHistoryModal";

interface PlantillaRecord {
  id: string;
  positionStatus: "Filled" | "Unfilled";
  itemNumber: string;
  reclassification: "YES" | "NO";
  previousItemNumber: string;
  positionParenthetical: string;
  employeeNumber: string;
  lastName: string;
  givenName: string;
  middleName: string;
  suffix: string;
  fullName: string;
  sex: "MALE" | "FEMALE";
  dob: string;
  originalAppointment: string;
  dateLastPromotion: string;
  eligibility: string;
  tin: string;
  schoolId: string;
  schoolName: string;
  actualDeploymentSchoolId: string;
  actualDeploymentRoSdo: string;
  taggingOfItem: "Regular" | "Coterm" | "CTI";
  dateOfVacancy: string;
  periodDormant?: string;
  reasonUnfilled?: string;
  remarks?: string;
  otherRemarks?: string;
}

interface NonPlantillaRecord {
  id: string;
  no: number;
  officeAssignment: string;
  schoolId: string;
  schoolName: string;
  itemNumber: string;
  employeeNumber: string;
  lastName: string;
  givenName: string;
  middleName: string;
  suffix: string;
  fullName: string;
  dob: string;
  sex: string;
  firstDayOfService: string;
  yearsInService: number;
  contractDuration: string;
  statusOfEngagement: string;
  natureOfWork?: string;
  monthlySalary?: string;
  sourceOfFunds?: string;
}

export default function Records() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"plantilla" | "non-plantilla">("plantilla");
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<PlantillaRecord | NonPlantillaRecord | null>(null);
  const [historyItemUrl, setHistoryItemUrl] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isExportLoading, setIsExportLoading] = useState(false);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(d => d.id));
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleExport = (format: string) => {
    setIsExportLoading(true);
    toast.promise(new Promise(resolve => setTimeout(resolve, 1500)), {
      loading: `Preparing ${format} export...`,
      success: `Registry successfully exported to ${format}`,
      error: 'Export failed'
    });
    setTimeout(() => setIsExportLoading(false), 1500);
  };

  useEffect(() => {
    setLoading(true);
    // Artificial delay for training/demo purposes to show skeletons
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (user?.role !== "hrmo" && user?.role !== "records") {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-slate-50/50 rounded-[20px] border border-slate-200/80 p-6 shadow-sm text-center">
        <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-rose-100 mx-auto">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Access Restricted</h2>
        <p className="text-sm text-slate-500 mb-8 max-w-sm text-center leading-relaxed">
          You do not have the required security clearance to view personnel records.
        </p>
        <Link to="/" className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Plantilla Mock Data
  const plantillaData: PlantillaRecord[] = [
    {
      id: "1",
      positionStatus: "Filled",
      itemNumber: "OSEC-DECSB-TCH1-540001-2012",
      reclassification: "NO",
      previousItemNumber: "N/A",
      positionParenthetical: "Teacher I",
      employeeNumber: "6340129",
      lastName: "DELA CRUZ",
      givenName: "JUAN",
      middleName: "REYES",
      suffix: "",
      fullName: "DELA CRUZ, JUAN REYES",
      sex: "MALE",
      dob: "1985-05-15",
      originalAppointment: "2012-06-01",
      dateLastPromotion: "2018-09-12",
      eligibility: "LET PASSER",
      tin: "123-456-789",
      schoolId: "108234",
      schoolName: "Laguna National High School",
      actualDeploymentSchoolId: "108234",
      actualDeploymentRoSdo: "SDO Laguna",
      taggingOfItem: "Regular",
      dateOfVacancy: "N/A"
    },
    {
      id: "2",
      positionStatus: "Unfilled",
      itemNumber: "OSEC-DECSB-ADA3-540022-2015",
      reclassification: "NO",
      previousItemNumber: "N/A",
      positionParenthetical: "Administrative Assistant III",
      employeeNumber: "N/A",
      lastName: "N/A",
      givenName: "N/A",
      middleName: "N/A",
      suffix: "",
      fullName: "VACANT",
      sex: "MALE",
      dob: "N/A",
      originalAppointment: "N/A",
      dateLastPromotion: "N/A",
      eligibility: "N/A",
      tin: "N/A",
      schoolId: "108235",
      schoolName: "Pila Central School",
      actualDeploymentSchoolId: "108235",
      actualDeploymentRoSdo: "SDO Laguna",
      taggingOfItem: "Regular",
      dateOfVacancy: "2023-01-10",
      periodDormant: "14 Months",
      reasonUnfilled: "Ongoing Recruitment",
      remarks: "Candidates in selection process"
    }
  ];

  // Non-Plantilla Mock Data
  const nonPlantillaData: NonPlantillaRecord[] = [
    {
      id: "1",
      no: 1,
      officeAssignment: "OSDS - Personnel",
      schoolId: "SDO-LAG-001",
      schoolName: "SDO Laguna Main",
      itemNumber: "COS-2024-001",
      employeeNumber: "COS-634001",
      lastName: "MERCADO",
      givenName: "MARIA",
      middleName: "SANTOS",
      suffix: "",
      fullName: "MERCADO, MARIA SANTOS",
      dob: "1994-11-20",
      sex: "FEMALE",
      firstDayOfService: "2024-01-03",
      yearsInService: 0.5,
      contractDuration: "6 Months",
      statusOfEngagement: "Contract of Services",
      natureOfWork: "Administrative Support",
      monthlySalary: "18,500.00",
      sourceOfFunds: "PS-Budget"
    }
  ];

  const filteredData = typeFilter === "plantilla" 
    ? plantillaData.filter(d => d.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || d.itemNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    : nonPlantillaData.filter(d => d.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || d.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 h-full flex flex-col w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 sm:mt-2">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            Personnel Records
            <span className="px-2 py-0.5 bg-blue-50 text-[#0038A8] text-[10px] uppercase font-bold rounded-full border border-blue-100 italic font-mono tracking-tighter">
              {typeFilter}
            </span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">
            Profiling and records management for SDO Laguna personnel
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Export Registry
          </button>
          <button className="flex-1 sm:flex-none px-5 py-2.5 bg-[#0038A8] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#002B80] transition-all flex items-center justify-center gap-2">
            <Users className="w-4 h-4" /> Add Record
          </button>
        </div>
      </div>

      <div className="flex p-1 bg-slate-100 rounded-xl w-fit shrink-0">
        <button
          onClick={() => setTypeFilter("plantilla")}
          className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${
            typeFilter === "plantilla"
              ? "bg-white text-[#0038A8] shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Plantilla (Permanent)
        </button>
        <button
          onClick={() => setTypeFilter("non-plantilla")}
          className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${
            typeFilter === "non-plantilla"
              ? "bg-white text-[#0038A8] shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Non-Plantilla (COS/JO)
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] rounded-[20px] border border-slate-200/80 bg-white">
        <div className="p-4 md:p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 shrink-0 bg-slate-50/50 relative">
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                className="absolute inset-0 z-20 bg-[#0038A8] flex items-center px-6 gap-4 origin-top"
              >
                <button onClick={() => setSelectedIds([])} className="p-1 hover:bg-white/10 rounded">
                  <X className="w-4 h-4 text-white" />
                </button>
                <span className="text-white text-sm font-bold">
                  {selectedIds.length} records selected
                </span>
                <div className="flex gap-2 ml-auto">
                  <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/20">
                    Archive Selected
                  </button>
                  <button className="px-3 py-1.5 bg-white text-[#0038A8] hover:bg-white/90 rounded-lg text-[11px] font-bold uppercase tracking-wider shadow-lg">
                    Bulk Export (PDF)
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative w-full sm:w-[400px] group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3 text-slate-400 group-focus-within:text-[#0038A8] transition-colors">
              <Search className="w-4 h-4" />
              <div className="w-px h-3 bg-slate-200 group-focus-within:bg-[#0038A8]/20 transition-colors"></div>
            </div>
            <input
              type="text"
              placeholder={typeFilter === 'plantilla' ? "Search item numbers or personnel names..." : "Search ID, full name, or status..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-xl pl-12 pr-12 py-2.5 bg-white focus:outline-none focus:ring-4 focus:ring-[#0038A8]/5 focus:border-[#0038A8] transition-all shadow-sm font-medium placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-3">
             <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-sm text-slate-600 shadow-sm">
              <Filter className="w-4 h-4 text-slate-400" />
              <select className="bg-transparent font-bold outline-none cursor-pointer text-slate-700 text-xs uppercase tracking-wider">
                <option>Active Personnel</option>
                <option>Inactive/Archived</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-white min-h-0 custom-scrollbar">
          {loading ? (
             <div className="space-y-4 p-6 animate-pulse">
               {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-slate-50 rounded-xl border border-slate-100"></div>)}
             </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap border-separate border-spacing-0">
              <thead className="bg-[#fcfdfd] sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5 w-10 bg-[#f8f9fa]">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.length === filteredData.length && filteredData.length > 0} 
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-[#0038A8] focus:ring-[#0038A8] cursor-pointer"
                    />
                  </th>
                  {typeFilter === "plantilla" ? (
                    <>
                      <th className="px-6 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-[0.15em] font-sans">Item No & Position</th>
                      <th className="px-6 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-[0.15em] font-sans">Full Name / Incumbent</th>
                      <th className="px-6 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-[0.15em] font-sans">Position Status</th>
                      <th className="px-6 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-[0.15em] font-sans text-right">Actions</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-[0.15em] font-sans">No. & Name</th>
                      <th className="px-6 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-[0.15em] font-sans">Nature of Work</th>
                      <th className="px-6 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-[0.15em] font-sans">Salary & Status</th>
                      <th className="px-6 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-[0.15em] font-sans text-right">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length > 0 ? (
                  filteredData.map((record: any) => (
                    <tr 
                      key={record.id} 
                      className={`hover:bg-blue-50/30 transition-colors group cursor-pointer ${selectedIds.includes(record.id) ? "bg-blue-50/60" : ""}`} 
                      onClick={() => setSelectedRecord(record)}
                    >
                      <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(record.id)} 
                          onChange={(e) => toggleSelect(record.id, e as any)}
                          className="w-4 h-4 rounded border-slate-300 text-[#0038A8] focus:ring-[#0038A8] cursor-pointer"
                        />
                      </td>
                      {typeFilter === "plantilla" ? (
                        <>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-mono text-[10px] font-bold text-[#0038A8] bg-blue-50 px-2 py-0.5 rounded border border-blue-100 w-fit mb-1.5 align-middle tracking-tight">{record.itemNumber}</span>
                              <span className="font-bold text-slate-800 tracking-tight text-[13px]">{record.positionParenthetical}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900 tracking-tight text-[13px]">{record.fullName}</div>
                            <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5 mt-1 uppercase tracking-tight">
                              <Building className="w-3 h-3 text-slate-400" /> {record.schoolName}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                             <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider inline-block border ${
                              record.positionStatus === "Filled" 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                : "bg-amber-50 text-amber-700 border-amber-100"
                            }`}>
                              {record.positionStatus}
                            </span>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-4">
                                <span className="text-[10px] font-mono font-black text-slate-300">{(record as NonPlantillaRecord).no.toString().padStart(2, '0')}</span>
                                <div>
                                  <div className="font-bold text-slate-900 tracking-tight text-[13px]">{record.fullName}</div>
                                  <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5 mt-1 uppercase tracking-tight">
                                    <FileDigit className="w-3.5 h-3.5 text-slate-300" /> {record.employeeNumber}
                                  </div>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-800 tracking-tight text-[13px]">{record.natureOfWork}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{record.schoolName}</div>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex flex-col">
                               <span className="font-mono font-black text-slate-900 tracking-tight text-[13px]">₱{record.monthlySalary}</span>
                               <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">{record.statusOfEngagement}</span>
                             </div>
                          </td>
                        </>
                      )}
                      <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                           <button 
                            className="p-2 text-slate-400 hover:text-[#0038A8] hover:bg-blue-50 rounded-lg transition-all"
                            title="Quick View"
                           >
                             <Eye className="w-4 h-4" />
                           </button>
                           <button 
                            className="p-2 text-slate-400 hover:text-[#0038A8] hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit Record"
                           >
                             <Edit className="w-4 h-4" />
                           </button>
                         </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="px-6 py-32">
                      <div className="flex flex-col items-center justify-center max-w-md mx-auto text-center">
                        <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-8 border border-slate-100 shadow-inner">
                          <Users className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase tracking-widest mb-3">Registry is Clear</h3>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                          No {typeFilter} records found matching your current search or filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Profile Detail Modal */}
      {selectedRecord && createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecord(null)}
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
                    <User className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight uppercase truncate">{(selectedRecord as any).fullName}</h3>
                    <div className="flex items-center gap-2 mt-1 px-1">
                      <span className="px-2 py-0.5 bg-blue-50 text-[#0038A8] text-[9px] uppercase font-black rounded-md border border-blue-100 tracking-wider">
                        {typeFilter.toUpperCase()}
                      </span>
                      <div className="w-1 h-1 rounded-full bg-slate-200" />
                      <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase tracking-tight">
                        <Hash className="w-3 h-3 text-slate-400" />
                        <span className="font-mono">{(selectedRecord as any).employeeNumber || (selectedRecord as any).itemNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg transition-all text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-auto p-0 custom-scrollbar bg-white">
                {typeFilter === 'plantilla' ? (
                  <div className="divide-y divide-slate-50">
                    {/* Position Section */}
                    <div className="p-6 space-y-5">
                      <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                        </div>
                        Position & Item Info
                      </h4>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <DataField 
                          label="Service Status" 
                          value={(selectedRecord as PlantillaRecord).positionStatus} 
                          highlight={(selectedRecord as PlantillaRecord).positionStatus === 'Filled' ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 w-fit' : 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 w-fit'} 
                        />
                        <DataField 
                          label="Plantilla Item No." 
                          value={(selectedRecord as PlantillaRecord).itemNumber} 
                          highlight="text-[#0038A8] font-mono font-bold" 
                          clickable 
                          onClick={() => setHistoryItemUrl((selectedRecord as PlantillaRecord).itemNumber)} 
                        />
                        <DataField label="Reclassified?" value={(selectedRecord as PlantillaRecord).reclassification} />
                        <DataField label="Previous Item No." value={(selectedRecord as PlantillaRecord).previousItemNumber} />
                        <DataField label="Official Title" value={(selectedRecord as PlantillaRecord).positionParenthetical} className="col-span-2" highlight="text-slate-900 font-bold text-sm" />
                      </div>
                    </div>

                    <div className="p-6 space-y-5">
                      <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mr-1">
                          <Info className="w-3.5 h-3.5" />
                        </div>
                        Personal Particulars
                      </h4>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <DataField label="Sex" value={(selectedRecord as PlantillaRecord).sex} />
                        <DataField label="Date of Birth" value={(selectedRecord as PlantillaRecord).dob} />
                        <DataField label="Eligibility" value={(selectedRecord as PlantillaRecord).eligibility} highlight="text-slate-800 font-bold" />
                        <DataField label="TIN Number" value={(selectedRecord as PlantillaRecord).tin} />
                        <DataField label="Employee ID" value={(selectedRecord as PlantillaRecord).employeeNumber} highlight="text-slate-900 font-bold" />
                      </div>
                    </div>

                    <div className="p-6 space-y-5">
                      <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mr-1">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                        Deployment & Date History
                      </h4>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <DataField label="Original Appt." value={(selectedRecord as PlantillaRecord).originalAppointment} />
                        <DataField label="Last Promotion" value={(selectedRecord as PlantillaRecord).dateLastPromotion} />
                        <DataField label="Station School ID" value={(selectedRecord as PlantillaRecord).schoolId} />
                        <DataField label="Deployment Station" value={(selectedRecord as PlantillaRecord).schoolName} className="col-span-2" highlight="text-slate-800 font-bold" />
                      </div>
                    </div>

                    {(selectedRecord as PlantillaRecord).positionStatus === 'Unfilled' && (
                       <div className="p-6 bg-rose-50/30 space-y-5">
                        <h4 className="flex items-center gap-2 text-[10px] font-black text-rose-600 uppercase tracking-[0.2em]">
                            <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center mr-1">
                              <ShieldAlert className="w-3.5 h-3.5" />
                            </div>
                            Unfilled Analytics
                        </h4>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                          <DataField label="Date of Vacancy" value={(selectedRecord as PlantillaRecord).dateOfVacancy} highlight="text-rose-700 font-bold" />
                          <DataField label="Period Dormant" value={(selectedRecord as PlantillaRecord).periodDormant} />
                          <DataField label="Primary Reason" value={(selectedRecord as PlantillaRecord).reasonUnfilled} className="col-span-2" />
                          <DataField label="Final Remarks" value={(selectedRecord as PlantillaRecord).remarks} className="col-span-2 bg-white/50 p-3 rounded-xl border border-rose-100/50" />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    <div className="p-6 space-y-5">
                      <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-1">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        Personnel Identity
                      </h4>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <DataField label="Employee ID" value={(selectedRecord as NonPlantillaRecord).employeeNumber} highlight="text-[#0038A8] font-bold" />
                        <DataField label="Item Control" value={(selectedRecord as NonPlantillaRecord).itemNumber} />
                        <DataField label="Sex" value={(selectedRecord as NonPlantillaRecord).sex} />
                        <div className="col-span-2 grid grid-cols-3 gap-4">
                          <DataField label="Last Name" value={(selectedRecord as NonPlantillaRecord).lastName} />
                          <DataField label="Given Name" value={(selectedRecord as NonPlantillaRecord).givenName} />
                          <DataField label="Middle Name" value={(selectedRecord as NonPlantillaRecord).middleName} />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-5">
                      <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mr-1">
                          <Building className="w-3.5 h-3.5" />
                        </div>
                        Organizational Assignment
                      </h4>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <DataField label="Office Assignment" value={(selectedRecord as NonPlantillaRecord).officeAssignment} />
                        <DataField label="School ID" value={(selectedRecord as NonPlantillaRecord).schoolId} />
                        <DataField label="School Name" value={(selectedRecord as NonPlantillaRecord).schoolName} className="col-span-2" highlight="text-slate-800 font-bold" />
                        { (selectedRecord as NonPlantillaRecord).natureOfWork && <DataField label="Nature of Work" value={(selectedRecord as NonPlantillaRecord).natureOfWork} className="col-span-2" highlight="text-sm font-bold text-slate-900" /> }
                        { (selectedRecord as NonPlantillaRecord).monthlySalary && <DataField label="Monthly Rate" value={`₱${(selectedRecord as NonPlantillaRecord).monthlySalary}`} highlight="text-emerald-700 font-black text-base" /> }
                      </div>
                    </div>

                    <div className="p-6 space-y-5">
                      <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mr-1">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                        Engagement Period
                      </h4>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <DataField label="First Day of Service" value={(selectedRecord as NonPlantillaRecord).firstDayOfService} />
                        <DataField label="Tenure in Service" value={`${(selectedRecord as NonPlantillaRecord).yearsInService} Years`} highlight="font-bold text-slate-800" />
                        <DataField label="Status of Engagement" value={(selectedRecord as NonPlantillaRecord).statusOfEngagement} className="col-span-2" highlight="text-xs font-black uppercase text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 w-fit" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                <div className="flex gap-2">
                   <button 
                    onClick={() => toast.info("Record exported to PDF")}
                    className="p-2 bg-white border border-slate-200 text-slate-500 rounded-xl hover:text-[#0038A8] hover:border-[#0038A8]/30 hover:bg-blue-50 transition-all shadow-sm"
                    title="Export as PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => toast.info("Email feature coming soon")}
                    className="p-2 bg-white border border-slate-200 text-slate-500 rounded-xl hover:text-[#0038A8] hover:border-[#0038A8]/30 hover:bg-blue-50 transition-all shadow-sm"
                    title="Send Email"
                  >
                    <Users className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedRecord(null)}
                    className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => toast.info("Record updated successfully")}
                    className="px-6 py-2.5 bg-[#0038A8] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#002B80] transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" /> Modify Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}

      {historyItemUrl && (
        <ItemHistoryModal 
          isOpen={true} 
          onClose={() => setHistoryItemUrl(null)} 
          itemNumber={historyItemUrl} 
        />
      )}
    </div>
  );
}

function DataField({ label, value, highlight = "text-slate-900", className = "", onClick, clickable = false }: { label: string; value?: string | number; highlight?: string; className?: string; onClick?: () => void; clickable?: boolean }) {
  const isHighlighted = highlight.includes('bg-');
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.05em]">{label}</span>
      <span 
        onClick={onClick}
        className={`text-[13px] font-semibold tracking-tight ${highlight} ${isHighlighted ? '' : 'leading-relaxed'} ${clickable ? 'cursor-pointer hover:opacity-75 transition-opacity hover:underline underline-offset-4 decoration-2 decoration-blue-200' : ''}`}
      >
        {value || "—"}
      </span>
    </div>
  );
}
