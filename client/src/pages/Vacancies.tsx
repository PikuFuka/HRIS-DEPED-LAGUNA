import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../lib/auth";
import {
  Briefcase,
  Building2,
  MapPin,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import { Skeleton, CardSkeleton } from "../components/ui/Skeleton";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { VacancyDetailsModal } from "../components/VacancyDetailsModal";
import { ItemHistoryModal } from "../components/ItemHistoryModal";

interface Vacancy {
  id: number;
  title: string;
  status: string;
  deadline: string;
  itemNo: string;
  type: "plantilla" | "non-plantilla";
  employmentStatus?: string;
  contractDuration?: string;
  // New detailed fields
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

export default function Vacancies() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingVacancyId, setEditingVacancyId] = useState<number | null>(null);
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [historyItemUrl, setHistoryItemUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newVacancy, setNewVacancy] = useState({
    title: "",
    type: "plantilla" as "plantilla" | "non-plantilla",
    employmentStatus: "Contract of Services",
    contractDuration: "6 Months",
    deadline: "2024-12-31",
    bureauService: "",
    divisionUnit: "",
    salaryGrade: "",
    monthlySalary: "",
    incentives: "",
    jobDescription: "",
    qualificationEducation: "",
    qualificationExperience: "",
    qualificationTraining: "",
    qualificationEligibility: "",
    itemNo: "",
    documentName: ""
  });

  useEffect(() => {
    if (location.state?.openCreateModal) {
      setIsCreateModalOpen(true);
      // Clear location state to avoid re-opening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (isCreateModalOpen || selectedVacancy) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCreateModalOpen, selectedVacancy]);

  const handleSaveVacancy = () => {
    if (!newVacancy.title) {
      toast.error("Position title is required");
      return;
    }

    setIsSaving(true);
    const vacancyData = {
      ...newVacancy,
      status: editingVacancyId ? vacancies.find(v => v.id === editingVacancyId)?.status || "Draft" : "Draft",
      itemNo: newVacancy.itemNo || (newVacancy.type === "plantilla" ? `OSEC-DECSB-ADAS3-${Math.floor(Math.random() * 10000)}-2015` : "N/A")
    };
    
    if (editingVacancyId) {
      // Update existing vacancy
      fetch(`/api/vacancies/${editingVacancyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vacancyData)
      })
        .then(async (res) => {
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || "Failed to update vacancy");
          }
          return res.json();
        })
        .then((updatedVacancy) => {
          setVacancies(vacancies.map(v => v.id === editingVacancyId ? updatedVacancy as Vacancy : v));
          setIsSaving(false);
          closeModal();
          toast.success("Vacancy updated successfully");
        })
        .catch(err => {
          console.error("Update error:", err);
          setIsSaving(false);
          toast.error(err.message || "Failed to update vacancy");
        });
    } else {
      // Create new vacancy
      fetch("/api/vacancies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vacancyData)
      })
        .then(async (res) => {
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || "Failed to create vacancy");
          }
          return res.json();
        })
        .then((createdVacancy) => {
          setVacancies([createdVacancy as Vacancy, ...vacancies]);
          setIsSaving(false);
          closeModal();
          toast.success("Vacancy created successfully");
        })
        .catch(err => {
          console.error("Create error:", err);
          setIsSaving(false);
          toast.error(err.message || "Failed to create vacancy");
        });
    }
  };

  const handleEditVacancy = (vacancy: Vacancy) => {
    setSelectedVacancy(null); // Close details modal first
    setNewVacancy({
      title: vacancy.title,
      type: vacancy.type,
      employmentStatus: vacancy.employmentStatus || "Contract of Services",
      contractDuration: vacancy.contractDuration || "6 Months",
      deadline: vacancy.deadline,
      bureauService: vacancy.bureauService || "",
      divisionUnit: vacancy.divisionUnit || "",
      salaryGrade: vacancy.salaryGrade || "",
      monthlySalary: vacancy.monthlySalary || "",
      incentives: vacancy.incentives || "",
      jobDescription: vacancy.jobDescription || "",
      qualificationEducation: vacancy.qualificationEducation || "",
      qualificationExperience: vacancy.qualificationExperience || "",
      qualificationTraining: vacancy.qualificationTraining || "",
      qualificationEligibility: vacancy.qualificationEligibility || "",
      itemNo: vacancy.itemNo || "",
      documentName: vacancy.documentName || ""
    });
    setEditingVacancyId(vacancy.id);
    setIsCreateModalOpen(true);
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setEditingVacancyId(null);
    setNewVacancy({
      title: "",
      type: "plantilla",
      employmentStatus: "Contract of Services",
      contractDuration: "6 Months",
      deadline: "2024-12-31",
      bureauService: "",
      divisionUnit: "",
      salaryGrade: "",
      monthlySalary: "",
      incentives: "",
      jobDescription: "",
      qualificationEducation: "",
      qualificationExperience: "",
      qualificationTraining: "",
      qualificationEligibility: "",
      itemNo: "",
      documentName: ""
    });
  };

  const updateVacancyStatus = (id: number, status: string) => {
    fetch(`/api/vacancies/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    }).then(() => {
      setVacancies(vacancies.map(v => v.id === id ? { ...v, status } : v));
      toast.success(`Vacancy status updated to ${status}`);
    });
  };

  useEffect(() => {
    setLoading(true);

    fetch("/api/vacancies")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        // Artificial delay for training/demo purposes to show skeletons
        await new Promise(resolve => setTimeout(resolve, 1000));
        return res.json();
      })
      .then((data) => {
        setVacancies(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredVacancies = vacancies.filter((v) => {
    if (
      statusFilter !== "All Status" &&
      v.status.toLowerCase() !== statusFilter.toLowerCase()
    )
      return false;
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      return (
        v.title.toLowerCase().includes(query) ||
        v.itemNo.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filteredVacancies.length / itemsPerPage);
  const paginatedVacancies = filteredVacancies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  if (user?.role !== "hrmo" && user?.role !== "applicant" && user?.role !== "csc") {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-slate-50/50 rounded-[20px] border border-slate-200/80 p-6 shadow-sm animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-rose-100">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">
          Access Restricted
        </h2>
        <p className="text-sm text-slate-500 mb-8 max-w-sm text-center leading-relaxed">
          You do not have the required security clearance to view job vacancies.
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all shadow-sm focus:ring-2 focus:ring-slate-200"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 h-full flex flex-col w-full max-w-7xl mx-auto animate-in fade-in duration-300">
      {loading ? (
        <div className="space-y-6 flex flex-col h-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 sm:mt-2">
            <div className="space-y-2">
              <Skeleton className="h-9 w-48 rounded-xl shadow-sm" />
              <Skeleton className="h-4.5 w-64 rounded-lg opacity-60" />
            </div>
            <Skeleton className="h-11 w-40 rounded-xl shadow-sm" />
          </div>
          <div className="bg-white rounded-[20px] border border-slate-200/80 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] overflow-hidden flex-1 flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-center">
              <Skeleton className="h-12 w-full max-w-2xl rounded-2xl shadow-sm" />
            </div>
            <div className="p-6 bg-slate-50/20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 sm:mt-2">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Vacancies
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            {user?.role === "applicant"
              ? "Discover and apply for opportunities within the Division of Laguna."
              : "Manage available plantilla items and job postings."}
          </p>
        </div>
        {user?.role === "hrmo" && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#0038A8] text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow-[#0038A8]/20 hover:bg-[#002B80] transition-all text-center flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Post New Vacancy
          </button>
        )}
      </div>

      {createPortal(
        <AnimatePresence>
          {isCreateModalOpen && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-hidden">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative z-10"
              >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                      {editingVacancyId ? "Edit Vacancy" : "Post New Vacancy"}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">Fill in the position profile and requirements.</p>
                  </div>
                  <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-slate-400" /> 
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  {!newVacancy.title && (
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3 text-amber-700 text-xs font-semibold animate-pulse">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      Please provide a position title to enable saving.
                    </div>
                  )}
                  {/* Basic Info Section */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0038A8]">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Position Title</label>
                        <input 
                          type="text" 
                          value={newVacancy.title}
                          onChange={(e) => setNewVacancy({...newVacancy, title: e.target.value})}
                          placeholder="e.g. Administrative Assistant III"
                          className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50/50 focus:ring-2 focus:ring-[#0038A8]/20 focus:border-[#0038A8] outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Bureau / Service</label>
                        <input 
                          type="text" 
                          value={newVacancy.bureauService}
                          onChange={(e) => setNewVacancy({...newVacancy, bureauService: e.target.value})}
                          placeholder="e.g. Information and Communications Technology Service"
                          className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50/50 focus:ring-2 focus:ring-[#0038A8]/20 focus:border-[#0038A8] outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Division / Unit</label>
                        <input 
                          type="text" 
                          value={newVacancy.divisionUnit}
                          onChange={(e) => setNewVacancy({...newVacancy, divisionUnit: e.target.value})}
                          placeholder="e.g. Office of the Director"
                          className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50/50 focus:ring-2 focus:ring-[#0038A8]/20 focus:border-[#0038A8] outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Position Profile Section */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0038A8]">Position Profile</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Item Number</label>
                        <input 
                          type="text" 
                          value={newVacancy.itemNo}
                          onChange={(e) => setNewVacancy({...newVacancy, itemNo: e.target.value})}
                          placeholder="e.g. OSEC-DECSB-..."
                          className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50/50 focus:ring-2 focus:ring-[#0038A8]/20 focus:border-[#0038A8] outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Salary Grade</label>
                        <input 
                          type="text" 
                          value={newVacancy.salaryGrade}
                          onChange={(e) => setNewVacancy({...newVacancy, salaryGrade: e.target.value})}
                          placeholder="e.g. 9-1"
                          className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50/50 focus:ring-2 focus:ring-[#0038A8]/20 focus:border-[#0038A8] outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Monthly Salary</label>
                        <input 
                          type="text" 
                          value={newVacancy.monthlySalary}
                          onChange={(e) => setNewVacancy({...newVacancy, monthlySalary: e.target.value})}
                          placeholder="PHP 24,329.00"
                          className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50/50 focus:ring-2 focus:ring-[#0038A8]/20 focus:border-[#0038A8] outline-none transition-all"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Incentives / Bonuses</label>
                        <textarea 
                          value={newVacancy.incentives}
                          onChange={(e) => setNewVacancy({...newVacancy, incentives: e.target.value})}
                          placeholder="e.g. Monthly Personnel Economic Relief Allowance (PERA), Mid-year bonus, Productivity Enhancement Incentive..."
                          className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50/50 focus:ring-2 focus:ring-[#0038A8]/20 focus:border-[#0038A8] outline-none transition-all h-20"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Job Description</label>
                        <textarea 
                          value={newVacancy.jobDescription}
                          onChange={(e) => setNewVacancy({...newVacancy, jobDescription: e.target.value})}
                          placeholder="Describe the key responsibilities and purpose of this position..."
                          className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50/50 focus:ring-2 focus:ring-[#0038A8]/20 focus:border-[#0038A8] outline-none transition-all h-24"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Minimum Qualifications Section */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0038A8]">Minimum Qualifications</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Education</label>
                        <textarea 
                          value={newVacancy.qualificationEducation}
                          onChange={(e) => setNewVacancy({...newVacancy, qualificationEducation: e.target.value})}
                          placeholder="e.g. Completion of 2 years of studies in college (prior to 2018) OR Completion of Grade 12/Senior High School (starting 2016)*"
                          className="w-full text-[13px] border border-slate-200 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-[#0038A8]/20 outline-none h-16"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Experience</label>
                        <textarea 
                          value={newVacancy.qualificationExperience}
                          onChange={(e) => setNewVacancy({...newVacancy, qualificationExperience: e.target.value})}
                          placeholder="e.g. 1 year of relevant experience"
                          className="w-full text-[13px] border border-slate-200 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-[#0038A8]/20 outline-none h-16"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Training</label>
                        <textarea 
                          value={newVacancy.qualificationTraining}
                          onChange={(e) => setNewVacancy({...newVacancy, qualificationTraining: e.target.value})}
                          placeholder="e.g. 4 hours of relevant training"
                          className="w-full text-[13px] border border-slate-200 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-[#0038A8]/20 outline-none h-16"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Eligibility</label>
                        <textarea 
                          value={newVacancy.qualificationEligibility}
                          onChange={(e) => setNewVacancy({...newVacancy, qualificationEligibility: e.target.value})}
                          placeholder="e.g. Career Service (Subprofessional) First Level Eligibility"
                          className="w-full text-[13px] border border-slate-200 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-[#0038A8]/20 outline-none h-16"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Document Upload Section */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0038A8]">Full Vacancy Document</h4>
                    <div className="relative group/upload">
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setNewVacancy({...newVacancy, documentName: file.name});
                        }}
                      />
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 group-hover/upload:border-[#0038A8]/30 group-hover/upload:bg-blue-50/30 transition-all">
                        <Plus className="w-8 h-8 text-slate-300 mb-2 group-hover/upload:text-[#0038A8] transition-colors" />
                        <p className="text-sm font-bold text-slate-600 group-hover/upload:text-[#0038A8]">
                          {newVacancy.documentName || "Upload detailed vacancy report (PDF)"}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Select file to attach to this posting</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Options */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Personnel Category</label>
                      <div className="flex p-1 bg-slate-100 rounded-xl">
                        <button 
                          onClick={() => setNewVacancy({...newVacancy, type: "plantilla"})}
                          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all uppercase tracking-widest ${newVacancy.type === 'plantilla' ? 'bg-white text-[#0038A8] shadow-sm' : 'text-slate-400'}`}
                        >
                          Plantilla
                        </button>
                        <button 
                          onClick={() => setNewVacancy({...newVacancy, type: "non-plantilla"})}
                          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all uppercase tracking-widest ${newVacancy.type === 'non-plantilla' ? 'bg-white text-[#0038A8] shadow-sm' : 'text-slate-400'}`}
                        >
                          Non-Plantilla
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Application Deadline</label>
                      <input 
                        type="date" 
                        value={newVacancy.deadline}
                        onChange={(e) => setNewVacancy({...newVacancy, deadline: e.target.value})}
                        className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50/50 focus:ring-2 focus:ring-[#0038A8]/20 focus:border-[#0038A8] outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4 shrink-0">
                  <button 
                    onClick={closeModal}
                    className="flex-1 py-3 text-sm font-bold text-slate-600 hover:bg-white hover:text-slate-900 transition-all rounded-xl border border-transparent hover:border-slate-200 shadow-sm"
                  >
                    Discard Changes
                  </button>
                  <button 
                    onClick={handleSaveVacancy}
                    disabled={!newVacancy.title || isSaving}
                    className="flex-1 py-3 text-sm font-bold bg-[#0038A8] text-white rounded-xl hover:bg-[#002B80] transition-all shadow-lg shadow-blue-900/10 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      editingVacancyId ? "Save Changes" : "Confirm & Create Posting"
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <AnimatePresence>
        {selectedVacancy && (
          <VacancyDetailsModal
            vacancy={selectedVacancy}
            onClose={() => setSelectedVacancy(null)}
            userRole={user?.role}
            onApply={(v) => {
              setSelectedVacancy(null);
              toast.success(`Application started for ${v.title}`);
            }}
            onEdit={(v) => {
              handleEditVacancy(v);
            }}
          />
        )}
      </AnimatePresence>

      {/* Existing Search and Filter UI */}
      <div className="glass-card flex-1 flex flex-col overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] rounded-[20px] border border-slate-200/80 bg-white">
        <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-center items-center gap-6 shrink-0 bg-slate-50">
          <div className="relative w-full max-w-2xl group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3 text-slate-400 group-focus-within:text-[#0038A8] transition-colors">
              <Search className="w-5 h-5" />
              <div className="w-px h-4 bg-slate-200 group-focus-within:bg-[#0038A8]/20 transition-colors"></div>
            </div>
            <input
              type="text"
              placeholder="Search by position, item number, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-15 pr-6 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-base font-semibold shadow-sm focus:outline-none focus:border-[#0038A8]/30 focus:ring-8 focus:ring-[#0038A8]/5 transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex w-full sm:w-auto shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-44 text-sm font-black text-slate-700 border-2 border-slate-100 rounded-2xl px-5 py-3.5 bg-white focus:outline-none focus:ring-8 focus:ring-[#0038A8]/5 focus:border-[#0038A8]/20 shadow-sm transition-all hover:bg-slate-50 cursor-pointer uppercase tracking-widest"
            >
              <option>All Status</option>
              <option>Published</option>
              <option>Pending CSC</option>
              <option>Draft</option>
              <option>Closed</option>
            </select>
          </div>
        </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
                {paginatedVacancies.map((vacancy, index) => (
                  <div
                    key={vacancy.id}
                    onClick={() => setSelectedVacancy(vacancy)}
                    className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#0038A8]/40 hover:shadow-lg hover:shadow-[#0038A8]/5 hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col h-full relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50/50 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 pr-4">
                        <div className="flex gap-2 mb-2">
                          <span className="inline-block px-2.5 py-1 bg-blue-50 text-[#0038A8] rounded-[6px] text-[10px] font-bold uppercase tracking-wider">
                            {vacancy.status === "Published" ? "Hiring" : vacancy.status}
                          </span>
                          <span className={`inline-block px-2.5 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-wider ${
                            vacancy.type === 'plantilla' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {vacancy.type}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#0038A8] transition-colors tracking-tight leading-tight">
                          {vacancy.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-3 mb-6 mt-1">
                      {vacancy.type === 'plantilla' ? (
                        <div className="flex items-center text-[13px] text-slate-600 font-medium bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                          <Briefcase className="w-4 h-4 mr-3 text-slate-400" />
                          <div className="flex justify-between w-full items-center">
                            <span>Item No.</span>
                            <span 
                              onClick={(e) => {
                                e.stopPropagation();
                                setHistoryItemUrl(vacancy.itemNo || "");
                              }}
                              className="font-mono text-[12px] font-bold text-slate-700 bg-white border border-slate-200 shadow-sm px-2 py-0.5 rounded cursor-pointer hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all select-none"
                            >
                              {vacancy.itemNo}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex flex-col gap-1 p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                            <div className="flex justify-between text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                              <span>Status</span>
                              <span>Duration</span>
                            </div>
                            <div className="flex justify-between text-[13px] font-bold text-slate-700">
                              <span>{vacancy.employmentStatus || 'COS'}</span>
                              <span>{vacancy.contractDuration || '6 Months'}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center text-[13px] text-slate-600 font-medium px-1">
                        <Building2 className="w-4 h-4 mr-3 text-slate-400" />
                        Division of Laguna
                      </div>
                      <div className="flex items-center text-[13px] text-slate-600 font-medium px-1">
                        <MapPin className="w-4 h-4 mr-3 text-slate-400" />
                        Laguna, Philippines
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-5 flex justify-between items-center mt-auto relative z-10">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-0.5">
                          Deadline
                        </span>
                        <span className="text-slate-800 text-sm font-semibold">
                          {vacancy.deadline}
                        </span>
                      </div>
                      {user?.role === "applicant" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVacancy(vacancy);
                          }}
                          className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm shadow-sm group-hover:bg-[#0038A8] group-hover:text-white transition-all duration-300"
                        >
                          View & Apply
                        </button>
                      ) : user?.role === "hrmo" ? (
                        <div className="flex items-center gap-2">
                          {vacancy.status === "Draft" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateVacancyStatus(vacancy.id, "Pending CSC");
                              }}
                              className="px-3 py-1.5 bg-blue-100 text-[#0038A8] font-bold rounded-lg text-[11px] shadow-sm hover:bg-[#0038A8] hover:text-white transition-all"
                            >
                              Submit to CSC FO
                            </button>
                          )}
                          {vacancy.status === "Pending CSC" && (
                            <div className="px-3 py-1.5 bg-amber-50 text-amber-600 font-bold rounded-lg text-[11px] border border-amber-100">
                              Awaiting Publication
                            </div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditVacancy(vacancy);
                            }}
                            className="p-1.5 border border-slate-200 text-slate-600 bg-white font-medium rounded-lg hover:border-[#0038A8]/30 hover:bg-blue-50 hover:text-[#0038A8] transition-all shadow-sm"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      ) : user?.role === "csc" ? (
                        <div className="flex items-center gap-2">
                          {vacancy.status === "Pending CSC" ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateVacancyStatus(vacancy.id, "Published");
                              }}
                              className="px-4 py-2 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs shadow-sm hover:bg-emerald-600 hover:text-white transition-all"
                            >
                              Publish to Bulletin
                            </button>
                          ) : vacancy.status === "Published" ? (
                            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 font-bold rounded-lg text-[11px] border border-emerald-100">
                              Published
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}

                {paginatedVacancies.length === 0 && (
                  <div className="col-span-full py-32 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-100 rounded-[32px] bg-slate-50 transition-all">
                    <div className="w-24 h-24 mb-8 rounded-full bg-white flex items-center justify-center shadow-xl shadow-slate-200/50 border border-slate-100">
                      <Briefcase className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase tracking-widest">
                      No Vacancies Found
                    </h3>
                    <p className="text-base text-slate-500 max-w-lg mx-auto mb-10 leading-relaxed font-medium px-6">
                      {searchTerm || statusFilter !== "All Status"
                        ? "We couldn't find any vacancies matching your search criteria. Try adjusting your filters or clearing your search."
                        : "There are currently no open vacancies in the system. When new plantilla items or job postings are created, they will appear here."}
                    </p>
                    {user?.role === "hrmo" && !searchTerm && statusFilter === "All Status" && (
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-6 py-3 bg-[#0038A8] text-white rounded-xl text-sm font-bold shadow-sm hover:shadow-[#0038A8]/20 hover:bg-[#002B80] transition-all flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Create New Vacancy
                      </button>
                    )}
                    {user?.role === "hrmo" && (searchTerm || statusFilter !== "All Status") && (
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("All Status");
                        }}
                        className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:shadow-md hover:border-slate-300 hover:bg-slate-50 transition-all"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                )}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
              <p className="text-sm text-slate-500 font-medium tracking-wide">
                Showing{" "}
                <span className="font-semibold text-slate-900">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-900">
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredVacancies.length,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-900">
                  {filteredVacancies.length}
                </span>{" "}
                vacancies
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex flex-wrap items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-sm font-bold transition-all shadow-sm ${currentPage === page ? "bg-[#0038A8] text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      </motion.div>
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
