import React from "react";
import { createPortal } from "react-dom";
import { X, History, User, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ItemHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemNumber: string;
}

export function ItemHistoryModal({ isOpen, onClose, itemNumber }: ItemHistoryModalProps) {
  // Generate random deterministic history based on item number string length
  // In a real app, this would be an API call
  const generateHistory = (itemNo: string) => {
    const isNew = itemNo.includes("2024") || itemNo.length % 2 === 0; // arbitrary logic for mock data
    
    if (isNew) {
      return {
        isNew: true,
        history: [
          { 
            id: 1, 
            status: "Newly Created", 
            holder: "Unfilled", 
            date: "Jan 15, 2024 - Present",
            remarks: "Newly created plantilla item for upcoming hiring."
          }
        ]
      };
    }

    return {
      isNew: false,
      history: [
        { 
          id: 1, 
          status: "Active", 
          holder: "Cruz, Maria L.", 
          date: "Mar 12, 2020 - Present",
          remarks: "Current holder. Promoted from Teacher II."
        },
        { 
          id: 2, 
          status: "Resigned", 
          holder: "Santos, Jose P.", 
          date: "Jun 05, 2016 - Feb 28, 2020",
          remarks: "Resigned to work abroad."
        },
        { 
          id: 3, 
          status: "Transferred", 
          holder: "Reyes, Ana M.", 
          date: "Jan 10, 2010 - May 15, 2016",
          remarks: "Transferred to different region."
        }
      ]
    };
  };

  const { isNew, history } = generateHistory(itemNumber);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
          onClick={onClose} 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200 shadow-sm">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-lg tracking-tight leading-none">Item History</h3>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">{itemNumber}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-lg transition-all text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto">
            {isNew && (
               <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-4 mb-6">
                 <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                 <div>
                   <h4 className="text-amber-800 font-bold text-sm">New Item Number</h4>
                   <p className="text-amber-700/80 text-xs mt-1 leading-relaxed">This plantilla item was recently created and has no past holders yet.</p>
                 </div>
               </div>
            )}

            <div className="relative pl-4 space-y-8 before:absolute before:inset-y-0 before:left-4 before:w-[2px] before:bg-slate-100 mb-4">
              {history.map((record, index) => (
                <div key={record.id} className="relative">
                  <div className={`absolute -left-6 w-4 h-4 rounded-full border-[3px] border-white ${index === 0 ? "bg-blue-500 ring-4 ring-blue-50" : "bg-slate-200"} z-10 flex-shrink-0 mt-1 shadow-sm`} />
                  <div className="pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{record.date}</span>
                      <span className={`text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md ${
                        record.status === "Active" || record.status === "Newly Created" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                        record.status === "Resigned" ? "bg-rose-50 text-rose-700 border border-rose-100" :
                        "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}>
                        {record.status}
                      </span>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] mt-2">
                       <div className="flex flex-col gap-1">
                         <span className="text-sm font-black text-slate-800 flex items-center gap-2">
                           <User className="w-3.5 h-3.5 text-slate-400" />
                           {record.holder}
                         </span>
                         <span className="text-xs text-slate-500 pt-2 border-t border-slate-50 mt-1">{record.remarks}</span>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
