import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../lib/auth";
import { Search, Download, Briefcase, Hash, Info, FileText, X, Clock, User, CheckCircle2, ChevronRight, History } from "lucide-react";
import { Skeleton } from "../components/ui/Skeleton";
import { motion, AnimatePresence } from "motion/react";

interface ItemHistory {
  date: string;
  action: string;
  details: string;
  occupant?: string;
  status: "completed" | "current";
}

interface ItemRecord {
  id: string;
  itemNo: string;
  position: string;
  type: "plantilla" | "non-plantilla";
  salaryGrade: string;
  status: "Filled" | "Vacant" | "Abolished";
  department: string;
  history: ItemHistory[];
}

export default function Registers() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | "plantilla" | "non-plantilla">("All");
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ItemRecord | null>(null);

  // Mock Item Data
  const itemData: ItemRecord[] = [
    {
      id: "ITM-001",
      itemNo: "OSEC-DECSB-T1-120001-1998",
      position: "Teacher I",
      type: "plantilla",
      salaryGrade: "11",
      status: "Filled",
      department: "Elementary School Unit",
      history: [
        { date: "1998-06-01", action: "Item Created", details: "Plantilla item established under OSEC DECSB.", status: "completed" },
        { date: "2015-08-15", action: "Occupied", details: "Appointment issued to Juan Dela Cruz.", occupant: "Juan Dela Cruz", status: "completed" },
        { date: "2020-11-30", action: "Vacated", details: "Juan Dela Cruz promoted to Teacher III.", occupant: "Juan Dela Cruz", status: "completed" },
        { date: "2021-02-01", action: "Occupied", details: "Appointment issued to Maria Santos.", occupant: "Maria Santos", status: "current" },
      ]
    },
    {
      id: "ITM-002",
      itemNo: "OSEC-DECSB-T3-120045-1998",
      position: "Teacher III",
      type: "plantilla",
      salaryGrade: "13",
      status: "Vacant",
      department: "Secondary School Unit",
      history: [
        { date: "1998-06-01", action: "Item Created", details: "Plantilla item established under OSEC DECSB.", status: "completed" },
        { date: "2010-04-12", action: "Occupied", details: "Appointment issued to Pedro Penduko.", occupant: "Pedro Penduko", status: "completed" },
        { date: "2023-12-31", action: "Vacated", details: "Pedro Penduko retired from service.", occupant: "Pedro Penduko", status: "current" }
      ]
    },
    {
      id: "ITM-003",
      itemNo: "Contract of Service (COS)",
      position: "Administrative Assistant I",
      type: "non-plantilla",
      salaryGrade: "7",
      status: "Filled",
      department: "Office of the Director",
      history: [
        { date: "2024-01-01", action: "Contract Initiated", details: "COS created for 6 months.", status: "completed" },
        { date: "2024-01-15", action: "Occupied", details: "Contract signed by Ana Reyes.", occupant: "Ana Reyes", status: "current" },
      ]
    },
    {
      id: "ITM-004",
      itemNo: "Job Order (JO)",
      position: "Security Guard",
      type: "non-plantilla",
      salaryGrade: "4",
      status: "Vacant",
      department: "General Services Division",
      history: [
        { date: "2023-01-01", action: "JO Initiated", details: "Job Order created for FY 2023.", status: "completed" },
        { date: "2023-02-01", action: "Occupied", details: "Assigned to Lito Lapid.", occupant: "Lito Lapid", status: "completed" },
        { date: "2023-12-31", action: "Vacated", details: "End of contract term.", occupant: "Lito Lapid", status: "completed" },
        { date: "2024-01-01", action: "JO Renewed", details: "Job Order renewed for FY 2024.", status: "current" }
      ]
    },
    {
      id: "ITM-005",
      itemNo: "OSEC-DECSB-MT1-120112-2003",
      position: "Master Teacher I",
      type: "plantilla",
      salaryGrade: "18",
      status: "Filled",
      department: "Secondary School Unit",
      history: [
        { date: "2003-05-15", action: "Item Created", details: "Reclassified from Teacher III.", status: "completed" },
        { date: "2003-08-01", action: "Occupied", details: "Appointment issued to Clara Barton.", occupant: "Clara Barton", status: "current" }
      ]
    }
  ];

  const filteredItems = itemData.filter(item => {
    const matchesSearch = item.itemNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All" || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  useEffect(() => {
    setLoading(true);
    // Artificial delay for skeleton demonstration
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 h-full flex flex-col">
      {loading ? (
        <div className="space-y-6 flex flex-col h-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 sm:mt-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="flex-1 bg-white rounded-[20px] border border-slate-200/80 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
             <div className="p-6 md:p-8 border-b border-slate-100 flex justify-center bg-slate-50">
               <Skeleton className="h-12 w-full max-w-2xl rounded-2xl" />
             </div>
             <div className="flex-1 overflow-auto p-0">
               <table className="w-full text-left text-sm border-separate border-spacing-0">
                 <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <th key={i} className="px-6 py-4"><Skeleton className="h-4 w-24" /></th>
                    ))}
                  </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {Array.from({ length: 8 }).map((_, i) => (
                     <tr key={i}>
                       <td className="px-6 py-5"><Skeleton className="h-4 w-40" /></td>
                       <td className="px-6 py-5"><Skeleton className="h-4 w-32" /></td>
                       <td className="px-6 py-5"><Skeleton className="h-4 w-24 rounded-full" /></td>
                       <td className="px-6 py-5"><Skeleton className="h-4 w-16" /></td>
                       <td className="px-6 py-5"><Skeleton className="h-6 w-20 rounded-md" /></td>
                       <td className="px-6 py-5"><Skeleton className="h-8 w-8 rounded-md ml-auto" /></td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="contents"
        >
          <div className="flex flex-col gap-6 shrink-0 sm:mt-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                  Item Numbers Register
                </h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">Comprehensive list of Plantilla and Non-Plantilla items</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl shadow-sm text-sm hover:bg-slate-50 flex items-center gap-2">
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden rounded-[20px] bg-white border border-slate-200/80 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] min-h-0">
            <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6 shrink-0 bg-slate-50">
              <div className="relative w-full max-w-lg group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3 text-slate-400 group-focus-within:text-[#0038A8] transition-colors">
                  <Search className="w-5 h-5" />
                  <div className="w-px h-4 bg-slate-200 group-focus-within:bg-[#0038A8]/20 transition-colors"></div>
                </div>
                <input
                  type="text"
                  placeholder="Search item number or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-15 pr-6 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-base font-semibold shadow-sm focus:outline-none focus:border-[#0038A8]/30 focus:ring-8 focus:ring-[#0038A8]/5 transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 bg-white border-2 border-slate-100 rounded-2xl px-2 py-1.5 shadow-sm">
                <button
                  onClick={() => setTypeFilter("All")}
                  className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                    typeFilter === "All" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  All Items
                </button>
                <button
                  onClick={() => setTypeFilter("plantilla")}
                  className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                    typeFilter === "plantilla" ? "bg-blue-50 text-[#0038A8]" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Plantilla
                </button>
                <button
                  onClick={() => setTypeFilter("non-plantilla")}
                  className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                    typeFilter === "non-plantilla" ? "bg-amber-50 text-amber-700" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Non-Plantilla
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto bg-white custom-scrollbar">
              <table className="w-full text-left text-sm whitespace-nowrap border-separate border-spacing-0">
                <thead className="bg-[#fcfdfd] sticky top-0 z-10 border-b border-slate-200 shadow-sm">
                  <tr className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.15em] font-sans">
                    <th className="px-6 py-4">Item Number</th>
                    <th className="px-6 py-4">Position</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Salary Grade</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <tr 
                        key={item.id} 
                        onClick={() => setSelectedItem(item)}
                        className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                      >
                        <td className="px-6 py-4 text-[13px] font-bold text-slate-800 tracking-tighter">
                          {item.type === "non-plantilla" ? (
                            <span className="text-slate-500 font-sans">{item.itemNo}</span>
                          ) : (
                            <span className="font-mono">{item.itemNo}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 tracking-tight text-[13px]">{item.position}</div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-0.5">
                            {item.department}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider inline-flex items-center border ${
                            item.type === "plantilla" 
                              ? "bg-blue-50/50 text-[#0038A8] border-blue-100" 
                              : "bg-amber-50/50 text-amber-700 border-amber-100"
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                           <span className="font-bold text-slate-600">SG {item.salaryGrade}</span>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider inline-block border ${
                            item.status === "Filled" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                            item.status === "Vacant" ? "bg-rose-50 text-rose-700 border-rose-100" :
                            "bg-slate-50 text-slate-600 border-slate-200"
                           }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(item);
                            }}
                            className="p-2 text-slate-400 hover:text-[#0038A8] hover:bg-blue-50 rounded-lg transition-all"
                            title="View Item History"
                          >
                            <History className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-32 whitespace-normal text-center">
                        <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                          <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
                            <Hash className="w-10 h-10 text-slate-200" />
                          </div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase tracking-widest mb-2">No Items Found</h3>
                          <p className="text-sm text-slate-500 leading-relaxed font-medium">There are currently no item numbers matching your search criteria.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* History Modal */}
          {selectedItem && createPortal(
            <AnimatePresence>
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedItem(null)}
                  className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 8 }}
                  className="relative w-full max-w-lg bg-white rounded-[24px] shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
                >
                  <div className="px-6 py-5 border-b border-slate-100 bg-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                        <Hash className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight uppercase truncate">
                          {selectedItem.type === "non-plantilla" ? selectedItem.itemNo : selectedItem.itemNo}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-bold text-[#0038A8] uppercase tracking-wide">
                            {selectedItem.position}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedItem(null)}
                      className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-auto p-6 bg-slate-50/50 custom-scrollbar">
                    <div className="space-y-6">
                      <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#0038A8] flex items-center justify-center mr-1">
                          <History className="w-3.5 h-3.5" />
                        </div>
                        Item Lifecycle History
                      </h4>
                      
                      <div className="relative ml-2 space-y-4">
                        {selectedItem.history.map((log, idx) => (
                          <div key={idx} className="relative flex gap-4">
                            {/* Vertical Line Connector */}
                            {idx !== selectedItem.history.length - 1 && (
                              <div className="absolute left-[13px] top-[24px] h-[calc(100%+8px)] w-[2px] bg-slate-200" />
                            )}
                            
                            {/* Status Node */}
                            <div className="relative z-10 w-7 h-7 rounded-full flex items-center justify-center shadow-sm border-2 bg-white border-blue-600 text-blue-600 shrink-0 mt-0.5">
                              {log.status === 'completed' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                              )}
                            </div>
                            
                            {/* Log Details */}
                            <div className="flex-1 bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                              <div className="flex justify-between items-start mb-1">
                                <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight">
                                  {log.action}
                                </p>
                                <span className="text-[10px] font-bold text-slate-400">
                                  {log.date}
                                </span>
                              </div>
                              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                                {log.details}
                              </p>
                              {log.occupant && (
                                <div className="mt-2.5 pt-2 border-t border-slate-50 flex items-center gap-1.5">
                                  <User className="w-3 h-3 text-slate-400" />
                                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600">
                                    Occupant: {log.occupant}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end shrink-0">
                    <button 
                      onClick={() => setSelectedItem(null)}
                      className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all shadow-sm"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </div>
            </AnimatePresence>,
            document.body
          )}
        </motion.div>
      )}
    </div>
  );
}
