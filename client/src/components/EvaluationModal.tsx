import { motion } from "motion/react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { X, ClipboardList, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

interface Application {
  id: number;
  status: string;
  applicant: {
    first_name: string;
    last_name: string;
    type: string;
  };
  vacancy: {
    title: string;
  };
}

interface EvaluationModalProps {
  application: Application | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EvaluationModal({ application, onClose, onSuccess }: EvaluationModalProps) {
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [scores, setScores] = useState({
    education: 0,
    experience: 0,
    training: 0,
    eligibility: 0,
  });

  if (!application) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      application_id: application.id,
      evaluation_type: "Initial Screening",
      remarks: remarks,
      scores: [
        { criteria_id: 1, score: scores.education }, // Assuming 1 is Education
        { criteria_id: 2, score: scores.experience }, // 2 Experience
        { criteria_id: 3, score: scores.training }, // 3 Training
        { criteria_id: 4, score: scores.eligibility }, // 4 Eligibility
      ]
    };

    fetch("/api/evaluations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Failed to submit evaluation");
        }
        return res.json();
      })
      .then(() => {
        toast.success(`Evaluation submitted for ${application.applicant.first_name}`);
        onSuccess();
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + Number(b), 0);

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
        className="bg-white rounded-[24px] shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col relative z-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#0038A8] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">HRMPSB Evaluation Form</h3>
              <p className="text-xs text-white/70">
                Evaluating {application.applicant.first_name} {application.applicant.last_name}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              Scores are recorded securely. Please ensure you have reviewed the applicant's attached documents before submitting this evaluation.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Criteria Breakdown</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Education (max 25)</label>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={scores.education}
                  onChange={e => setScores({ ...scores, education: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Experience (max 25)</label>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={scores.experience}
                  onChange={e => setScores({ ...scores, experience: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Training (max 25)</label>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={scores.training}
                  onChange={e => setScores({ ...scores, training: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Eligibility/Potential (max 25)</label>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={scores.eligibility}
                  onChange={e => setScores({ ...scores, eligibility: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-100 rounded-lg mt-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Score</span>
              <span className="text-xl font-black text-[#0038A8]">{totalScore} / 100</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Remarks (Optional)</label>
            <textarea
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24"
              placeholder="Add any notes from the interview or deliberation..."
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-[#0038A8] text-white font-bold rounded-xl hover:bg-[#002B80] transition-colors text-sm shadow-lg shadow-blue-900/20 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Evaluation"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
}
