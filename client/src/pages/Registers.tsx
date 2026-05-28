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
  const [typeFilter, setTypeFilter] = useState<"All" | "Plantilla" | "Non-Plantilla">("All");
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const [plantillaRes, nonPlantillaRes] = await Promise.all([
          fetch("/api/plantilla-items", { headers: { Accept: "application/json" } }),
          fetch("/api/records/non-plantilla", { headers: { Accept: "application/json" } })
        ]);
        
        const plantillaData = await plantillaRes.json().catch(() => ({}));
        const nonPlantillaData = await nonPlantillaRes.json().catch(() => ({}));

        let combined: any[] = [];

        if (plantillaData && Array.isArray(plantillaData.data)) {
          combined = combined.concat(plantillaData.data.map((item: any) => ({ ...item, recordType: "Plantilla" })));
        } else if (Array.isArray(plantillaData)) {
          combined = combined.concat(plantillaData.map((item: any) => ({ ...item, recordType: "Plantilla" })));
        }

        const npRecords = nonPlantillaData && Array.isArray(nonPlantillaData.data) ? nonPlantillaData.data : (Array.isArray(nonPlantillaData) ? nonPlantillaData : []);
        const mappedNp = npRecords.map((np: any) => ({
          id: `np-${np.id}`,
          item_number: "N/A",
          position_title: np.nature_of_work || "Non-Plantilla Personnel",
          salary_grade: "N/A",
          status: np.status_of_engagement || "Active",
          school_name: np.station_id || np.office_assignment || "N/A",
          recordType: "Non-Plantilla",
          employee: {
            id: np.id,
            employee_id: np.employee_id,
            first_name: np.first_name,
            last_name: np.last_name,
            full_name: `${np.last_name}, ${np.first_name}`
          }
        }));
        
        combined = combined.concat(mappedNp);
        setItems(combined);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.position_title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All" || item.recordType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 h-full flex flex-col">
      {loading ? (
        <div className="space-y-6 flex flex-col h-full fade-in duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 sm:mt-2">
            <div className="space-y-2.5">
              <Skeleton className="h-8 w-64 rounded-xl shadow-sm" />
              <Skeleton className="h-4 w-72 rounded-lg opacity-60" />
            </div>
            <Skeleton className="h-[42px] w-32 rounded-xl shadow-sm" />
          </div>
          <div className="flex-1 rounded-[20px] bg-white border border-slate-200/80 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
             <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6 shrink-0 bg-slate-50">
               <Skeleton className="h-[52px] w-full max-w-lg rounded-2xl shadow-sm" />
               <Skeleton className="h-[48px] w-full sm:w-[280px] rounded-2xl shadow-sm" />
             </div>
             <div className="flex-1 overflow-auto p-0">
               <table className="w-full text-left text-sm border-separate border-spacing-0">
                 <thead>
                  <tr className="bg-[#fcfdfd] border-b border-slate-200 shadow-sm">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <th key={i} className="px-6 py-4"><Skeleton className="h-4 w-24 rounded-md" /></th>
                    ))}
                  </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {Array.from({ length: 8 }).map((_, i) => (
                     <tr key={i}>
                       <td className="px-6 py-5"><Skeleton className="h-5 w-40 rounded-lg" /></td>
                       <td className="px-6 py-5"><Skeleton className="h-5 w-32 rounded-lg" /></td>
                       <td className="px-6 py-5"><Skeleton className="h-6 w-24 rounded-full" /></td>
                       <td className="px-6 py-5"><Skeleton className="h-5 w-16 rounded-lg" /></td>
                       <td className="px-6 py-5 flex justify-end gap-2">
                         <Skeleton className="h-8 w-8 rounded-lg" />
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      ) : (
        <div className="contents">
          <div className="flex flex-col gap-6 shrink-0 sm:mt-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                  Registers
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
                  placeholder="Search position..."
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
                  onClick={() => setTypeFilter("Plantilla")}
                  className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                    typeFilter === "Plantilla" ? "bg-blue-50 text-[#0038A8]" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Plantilla
                </button>
                <button
                  onClick={() => setTypeFilter("Non-Plantilla")}
                  className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                    typeFilter === "Non-Plantilla" ? "bg-amber-50 text-amber-700" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
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
                    <th className="px-6 py-4">Item No & Position</th>
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
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-mono text-[10px] font-bold text-[#0038A8] bg-blue-50 px-2 py-0.5 rounded border border-blue-100 w-fit mb-1.5 align-middle tracking-tight">{item.item_number}</span>
                            <span className="font-bold text-slate-900 tracking-tight text-[13px]">{item.position_title}</span>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1">
                              {item.school_name || item.office_assignment || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider inline-flex items-center border ${
                            item.recordType === "Plantilla" 
                              ? "bg-blue-50 text-blue-700 border-blue-100" 
                              : "bg-amber-50 text-amber-700 border-amber-100"
                          }`}>
                            {item.recordType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                           <span className="font-bold text-slate-600">{item.salary_grade !== "N/A" ? `SG ${item.salary_grade}` : "N/A"}</span>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider inline-block border ${
                            item.status === "filled" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                            item.status === "unfilled" ? "bg-rose-50 text-rose-700 border-rose-100" :
                            item.recordType === "Non-Plantilla" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
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
                      <td colSpan={5} className="px-6 py-32 whitespace-normal text-center">
                        <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                          <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
                            <Briefcase className="w-10 h-10 text-slate-200" />
                          </div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase tracking-widest mb-2">No Items Found</h3>
                          <p className="text-sm text-slate-500 leading-relaxed font-medium">There are currently no items matching your search criteria.</p>
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
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6">
                <div
                  onClick={() => setSelectedItem(null)}
                  className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                />
                <div
                  className="relative w-full max-w-lg bg-white rounded-[24px] shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
                >
                  <div className="px-6 py-5 border-b border-slate-100 bg-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                        <Hash className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight uppercase truncate">
                          {selectedItem.position_title}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-bold text-[#0038A8] uppercase tracking-wide">
                            {selectedItem.type === "plantilla" ? "Plantilla" : "Non-Plantilla"}
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
                        {(selectedItem.itemHistories || []).map((log: any, idx: number) => (
                          <div key={idx} className="relative flex gap-4">
                            {/* Vertical Line Connector */}
                            {idx !== (selectedItem.itemHistories || []).length - 1 && (
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
                                  {log.date || log.created_at}
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
                </div>
              </div>,
            document.body
          )}
        </div>
      )}
    </div>
  );
}
