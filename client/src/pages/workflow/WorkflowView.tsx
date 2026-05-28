import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../lib/auth";
import {
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  ChevronRight,
  Check,
  Plus,
  Trash2,
  X,
  FileCheck2,
  Megaphone,
  Eye,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { WORKFLOW_STEPS, getStepByNumber } from "../../lib/constants";
import { Skeleton } from "../../components/ui/Skeleton";
import { VacancyDetailsModal } from "../../components/VacancyDetailsModal";

export default function WorkflowView() {
  const { id } = useParams();
  const { user } = useAuth();

  const [application, setApplication] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState<any>(null);

  const stepContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/applications/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Not found");
        // Artificial delay for training/demo purposes to show skeletons
        await new Promise(resolve => setTimeout(resolve, 1000));
        return res.json();
      })
      .then((data) => {
        setApplication(data);
        setCurrentStep(data.step);
        setActiveTab(data.step);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load application");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    // Center the active step if possible
    if (stepContainerRef.current && !loading) {
      const activeElement = stepContainerRef.current.querySelector(
        '[data-active="true"]',
      ) as HTMLElement;
      const container = stepContainerRef.current.parentElement;
      if (activeElement && container) {
        const containerWidth = container.clientWidth;
        const elementLeft = activeElement.offsetLeft;
        const elementWidth = activeElement.clientWidth;
        container.scrollTo({
          left: elementLeft - containerWidth / 2 + elementWidth / 2,
          behavior: "smooth",
        });
      }
    }
  }, [activeTab, currentStep, loading]);

  const advanceStep = () => {
    if (currentStep < 15) {
      const nextStep = currentStep + 1;
      fetch(`/api/applications/${id}/advance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toStep: nextStep }),
      })
        .then((res) => res.json())
        .then((data) => {
          setCurrentStep(nextStep);
          setActiveTab(nextStep);
          setApplication(data);
          toast.success(`Advanced to Step ${nextStep}`);
        })
        .catch(() => toast.error("Failed to advance step"));
    }
  };

  const getStepStatus = (stepNo: number) => {
    if (stepNo < currentStep) return "completed";
    if (stepNo === currentStep) return "current";
    return "pending";
  };

  const activeStepData = WORKFLOW_STEPS.find((s) => s.step === activeTab);
  const canActOnCurrentStep = activeStepData?.role === user?.role;

  if (!application && !loading) {
    return (
      <div className="p-12 text-center text-gray-500">
        Application not found.
      </div>
    );
  }

  const { role, step } = application || {};
  const activeStep = activeTab;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col h-full space-y-8 min-w-0 animate-in fade-in duration-300">
      <AnimatePresence>
        {selectedVacancy && (
          <VacancyDetailsModal
            vacancy={selectedVacancy}
            onClose={() => setSelectedVacancy(null)}
            userRole={user?.role}
          />
        )}
      </AnimatePresence>

      {loading ? (
        <div className="space-y-6 flex flex-col h-full fade-in duration-300">
          <section className="glass-card p-6 md:p-8 shrink-0 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] rounded-[20px] border border-slate-200/80 min-w-0 bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-48 rounded-lg opacity-60" />
                <Skeleton className="h-5 w-72 rounded-lg" />
              </div>
              <Skeleton className="h-[34px] w-32 rounded-lg" />
            </div>
            
            <div className="relative pt-2 pb-6 px-4 flex justify-between items-center overflow-hidden">
              <div className="absolute h-1.5 bg-slate-100 rounded-full left-10 right-10 top-[26px] z-0"></div>
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3 shrink-0 z-10">
                  <Skeleton variant="circular" className="w-10 h-10 shadow-sm border-[3px] border-white" />
                  <Skeleton className="h-3 w-16 rounded-md opacity-60" />
                </div>
              ))}
            </div>
          </section>

          <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
            <div className="bg-white flex-1 rounded-[20px] border border-slate-200/80 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-2.5">
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <Skeleton className="h-7 w-64 rounded-xl" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-32 rounded-xl" />
                  <Skeleton className="h-10 w-32 rounded-xl" />
                </div>
              </div>
              <div className="flex-1 p-6 md:p-8 bg-slate-50/30 overflow-hidden flex gap-6">
                <div className="w-full max-w-[340px] flex-shrink-0 flex flex-col gap-4">
                  <Skeleton className="h-12 w-full rounded-2xl shadow-sm" />
                  <Skeleton className="h-40 w-full rounded-[20px] shadow-sm" />
                  <Skeleton className="h-32 w-full rounded-[20px] shadow-sm" />
                </div>
                <div className="w-full max-w-[340px] flex-shrink-0 flex flex-col gap-4 hidden sm:flex">
                  <Skeleton className="h-12 w-full rounded-2xl shadow-sm" />
                  <Skeleton className="h-48 w-full rounded-[20px] shadow-sm" />
                </div>
                <div className="w-full max-w-[340px] flex-shrink-0 flex flex-col gap-4 hidden xl:flex">
                  <Skeleton className="h-12 w-full rounded-2xl shadow-sm" />
                  <Skeleton className="h-36 w-full rounded-[20px] shadow-sm" />
                  <Skeleton className="h-40 w-full rounded-[20px] shadow-sm" />
                </div>
              </div>
            </div>
            <div className="w-80 shrink-0 bg-white border border-slate-200/80 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] rounded-[20px] flex flex-col overflow-hidden hidden lg:flex">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <Skeleton className="h-5 w-32 rounded-md" />
              </div>
              <div className="p-6 space-y-6 flex-1 overflow-auto">
                <Skeleton className="h-24 w-full rounded-2xl shadow-sm" />
                <Skeleton className="h-24 w-full rounded-2xl shadow-sm" />
                <Skeleton className="h-24 w-full rounded-2xl shadow-sm" />
                <Skeleton className="h-24 w-full rounded-2xl shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      ) : application ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="contents"
        >
          {/* Header Profile */}
          <section className="glass-card p-6 md:p-8 shrink-0 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] rounded-[20px] border border-slate-200/80 min-w-0 bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-3">
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-500 tracking-widest mb-1.5">
                  Recruitment Lifecycle Pipeline
                </h3>
                <p className="text-sm font-medium text-slate-400">
                  13-Step Application Process (CSC-Compliant)
                </p>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                <div
                  className={`w-2 h-2 rounded-full ${Math.ceil(currentStep / 3) === 1
                    ? "bg-blue-500"
                    : Math.ceil(currentStep / 3) === 2
                      ? "bg-rose-500"
                      : Math.ceil(currentStep / 3) === 3
                        ? "bg-emerald-500"
                        : Math.ceil(currentStep / 3) === 4
                          ? "bg-violet-500"
                          : "bg-amber-500"
                    } animate-pulse`}
                ></div>
                <span className="text-[11px] text-slate-700 font-bold tracking-wide uppercase">
                  Phase {Math.ceil(currentStep / 3)}:{" "}
                  {WORKFLOW_STEPS[currentStep - 1]?.phase}
                </span>
              </div>
            </div>

            {/* Stepper Strip */}
            <div className="relative">
              <div className="w-full overflow-x-auto custom-scrollbar pb-6 pt-2">
                <div
                  ref={stepContainerRef}
                  className="relative px-4 py-4 flex justify-between items-center min-w-[1200px]"
                >
                  {/* Connecting Line Background */}
                  <div className="absolute h-1.5 bg-slate-100 rounded-full left-10 right-10 top-[26px] z-0"></div>

                  {/* Completed Line Fill - Gradient */}
                  {
                    (() => {
                      const visibleSteps = WORKFLOW_STEPS.filter(s => s.step >= 3);
                      const visibleIndex = Math.max(0, currentStep - 3);
                      const ratio = visibleIndex / (visibleSteps.length - 1);
                      return (
                        <div
                          className="absolute h-1.5 left-10 top-[26px] z-0 transition-all rounded-full duration-1000 ease-in-out bg-gradient-to-r from-blue-600 via-violet-500 to-rose-500 shadow-sm"
                          style={{
                            width: `calc(${ratio} * 100% - 5rem * ${ratio})`,
                          }}
                        ></div>
                      );
                    })()
                  }

                  {WORKFLOW_STEPS.filter(s => s.step >= 3).map((step, index) => {
                    const displayStep = index + 1;
                    const status = getStepStatus(step.step);
                    const phaseIndex = Math.ceil(step.step / 3);

                    let phaseColor = "blue";
                    if (phaseIndex === 1) phaseColor = "blue";
                    else if (phaseIndex === 2) phaseColor = "rose";
                    else if (phaseIndex === 3) phaseColor = "emerald";
                    else if (phaseIndex === 4) phaseColor = "violet";
                    else phaseColor = "amber";

                    const isCompleted = status === "completed";
                    const isCurrent = status === "current";

                    // Constructing color classes dynamically for Tailwind (safe list or explicit)
                    const getColors = () => {
                      if (status === "completed") {
                        if (phaseColor === "blue")
                          return "bg-blue-500 border-blue-500 text-white shadow-blue-500/30";
                        if (phaseColor === "rose")
                          return "bg-rose-500 border-rose-500 text-white shadow-rose-500/30";
                        if (phaseColor === "emerald")
                          return "bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/30";
                        if (phaseColor === "violet")
                          return "bg-violet-500 border-violet-500 text-white shadow-violet-500/30";
                        return "bg-amber-500 border-amber-500 text-white shadow-amber-500/30";
                      } else if (status === "current") {
                        if (phaseColor === "blue")
                          return "bg-blue-600 border-blue-600 text-white ring-4 ring-blue-500/20 shadow-lg";
                        if (phaseColor === "rose")
                          return "bg-rose-600 border-rose-600 text-white ring-4 ring-rose-500/20 shadow-lg";
                        if (phaseColor === "emerald")
                          return "bg-emerald-600 border-emerald-600 text-white ring-4 ring-emerald-500/20 shadow-lg";
                        if (phaseColor === "violet")
                          return "bg-violet-600 border-violet-600 text-white ring-4 ring-violet-500/20 shadow-lg";
                        return "bg-amber-600 border-amber-600 text-white ring-4 ring-amber-500/20 shadow-lg";
                      }
                      return "bg-white border-slate-200 text-slate-400 hover:border-slate-300";
                    };

                    const getLabelColor = () => {
                      if (step.step === activeTab) {
                        if (phaseColor === "blue")
                          return "text-blue-700 font-extrabold";
                        if (phaseColor === "rose")
                          return "text-rose-700 font-extrabold";
                        if (phaseColor === "emerald")
                          return "text-emerald-700 font-extrabold";
                        if (phaseColor === "violet")
                          return "text-violet-700 font-extrabold";
                        return "text-amber-700 font-extrabold";
                      }
                      if (isCompleted) {
                        return "text-slate-700 font-bold";
                      }
                      return "text-slate-400 font-medium";
                    };

                    return (
                      <div
                        key={step.step}
                        className="flex flex-col items-center cursor-pointer group w-20"
                        onClick={() => setActiveTab(step.step)}
                        data-active={step.step === activeTab}
                      >
                        {/* Circle Node Container */}
                        <div
                          className={`relative flex items-center justify-center transition-all duration-300 ${isCurrent ? "transform scale-110 mb-1" : "mb-0"}`}
                        >
                          {/* Active Tab Indicator Ring */}
                          {step.step === activeTab && !isCurrent && (
                            <div className="absolute inset-0 rounded-full ring-2 ring-slate-300 ring-offset-2 scale-110 transition-all"></div>
                          )}

                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px] border-2 relative z-10 transition-colors duration-300 ${getColors()}`}
                          >
                            {isCompleted ? (
                              <Check className="w-5 h-5" strokeWidth={3} />
                            ) : (
                              displayStep
                            )}
                          </div>
                        </div>

                        {/* Content Label */}
                        <span
                          className={`text-[11px] mt-3 whitespace-nowrap text-center transition-all leading-tight ${getLabelColor()}`}
                        >
                          {step.title.split(" ").map((word, i) => (
                            <span key={i} className="block">
                              {word}
                            </span>
                          ))}
                        </span>

                        {/* Phase Name Tag (shown below active tab) */}
                        {step.step === activeTab && (
                          <div
                            className={`mt-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${phaseColor === "blue"
                              ? "bg-blue-50 text-blue-600 border-blue-200"
                              : phaseColor === "rose"
                                ? "bg-rose-50 text-rose-600 border-rose-200"
                                : phaseColor === "emerald"
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                  : phaseColor === "violet"
                                    ? "bg-violet-50 text-violet-600 border-violet-200"
                                    : "bg-amber-50 text-amber-600 border-amber-200"
                              }`}
                          >
                            {step.phase}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Main Action Area */}
          <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 md:gap-6">
            {/* Content Details */}
            <div className="glass-card flex-1 flex flex-col overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] rounded-[20px] border border-slate-200/80 bg-white">
              <div className="bg-slate-50 border-b border-slate-100 p-5 md:p-6 shrink-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="uppercase tracking-wider font-semibold text-[10px] text-slate-500 mb-1.5 flex items-center gap-2">
                      Step {activeTab - 2}
                      {activeTab === currentStep && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded text-[9px] font-bold shadow-sm inline-block">
                          ACTIVE PHASE
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-tight flex items-center gap-3">
                      {activeStepData?.title}
                      {application.vacancy && (
                        <button
                          onClick={() => setSelectedVacancy(application.vacancy)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#0038A8] rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 hover:bg-blue-100 transition-all cursor-pointer shadow-sm"
                        >
                          <Info className="w-3 h-3" /> Position Profile
                        </button>
                      )}
                    </h2>
                  </div>
                  <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-600 uppercase tracking-wide shadow-sm min-w-max">
                    Role: {activeStepData?.role}
                  </span>
                </div>
              </div>
              <div className="p-0 flex-1 overflow-auto bg-white">
                <div className="p-5 md:p-8">
                  <StepContent
                    step={activeTab}
                    role={user?.role}
                    activeStep={currentStep}
                    application={application}
                  />
                </div>
              </div>

              {/* Action Footer (Only visible if looking at the active step AND have correct role) */}
              {activeTab === currentStep && (
                <div className="p-4 md:p-5 bg-slate-50 border-t border-slate-100 mt-auto shrink-0 flex flex-col sm:flex-row justify-end gap-3 items-stretch sm:items-center">
                  {!canActOnCurrentStep ? (
                    <p className="text-xs text-slate-500 font-medium mr-auto flex items-center justify-center sm:justify-start gap-2 py-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      Awaiting action from{" "}
                      <span className="font-semibold text-slate-700">
                        {activeStepData?.role?.toUpperCase()}
                      </span>
                    </p>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          toast.success(
                            "Revision requested! Applicant will be notified.",
                          )
                        }
                        className="px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-sm transition-all focus:ring-2 focus:ring-slate-900/10 focus:outline-none"
                      >
                        Request Revision
                      </button>
                      <button
                        onClick={() => setShowConfirm(true)}
                        className="px-8 py-2.5 bg-[#0038A8] text-white rounded-lg text-sm font-bold shadow-sm hover:shadow-[#0038A8]/20 hover:bg-[#002B80] transition-all focus:ring-2 focus:ring-[#0038A8]/20 focus:outline-none flex items-center justify-center gap-2"
                      >
                        Complete Step <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
              {showConfirm && document.body && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowConfirm(false)}
                    className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative z-10"
                  >
                    <div className="p-6">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        Confirm Action
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed mb-6">
                        Are you sure you want to mark{" "}
                        <span className="font-semibold text-slate-700">
                          "{activeStepData?.title}"
                        </span>{" "}
                        as complete? This action will advance the application to
                        the next phase in the recruitment lifecycle.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => setShowConfirm(false)}
                          className="flex-1 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            setShowConfirm(false);
                            advanceStep();
                          }}
                          className="flex-1 px-5 py-2.5 bg-[#0038A8] text-white rounded-xl text-sm font-bold hover:bg-[#002B80] transition-colors flex items-center justify-center gap-2"
                        >
                          Confirm & Proceed
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>,
                document.body,
              )}
            </AnimatePresence>

            {/* Applicant Context Sidebar */}
            <div className="w-72 shrink-0 glass-card flex flex-col hidden lg:flex bg-white border border-slate-200 rounded-2xl">
              <div className="p-4 border-b border-slate-100 shrink-0 bg-slate-50 rounded-t-2xl">
                <h3 className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  Applicant Context
                </h3>
              </div>
              <div className="p-5 overflow-auto flex-1 space-y-6">
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Name
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {application.applicantName}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Target Position
                  </div>
                  <div className="text-sm font-medium text-slate-800">
                    {application.position}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-medium">
                    Status: {application.status}
                  </div>
                </div>

                {application.vacancy && (
                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <div>
                      <div className="flex justify-between items-end mb-1">
                        <div className="text-[10px] font-bold uppercase text-slate-400">
                          Item Number
                        </div>
                        <button
                          onClick={() => setSelectedVacancy(application.vacancy)}
                          className="text-[9px] font-black uppercase text-[#0038A8] hover:underline flex items-center gap-1"
                        >
                          <Eye className="w-2.5 h-2.5" /> Full Details
                        </button>
                      </div>
                      <div className="text-[11px] font-mono font-bold text-[#0038A8] bg-blue-50 px-2 py-1 rounded border border-blue-100 w-fit">
                        {application.vacancy.itemNo}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">
                        Salary Grade
                      </div>
                      <div className="text-xs font-black text-slate-900">
                        Grade {application.vacancy.salaryGrade}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">
                        Job Overview
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed italic line-clamp-3">
                        "{application.vacancy.jobDescription}"
                      </p>
                    </div>
                  </div>
                )}
                <div className="h-px bg-slate-100 w-full"></div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-3">
                    Audit Log
                  </div>
                  <div className="space-y-4">
                    {WORKFLOW_STEPS.filter((s) => s.step >= 3 && s.step <= currentStep)
                      .map((step) => (
                        <div key={step.step} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-2 h-2 rounded-full mt-1.5 ${step.step < currentStep ? "bg-slate-800" : "bg-slate-300"}`}
                            />
                            {step.step < currentStep && (
                              <div className="w-px h-full bg-slate-200 mt-1" />
                            )}
                          </div>
                          <div className="pb-2">
                            <p className="text-[12px] font-medium text-slate-800 leading-tight">
                              {step.title}
                            </p>
                            <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wide font-semibold">
                              {step.step === currentStep
                                ? "In Progress"
                                : "Completed"}
                            </p>
                          </div>
                        </div>
                      ))
                      .reverse()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="p-12 text-center text-gray-500">
          Application not found.
        </div>
      )}
    </div>
  );
}

// Temporary component to show different forms based on step
function StepContent({
  step,
  role,
  activeStep,
  application,
}: {
  step: number;
  role?: string;
  activeStep?: number;
  application?: any;
}) {
  const [personnelType, setPersonnelType] = useState<"plantilla" | "non-plantilla">(
    application?.vacancy?.type || "plantilla"
  );

  interface WorkflowDocument {
    id: string | number;
    title: string;
    date: string;
  }

  useEffect(() => {
    if (application?.vacancy?.type) {
      setPersonnelType(application.vacancy.type);
    }
  }, [application?.vacancy?.type]);

  const docs = application?.documents || [];

  if (step === 3 && role === "applicant") {
    const isEditing = role === "applicant" && activeStep === 3;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Application Letters & Documents
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {isEditing
                ? "Please upload your application letter and mandatory requirements below."
                : "Applicant has submitted the following documents for review."}
            </p>
          </div>
          {isEditing && (
            <button
              onClick={() => toast.info("File upload will connect to backend")}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 transition-all rounded-lg text-sm font-semibold shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add File
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {docs.length === 0 ? (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center text-slate-400 bg-slate-50/50 rounded-[20px] border border-dashed border-slate-200">
              <FileText className="w-8 h-8 mb-3 opacity-20" />
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">No documents uploaded yet.</p>
              <p className="text-xs font-medium text-slate-400 mt-1">Submit required files to proceed with the application.</p>
            </div>
          ) : (
            docs.map((doc: any) => (
              <DocCard
                key={doc.id}
                title={doc.document_type || doc.file_path}
                date={new Date(doc.created_at || new Date()).toLocaleDateString()}
                onRemove={undefined}
              />
            ))
          )}
        </div>
      </div>
    );
  }

  if (step === 3 && role !== "applicant") {
    const isEditing = role === "records" && activeStep === 3;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Receipt of Application & Documents
          </h3>
          <p className="text-sm text-slate-500">
            Records Staff must receive the application letters with pertinent
            documents, check completeness, and stamp as RECEIVED. (10 days or
            more SLA).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              Submitted Documents
            </h4>
            <div className="space-y-3">
              {/* Removed mock DocCard */}
              {/* Removed mock DocCard */}
              {/* Removed mock DocCard */}
              {/* Removed mock DocCard */}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              Records Staff Checklist
            </h4>

            <div className="space-y-4 flex-1">
              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={true}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    1. Receive Application Letter
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    From external/internal clients via the portal.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    2. Check Completeness
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Ensure all mandatory requirements are included.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    3. Stamp 'RECEIVED'
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Acknowledge the applicant's submitted folder.
                  </p>
                </div>
              </label>
            </div>

            {isEditing && (
              <div className="mt-6 pt-4 border-t border-slate-200">
                <button
                  onClick={() =>
                    toast.success(
                      "Application acknowledged and stamped 'RECEIVED'!",
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0038A8] text-white hover:bg-[#002B80] rounded-lg text-sm font-bold shadow-sm transition-all"
                >
                  <FileCheck2 className="w-4 h-4" /> Acknowledge Application
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 4) {
    const isEditing = (role === "adas" || role === "hrmo") && activeStep === 4;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Screening of Qualified Applicants
          </h3>
          <p className="text-sm text-slate-500">
            ADAS / HRMO must conduct initial screening to determine if the
            applicant meets the minimum qualifications. (5 days SLA).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              Applicant Profile & Requirements
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Education
                    </p>
                    <p className="text-sm font-medium text-slate-800">
                      {application?.education || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Experience
                    </p>
                    <p className="text-sm font-medium text-slate-800">
                      {application?.experience || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Eligibility
                    </p>
                    <p className="text-sm font-medium text-slate-800">
                      {application?.eligibility || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Training
                    </p>
                    <p className="text-sm font-medium text-slate-800">
                      {application?.training || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[12px] font-semibold text-slate-700">
                  Verified Documents:
                </p>
                {/* Removed mock DocCard */}
                {/* Removed mock DocCard */}
                {/* Removed mock DocCard */}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              Evaluation & Shortlisting
            </h4>

            <div className="space-y-4 flex-1">
              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    Education Requirement Met
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Applicant's degree aligns with the position.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    Experience Requirement Met
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Sufficient relevant work experience.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    Eligibility Requirement Met
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Valid license or civil service eligibility.
                  </p>
                </div>
              </label>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Remarks / Notes
                </label>
                <textarea
                  className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#0038A8]/20 focus:border-[#0038A8] outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500"
                  rows={3}
                  placeholder="Enter any notes regarding the screening..."
                  disabled={!isEditing}
                />
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 pt-4 border-t border-slate-200 flex gap-3">
                <button
                  onClick={() =>
                    toast.error("Applicant marked as not qualified.")
                  }
                  className="flex-1 px-4 py-2.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 rounded-lg text-sm font-bold shadow-sm transition-all"
                >
                  Reject
                </button>
                <button
                  onClick={() =>
                    toast.success("Applicant has been shortlisted!")
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0038A8] text-white hover:bg-[#002B80] rounded-lg text-sm font-bold shadow-sm transition-all"
                >
                  <FileCheck2 className="w-4 h-4" /> Qualify
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 5) {
    const isEditing = role === "hrmpsb" && activeStep === 5;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Conduct of Initial Evaluation
          </h3>
          <p className="text-sm text-slate-500">
            HRMPSB Sub-Committee evaluates the shortlisted applicants. (5 days
            SLA). Produces the Official list of qualified applicants.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              Evaluation Checklist
            </h4>
            <div className="space-y-4">
              <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-100 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    Education Evaluation Passed
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Applicant meets the required educational attainment for the
                    role.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-100 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    Training Evaluation Passed
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Applicant has the necessary training or certifications.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-100 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    Experience Evaluation Passed
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Applicant holds sufficient years of relevant experience.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-100 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    Performance Evaluation Passed
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Applicant has a satisfactory or higher performance rating.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              Sub-Committee Decision
            </h4>

            <div className="space-y-4 flex-1">
              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    Include in Official List
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Applicant passes the initial evaluation.
                  </p>
                </div>
              </label>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Evaluation Remarks
                </label>
                <textarea
                  className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#0038A8]/20 focus:border-[#0038A8] outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500"
                  rows={4}
                  placeholder="Enter specific feedback from the evaluation..."
                  disabled={!isEditing}
                />
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 pt-4 border-t border-slate-200 flex gap-3">
                <button
                  onClick={() =>
                    toast.error("Applicant excluded from official list.")
                  }
                  className="flex-1 px-4 py-2.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 rounded-lg text-sm font-bold shadow-sm transition-all"
                >
                  Exclude
                </button>
                <button
                  onClick={() =>
                    toast.success("Applicant added to official list!")
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0038A8] text-white hover:bg-[#002B80] rounded-lg text-sm font-bold shadow-sm transition-all"
                >
                  <FileCheck2 className="w-4 h-4" /> Add to Official List
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 6) {
    const isEditing = role === "hrmpsb" && activeStep === 6;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Conduct of Selection Process
          </h3>
          <p className="text-sm text-slate-500">
            HRMPSB administers qualifying examinations and conducts interviews
            (including teaching demos/skills tests for teacher applicants). SLA:
            2+ days.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              Evaluation & Scoring
            </h4>
            <div className="space-y-5">
              <div>
                <label className="block flex justify-between text-sm font-semibold text-slate-700 mb-2">
                  <span>Qualifying Examination Score</span>
                  <span className="text-[#0038A8]">85 / 100</span>
                </label>
                <input
                  type="number"
                  defaultValue={85}
                  disabled={!isEditing}
                  className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#0038A8]/20 focus:border-[#0038A8] outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                  placeholder="Enter exam score..."
                />
              </div>

              <div>
                <label className="block flex justify-between text-sm font-semibold text-slate-700 mb-2">
                  <span>Interview & Demo Score</span>
                  <span className="text-[#0038A8]">92 / 100</span>
                </label>
                <input
                  type="number"
                  defaultValue={92}
                  disabled={!isEditing}
                  className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#0038A8]/20 focus:border-[#0038A8] outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                  placeholder="Enter interview score..."
                />
              </div>

              <div className="pt-4 border-t border-slate-200">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Detailed Remarks
                </label>
                <textarea
                  className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#0038A8]/20 focus:border-[#0038A8] outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                  rows={4}
                  placeholder="Enter specific feedback from the exam and interview..."
                  disabled={!isEditing}
                  defaultValue="Applicant demonstrated strong pedagogical skills during the teaching demo. Communication skills are excellent."
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              Selection Process Checklist
            </h4>

            <div className="space-y-4 flex-1">
              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    1. Administer Qualifying Examination
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Applicant has taken and completed the required exams.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    2. Conduct Interview / Demo
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Applicant was interviewed (including teaching demo/skills
                    test).
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    Final Candidate Assessment
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Candidate is highly recommended based on total scores and
                    deliberation.
                  </p>
                </div>
              </label>
            </div>

            {isEditing && (
              <div className="mt-6 pt-4 border-t border-slate-200 flex gap-3">
                <button
                  onClick={() =>
                    toast.success("Applicant marks updated as failed.")
                  }
                  className="flex-1 px-4 py-2.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 rounded-lg text-sm font-bold shadow-sm transition-all"
                >
                  Fail Applicant
                </button>
                <button
                  onClick={() =>
                    toast.success("Selection scores and remarks finalized!")
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0038A8] text-white hover:bg-[#002B80] rounded-lg text-sm font-bold shadow-sm transition-all"
                >
                  <FileCheck2 className="w-4 h-4" /> Pass Applicant
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 7) {
    const isEditing = (role === "adas" || role === "hrmo") && activeStep === 7;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Consolidation of Scores
          </h3>
          <p className="text-sm text-slate-500">
            ADAS III / HRMO consolidates all rated scoresheets. SLA: 2 Days.
            Produces the consolidated scores of qualified applicants.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              Rated Scoresheets Summary
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-700">
                      Initial Evaluation
                    </span>
                    <span className="text-slate-800 font-bold">-- pts</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-700">
                      Qualifying Exam
                    </span>
                    <span className="text-slate-800 font-bold">-- pts</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-700">
                      Interview & Demo
                    </span>
                    <span className="text-slate-800 font-bold">-- pts</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-800">
                      Total Consolidated Score
                    </span>
                    <span className="text-xl font-black text-[#0038A8]">
                      ---
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[12px] font-bold text-slate-800 uppercase tracking-wide mb-2">
                  Processed Documents:
                </p>
                {/* Removed mock DocCard */}
                {/* Removed mock DocCard */}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              Consolidation Tasks
            </h4>

            <div className="space-y-4 flex-1">
              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    1. Receive Rated Scoresheets
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Verify receipt of all evaluation documents from HRMPSB.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    2. Consolidate Scores
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Tally and compute final consolidated scores.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    3. Generate Consolidated List
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Add applicant to the Draft Consolidated list of qualified
                    applicants.
                  </p>
                </div>
              </label>
            </div>

            {isEditing && (
              <div className="mt-6 pt-4 border-t border-slate-200">
                <button
                  onClick={() =>
                    toast.success(
                      "Scores consolidated and added to provisional list!",
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0038A8] text-white hover:bg-[#002B80] rounded-lg text-sm font-bold shadow-sm transition-all"
                >
                  <FileCheck2 className="w-4 h-4" /> Finalize Consolidation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 8) {
    const isEditing = role === "hrmo" && activeStep === 8;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Preparation of Deliberation Report
          </h3>
          <p className="text-sm text-slate-500">
            HRMO Staff / HRMPSB Secretariat prepares the deliberation report for
            signature of the HRMPSB members. (5 days SLA).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              Deliberation Documents
            </h4>
            <div className="space-y-4">
              <div className="space-y-3">
                <p className="text-[12px] font-bold text-slate-800 uppercase tracking-wide mb-2">
                  Generated Reports:
                </p>
                {/* Removed mock DocCard */}
                {/* Removed mock DocCard */}
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-700">
                    HRMPSB Signatories Required:
                  </p>
                  <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                    <li>Chairperson</li>
                    <li>Member (HRMO)</li>
                    <li>Member (Union Representative)</li>
                    <li>Member (Department Head)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              Deliberation Checklist
            </h4>

            <div className="space-y-4 flex-1">
              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    1. Prepare Deliberation Report
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Review and finalize the auto-generated deliberation report.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    2. Route for Signatures
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Forward the Deliberation Report to HRMPSB members for
                    physical or digital signatures.
                  </p>
                </div>
              </label>
            </div>

            {isEditing && (
              <div className="mt-6 pt-4 border-t border-slate-200">
                <button
                  onClick={() =>
                    toast.success(
                      "Deliberation report prepared and routed for signatures!",
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0038A8] text-white hover:bg-[#002B80] rounded-lg text-sm font-bold shadow-sm transition-all"
                >
                  <FileCheck2 className="w-4 h-4" /> Finalize Output
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 9) {
    const isEditing = role === "hrmpsb" && activeStep === 9;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Reports
          </h3>
          <p className="text-sm text-slate-500">
            HRMPSB reviews the summary of ratings and signs the deliberation
            report. SLA: 2 days.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              Documents for Approval
            </h4>
            <div className="space-y-4">
              <div className="space-y-3">
                <p className="text-[12px] font-bold text-slate-800 uppercase tracking-wide mb-2">
                  Pending Signatures:
                </p>
                {/* Removed mock DocCard */}
                {/* Removed mock DocCard */}
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-700">
                    Signature Status:
                  </p>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li className="flex justify-between items-center text-[#0038A8] font-semibold">
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4" /> Chairperson
                      </span>{" "}
                      <span>Signed</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-slate-300" /> Member
                        (HRMO)
                      </span>{" "}
                      <span className="text-slate-400">Pending</span>
                    </li>
                    <li className="flex justify-between items-center text-[#0038A8] font-semibold">
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4" /> Member (Union
                        Representative)
                      </span>{" "}
                      <span>Signed</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-slate-300" /> Member
                        (Department Head)
                      </span>{" "}
                      <span className="text-slate-400">Pending</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              Approval Checklist
            </h4>

            <div className="space-y-4 flex-1">
              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    1. Review Summary of Ratings
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Review the Comparative Assessment Results carefully before
                    signing.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    2. Sign Deliberation Report
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Affix your electronic signature to the official Deliberation
                    Report.
                  </p>
                </div>
              </label>
            </div>

            {isEditing && (
              <div className="mt-6 pt-4 border-t border-slate-200">
                <button
                  onClick={() =>
                    toast.success(
                      "Successfully signed the deliberation report!",
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0038A8] text-white hover:bg-[#002B80] rounded-lg text-sm font-bold shadow-sm transition-all"
                >
                  <FileCheck2 className="w-4 h-4" /> Sign Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 10) {
    const isEditing = (role === "Superintendent" || role === "hrmo") && activeStep === 10;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Final Evaluation & Approval
          </h3>
          <p className="text-sm text-slate-500">
            HRMO / Appointing Authority conducts background investigation for
            short-listed candidates and approves results to issue advice of
            assignment and appointment. (5 days SLA).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              Background Investigation Findings
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0038A8]/10 flex items-center justify-center text-[#0038A8]">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">
                      Employment Verification
                    </h5>
                    <p className="text-xs text-slate-500">
                      Previous employment history verified and positive.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0038A8]/10 flex items-center justify-center text-[#0038A8]">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">
                      Reference Checks
                    </h5>
                    <p className="text-xs text-slate-500">
                      Character references contacted. No derogatory records.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0038A8]/10 flex items-center justify-center text-[#0038A8]">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">
                      Academic Verification
                    </h5>
                    <p className="text-xs text-slate-500">
                      Degree and transcript are authentic.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Investigation Notes
                </label>
                <textarea
                  className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#0038A8]/20 focus:border-[#0038A8] outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                  rows={3}
                  placeholder="Enter any pertinent findings..."
                  disabled={!isEditing}
                  defaultValue="Candidate is highly recommended for the position. All background checks cleared successfully."
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              Evaluation Checklist Completeness
            </h4>

            <div className="space-y-4 flex-1">
              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    1. Conduct Background Investigation
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Review feedback from the background checks.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    2. Issue Advice of Assignment
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Draft the preliminary assignment advice memo.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    3. Issue Appointment
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Approve results and prepare appointment issuance.
                  </p>
                </div>
              </label>
            </div>

            {isEditing && (
              <div className="mt-6 pt-4 border-t border-slate-200 flex gap-3">
                <button
                  onClick={() =>
                    toast.error("Evaluation unsuccessful, candidate rejected.")
                  }
                  className="flex-1 px-4 py-2.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 rounded-lg text-sm font-bold shadow-sm transition-all"
                >
                  Reject
                </button>
                <button
                  onClick={() =>
                    toast.success(
                      "Final evaluation approved and assignment issued!",
                    )
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0038A8] text-white hover:bg-[#002B80] rounded-lg text-sm font-bold shadow-sm transition-all"
                >
                  <FileCheck2 className="w-4 h-4" /> Approve Results
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 11) {
    const isEditing = role === "hrmo" && activeStep === 11;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Preparation of Appointments
          </h3>
          <p className="text-sm text-slate-500">
            HRMO Staff prepares and furnishes the appointee with their
            appointment, provides necessary documents, and requests supporting
            documents. (3 days SLA).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              Appointment Documents
            </h4>
            <div className="space-y-4">
              <div className="space-y-3">
                <p className="text-[12px] font-bold text-slate-800 uppercase tracking-wide mb-2">
                  Drafted Papers:
                </p>
                {/* Removed mock DocCard */}
                {/* Removed mock DocCard */}
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-700">
                    Required Supporting Documents from Appointee:
                  </p>
                  <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                    <li>Medical Certificate (CS Form No. 211)</li>
                    <li>NBI Clearance</li>
                    <li>
                      Statement of Assets, Liabilities and Net Worth (SALN)
                    </li>
                    <li>Oath of Office</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              Preparation Checklist
            </h4>

            <div className="space-y-4 flex-1">
              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    1. Furnish Appointment
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Provide the appointee with their official appointment paper.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    2. Provide Documents
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Give the applicant the necessary forms and documents for
                    appointment.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    3. Request Supporting Docs
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Require the applicant to comply with additional supporting
                    documents (Medical, NBI, etc.).
                  </p>
                </div>
              </label>
            </div>

            {isEditing && (
              <div className="mt-6 pt-4 border-t border-slate-200">
                <button
                  onClick={() =>
                    toast.success(
                      "Appointment documents prepared and issued to the applicant!",
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0038A8] text-white hover:bg-[#002B80] rounded-lg text-sm font-bold shadow-sm transition-all"
                >
                  <FileCheck2 className="w-4 h-4" /> Issue Appointment Docs
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 12) {
    const isEditing = role === "hrmo" && activeStep === 12;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Review Completeness of Appointment
          </h3>
          <p className="text-sm text-slate-500">
            HRMO Staff reviews completeness of documents, prepares appointment
            transmittal, and submits to CSC FO. (3 days SLA).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              Documents for Submission
            </h4>
            <div className="space-y-4">
              <div className="space-y-3">
                <p className="text-[12px] font-bold text-slate-800 uppercase tracking-wide mb-2">
                  Attached Documents:
                </p>
                {/* Removed mock DocCard */}
                {/* Removed mock DocCard */}
                {/* Removed mock DocCard */}
                {/* Removed mock DocCard */}
                {/* Removed mock DocCard */}
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-700">
                    Submission Requirements:
                  </p>
                  <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                    <li>Ensure all forms are fully accomplished and signed.</li>
                    <li>Verify authenticity of clearances.</li>
                    <li>Segregate agency copy from CSC FO copy.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              Submission Checklist
            </h4>

            <div className="space-y-4 flex-1">
              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    1. Check Completeness
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Verify all documents attached to the appointment are
                    complete.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    2. Separate Documents
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Separate the required documents for submission to the CSC
                    FO.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    3. Prepare Transmittal
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Draft and prepare the appointments transmittal document.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    4. Submit to CSC FO
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Submit the appointment and transmittal to the Civil Service
                    Commission Field Office.
                  </p>
                </div>
              </label>
            </div>

            {isEditing && (
              <div className="mt-6 pt-4 border-t border-slate-200">
                <button
                  onClick={() =>
                    toast.success(
                      "Appointment successfully submitted to CSC FO!",
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0038A8] text-white hover:bg-[#002B80] rounded-lg text-sm font-bold shadow-sm transition-all"
                >
                  <FileCheck2 className="w-4 h-4" /> Finalize Submission
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 13) {
    const isEditing = role === "csc" && activeStep === 13;

    return (
      <div className="space-y-6">
        <div className="flex flex-col border-b border-slate-100 pb-3 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              CSC Field Office — 1 Day SLA
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Submit Requirements to CSC Field Office
            </h3>
            <p className="text-sm text-slate-500">
              The CSC Field Office acts on the appointment in consonance with existing Civil Service Law, Rules and Regulations and other pertinent policies.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              Submitted Appointment Papers
            </h4>
            <div className="space-y-3">
              {/* Removed mock DocCard */}
              {/* Removed mock DocCard */}
              {/* Removed mock DocCard */}
              {/* Removed mock DocCard */}
              {/* Removed mock DocCard */}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              CSC Field Office Checklist
            </h4>

            <div className="space-y-4 flex-1">
              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-amber-300 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    1. Review Appointment Documents
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Verify completeness and compliance with Civil Service Law and applicable regulations.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-amber-300 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    2. Act on the Appointment
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Act on the appointment in consonance with existing Civil Service Law, Rules and Regulations and other pertinent policies.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-amber-300 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    3. Furnish Appointee with Approved Appointment
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Provide the appointee with the officially approved and attested appointment document.
                  </p>
                </div>
              </label>
            </div>

            {isEditing && (
              <div className="mt-6 pt-4 border-t border-slate-200">
                <button
                  onClick={() =>
                    toast.success(
                      "Appointment acted upon and approved by CSC Field Office!",
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 text-white hover:bg-amber-700 rounded-lg text-sm font-bold shadow-sm transition-all"
                >
                  <FileCheck2 className="w-4 h-4" /> Approve & Attest Appointment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 14) {
    const isEditing = role === "records" && activeStep === 14;

    return (
      <div className="space-y-6">
        <div className="flex flex-col border-b border-slate-100 pb-3 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              DepEd Records Staff — 1 Day SLA
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Furnish Appointee with Approved Appointment
            </h3>
            <p className="text-sm text-slate-500">
              DepEd Records Staff furnishes the appointee with the approved appointment and posts the list of approved/issued appointments.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              Approved Appointment Documents
            </h4>
            <div className="space-y-3">
              {/* Removed mock DocCard */}
              {/* Removed mock DocCard */}
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-[12px] font-semibold text-blue-800 mb-2">Posting Requirements:</p>
              <ul className="text-xs text-blue-700 space-y-1.5 list-disc list-inside">
                <li>Post on bulletin board within the DepEd Division office.</li>
                <li>Retain agency copy in the 201 file of the employee.</li>
                <li>Update the Digital Appointments Register in HRIS.</li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              Records Staff Checklist
            </h4>

            <div className="space-y-4 flex-1">
              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    1. Furnish Appointee with Approved Appointment
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Officially hand over the CSC-attested appointment to the appointee.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input
                  type="checkbox"
                  className="mt-1 shrink-0"
                  defaultChecked={false}
                  disabled={!isEditing}
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    2. Post the List of Approved/Issued Appointments
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Publicly post the approved appointments list in the bulletin board and update the HRIS register.
                  </p>
                </div>
              </label>
            </div>

            {isEditing && (
              <div className="mt-6 pt-4 border-t border-slate-200">
                <button
                  onClick={() =>
                    toast.success(
                      "Appointment furnished to appointee and list posted successfully!",
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0038A8] text-white hover:bg-[#002B80] rounded-lg text-sm font-bold shadow-sm transition-all"
                >
                  <FileCheck2 className="w-4 h-4" /> Confirm & Post Appointments
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 15) {
    const isEditing = role === "hrmo" && activeStep === 15;

    return (
      <div className="space-y-6">
        <div className="flex flex-col border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Encode Details
            </h3>
            <p className="text-sm text-slate-500">
              HRMO Staff encodes necessary personnel information into the HRIS. (1 day SLA).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              {personnelType === "plantilla" ? "Plantilla Profile" : "Non-Plantilla Details"}
            </h4>
            <div className="space-y-4">
              <div className="space-y-3 p-4 bg-slate-50 border border-slate-100 rounded-lg text-sm">
                <div className="flex flex-col border-b border-slate-200 pb-2">
                  <span className="text-slate-500 text-xs font-semibold uppercase">Full Name</span>
                  <span className="text-slate-800 font-bold">Juan De La Cruz</span>
                </div>

                {personnelType === "plantilla" ? (
                  <>
                    <div className="flex flex-col border-b border-slate-200 pb-2">
                      <span className="text-slate-500 text-xs font-semibold uppercase">Position Title</span>
                      <span className="text-slate-800 font-bold">{application?.position || application?.vacancy?.title}</span>
                    </div>
                    <div className="flex flex-col border-b border-slate-200 pb-2">
                      <span className="text-slate-500 text-xs font-semibold uppercase">Plantilla Item No.</span>
                      <span className="text-slate-800 font-bold">{application?.vacancy?.itemNo || "PENDING"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-500 text-xs font-semibold uppercase">Salary Grade / Step</span>
                      <span className="text-slate-800 font-bold">SG 11 / Step 1</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col border-b border-slate-200 pb-3">
                      <span className="text-slate-500 text-xs font-semibold uppercase mb-1">Employment Status</span>
                      <span className="text-slate-800 font-bold">{application?.vacancy?.employmentStatus || "Contract of Services"}</span>
                    </div>
                    <div className="flex flex-col border-b border-slate-200 py-3">
                      <span className="text-slate-500 text-xs font-semibold uppercase mb-1">Contract Duration</span>
                      <span className="text-slate-800 font-bold">{application?.vacancy?.contractDuration || "6 Months"}</span>
                    </div>
                    <div className="flex flex-col border-b border-slate-200 py-3">
                      <span className="text-slate-500 text-xs font-semibold uppercase">Job Title</span>
                      <span className="text-slate-800 font-bold">{application?.position || application?.vacancy?.title}</span>
                    </div>
                    <div className="flex flex-col pt-2">
                      <span className="text-slate-500 text-xs font-semibold uppercase">Funding Source</span>
                      <span className="text-slate-800 font-bold">MOOE / Local Funds</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col">
            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-4">
              {personnelType === "plantilla" ? "Plantilla Encoding Tasks" : "Non-Plantilla Entry Tasks"}
            </h4>

            <div className="space-y-4 flex-1">
              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input type="checkbox" className="mt-1 shrink-0" defaultChecked={false} disabled={!isEditing} />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">1. Update System HR Profile</p>
                  <p className="text-xs text-slate-500 mt-1">Encode basic info and service records.</p>
                </div>
              </label>

              {personnelType === "plantilla" ? (
                <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                  <input type="checkbox" className="mt-1 shrink-0" defaultChecked={false} disabled={!isEditing} />
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-slate-800">2. Assign Plantilla Item</p>
                    <p className="text-xs text-slate-500 mt-1">Map the appointee to the authorized PSIPOP item.</p>
                  </div>
                </label>
              ) : (
                <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                  <input type="checkbox" className="mt-1 shrink-0" defaultChecked={false} disabled={!isEditing} />
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-slate-800">2. Encode Contract/COS Validity</p>
                    <p className="text-xs text-slate-500 mt-1">Specify duration and renewal terms in the system.</p>
                  </div>
                </label>
              )}

              <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-[#0038A8]/30 transition-all">
                <input type="checkbox" className="mt-1 shrink-0" defaultChecked={false} disabled={!isEditing} />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">3. Payroll Integration</p>
                  <p className="text-xs text-slate-500 mt-1">Sync salary grade or daily wage details for payroll inclusion.</p>
                </div>
              </label>
            </div>

            {isEditing && (
              <div className="mt-6 pt-4 border-t border-slate-200">
                <button
                  onClick={() => toast.success(`${personnelType === "plantilla" ? "Plantilla" : "Non-Plantilla"} details encoded!`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0038A8] text-white hover:bg-[#002B80] rounded-lg text-sm font-bold shadow-sm transition-all"
                >
                  <FileCheck2 className="w-4 h-4" /> Finalize Encoding
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

}

function CheckItem({
  label,
  checked = false,
}: {
  label: string;
  checked?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-[#0038A8]/30 hover:shadow-sm cursor-pointer transition-all duration-200 group">
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          className="peer sr-only"
          defaultChecked={checked}
        />
        <div
          className={`w-5 h-5 rounded-[6px] border-2 flex items-center justify-center transition-all duration-200 ${checked ? "bg-[#0038A8] border-[#0038A8] text-white" : "border-slate-300 bg-white group-hover:border-[#0038A8]/50"}`}
        >
          <Check
            className={`w-3.5 h-3.5 transition-transform duration-200 ${checked ? "scale-100" : "scale-0"}`}
            strokeWidth={3}
          />
        </div>
      </div>
      <span
        className={`text-sm font-semibold transition-colors duration-200 ${checked ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"}`}
      >
        {label}
      </span>
    </label>
  );
}

function DocCard({
  title,
  date,
  onRemove,
}: {
  title: string;
  date: string;
  onRemove?: () => void;
  key?: string | number;
}) {
  return (
    <div className="p-4 border border-slate-200 rounded-2xl flex items-start gap-4 hover:border-[#0038A8]/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 bg-white relative group">
      <div className="p-3 bg-[#0038A8]/5 text-[#0038A8] rounded-xl shrink-0 border border-[#0038A8]/10 group-hover:bg-[#0038A8]/10 transition-colors">
        <FileText className="w-6 h-6" />
      </div>
      <div className="flex-1 pr-6 pt-1">
        <h4 className="text-[15px] font-bold text-slate-900 leading-tight group-hover:text-[#0038A8] transition-colors">
          {title}
        </h4>
        <p className="text-xs text-slate-500 font-medium mt-1.5 flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          {date}
        </p>
      </div>
      {onRemove && (
        <button
          onClick={(e) => {
            onRemove();
            toast.success("Document removed successfully");
          }}
          className="absolute right-3 top-3 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all md:opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
