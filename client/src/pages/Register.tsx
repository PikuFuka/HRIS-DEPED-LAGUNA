import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, 
  Lock, 
  User, 
  ChevronRight, 
  ChevronLeft, 
  Building2, 
  Fingerprint, 
  CheckCircle2,
  Calendar,
  ShieldCheck,
  CreditCard,
  Target,
  ArrowRight
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

type Step = "account" | "otp" | "typeSelection" | "school" | "personal" | "professional" | "success";
type EmployeeType = "plantilla" | "non-plantilla";

export default function Register() {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>("account");
  const [employeeType, setEmployeeType] = useState<EmployeeType | null>(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  
  // Registration State
  const [formData, setFormData] = useState({
    // Account
    email: "",
    password: "",
    // Plantilla Specific - Position & Item
    itemNumber: "",
    position: "",
    positionParenthetical: "",
    reclassification: "NO",
    previousItemNumber: "",
    taggingOfItem: "Regular",
    sg: "",
    step: "",
    authorized: "",
    actual: "",
    code: "",
    type: "",
    level: "",
    attri: "",
    // Assignment (Shared/Unified)
    category: "", // Kinder, Elem, JHS, etc.
    schoolId: "",
    schoolName: "",
    actualDeployment: "", // For Plantilla
    
    // Non-Plantilla Specific
    assignment: "", // Office/Station
    natureOfWork: "",
    monthlySalary: "",
    sourceOfFunds: "",
    contractDuration: "",
    statusOfEngagement: "", // JO, COS, Casual
    
    // Personal (Detailed)
    employeeNumber: "",
    lastName: "",
    givenName: "",
    middleName: "",
    suffix: "",
    sex: "",
    birthDate: "",
    tin: "",
    
    // Professional/Service
    origAppt: "", // Original Appointment
    lastProm: "", // Last Promotion
    status: "", // Status of Appointment (Permanent, etc.)
    eligibility: "",
    firstDayOfService: "", // For Non-Plantilla
  });

  useEffect(() => {
    if (location.state?.directToOtp) {
      setFormData(prev => ({
        ...prev,
        email: location.state.email || "",
        password: location.state.password || ""
      }));
      setCurrentStep("otp");
    }
  }, [location.state]);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = { ...formData, type: employeeType };
      const res = await fetch("/api/register-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setCurrentStep("success");
      } else {
        const errorData = await res.json();
        alert("Registration failed: " + (errorData.message || "Please check your inputs."));
      }
    } catch (e) {
      console.error(e);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    const steps: Step[] = ["account", "otp", "typeSelection", "school", "personal", "professional", "success"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: Step[] = ["account", "otp", "typeSelection", "school", "personal", "professional", "success"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const categories = ["Kinder", "Elem", "JHS", "SHS", "OSDS", "CID", "SGOD"];

  const stepProgress = {
    account: 15,
    otp: 30,
    typeSelection: 45,
    school: 60,
    personal: 75,
    professional: 90,
    success: 100
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-60"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full px-6 py-6 border-b border-white/50 bg-white/30 backdrop-blur-md flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0038A8] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/10">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 tracking-tight leading-none">DEPED HRIS</h1>
            <p className="text-[10px] font-bold text-[#0038A8] uppercase tracking-wider mt-0.5">Division of Laguna</p>
          </div>
        </Link>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Already have an account?</span>
          <Link to="/login" className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-xs font-bold rounded-lg hover:bg-slate-50 transition-all shadow-sm">
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-2xl">
          {/* Progress Bar */}
          <div className="mb-8 px-4">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-bold text-[#0038A8] uppercase tracking-[0.25em]">
                {currentStep === "success" ? "Complete" : `Step ${Object.keys(stepProgress).indexOf(currentStep) + 1} of 5`}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                {stepProgress[currentStep]}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <motion.div 
                initial={false}
                animate={{ width: `${stepProgress[currentStep]}%` }}
                className="h-full bg-[#0038A8] rounded-full"
              />
            </div>
          </div>

          <div className="bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,56,168,0.08)] border border-slate-100 overflow-hidden">
            <AnimatePresence mode="wait">
              {/* Account Step */}
              {currentStep === "account" && (
                <motion.div 
                  key="account"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 sm:p-12"
                >
                  <div className="max-w-md mx-auto">
                    <div className="text-center mb-10">
                      <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight uppercase mb-2">Create your account</h2>
                      <p className="text-sm text-slate-500 font-medium tracking-tight">Start your registration for Plantilla profiling</p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0038A8] transition-colors" />
                          <input 
                            type="email"
                            placeholder="name@deped.gov.ph"
                            className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#0038A8] focus:bg-white transition-all"
                            value={formData.email}
                            onChange={(e) => updateField("email", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Password</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0038A8] transition-colors" />
                          <input 
                            type="password"
                            placeholder="••••••••"
                            className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#0038A8] focus:bg-white transition-all"
                            value={formData.password}
                            onChange={(e) => updateField("password", e.target.value)}
                          />
                        </div>
                      </div>

                      <button 
                        onClick={handleNext}
                        className="w-full h-14 bg-[#0038A8] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#002B80] transition-all shadow-lg shadow-blue-900/10 active:scale-[0.98]"
                      >
                        Get OTP Code <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* OTP Step */}
              {currentStep === "otp" && (
                <motion.div 
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 sm:p-12"
                >
                  <div className="max-w-md mx-auto text-center">
                    <div className="w-16 h-16 bg-blue-50 text-[#0038A8] rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Fingerprint className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight uppercase mb-2">Verify your email</h2>
                    <p className="text-sm text-slate-500 font-medium tracking-tight mb-10">We sent a verification code to <span className="text-slate-900 font-bold">{formData.email}</span></p>

                    <div className="flex justify-center gap-3 mb-10">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          type="text"
                          maxLength={1}
                          className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#0038A8] transition-all"
                          value={digit}
                          onChange={(e) => {
                            const newOtp = [...otp];
                            newOtp[idx] = e.target.value;
                            setOtp(newOtp);
                            if (e.target.value && idx < 5) {
                              (e.target.nextSibling as HTMLInputElement)?.focus();
                            }
                          }}
                        />
                      ))}
                    </div>

                    <div className="space-y-4">
                      <button 
                        onClick={handleNext}
                        className="w-full h-14 bg-[#0038A8] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#002B80] transition-all shadow-lg shadow-blue-900/10 active:scale-[0.98]"
                      >
                        Verify & Continue <ChevronRight className="w-4 h-4" />
                      </button>
                      <button className="text-xs font-bold text-[#0038A8] hover:underline uppercase tracking-widest">Resend Code</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Type Selection Step */}
              {currentStep === "typeSelection" && (
                <motion.div 
                  key="typeSelection"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 sm:p-12"
                >
                  <div className="max-w-md mx-auto text-center">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight uppercase mb-2">Select Account Type</h2>
                    <p className="text-sm text-slate-500 font-medium tracking-tight mb-10">Choose the profile type you wish to register</p>

                    <div className="grid grid-cols-1 gap-4 mb-10">
                      <button 
                        onClick={() => { setEmployeeType("plantilla"); handleNext(); }}
                        className={`p-6 rounded-2xl border-2 transition-all text-left flex items-start gap-4 ${employeeType === "plantilla" ? "border-[#0038A8] bg-blue-50" : "border-slate-100 hover:border-slate-200"}`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-[#0038A8] text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/10">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Plantilla Employee</h3>
                          <p className="text-[11px] text-slate-500 mt-1">For permanent employees with designated item numbers in the system.</p>
                        </div>
                      </button>

                      <button 
                        onClick={() => { setEmployeeType("non-plantilla"); handleNext(); }}
                        className={`p-6 rounded-2xl border-2 transition-all text-left flex items-start gap-4 ${employeeType === "non-plantilla" ? "border-[#0038A8] bg-blue-50" : "border-slate-100 hover:border-slate-200"}`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Non-Plantilla Personnel</h3>
                          <p className="text-[11px] text-slate-500 mt-1">For JO, Contractual, or Casual personnel without plantilla items.</p>
                        </div>
                      </button>
                    </div>

                    <button onClick={handleBack} className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">
                      Back to Verification
                    </button>
                  </div>
                </motion.div>
              )}

              {/* School & Position Step */}
              {currentStep === "school" && (
                <motion.div 
                  key="school"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 sm:p-12"
                >
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase mb-8 flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-[#0038A8]" /> Assignment & Position
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    <InputField 
                      label="Deployment Category" 
                      type="select" 
                      options={categories} 
                      value={formData.category} 
                      onChange={(v) => updateField("category", v)} 
                    />
                    
                    {employeeType === "plantilla" ? (
                      <>
                        <InputField 
                          label="Item Number" 
                          placeholder="e.g. TCH3-160123"
                          value={formData.itemNumber} 
                          onChange={(v) => updateField("itemNumber", v)} 
                        />
                        <InputField 
                          label="Prev Item No. (if reclassified)" 
                          placeholder="e.g. OSEC-DECSB-..."
                          value={formData.previousItemNumber} 
                          onChange={(v) => updateField("previousItemNumber", v)} 
                        />
                        <InputField 
                          label="Position Title" 
                          placeholder="e.g. Teacher III"
                          value={formData.position} 
                          onChange={(v) => updateField("position", v)} 
                        />
                        <InputField 
                          label="Parenthetical Title" 
                          placeholder="e.g. (Special Science Teacher)"
                          value={formData.positionParenthetical} 
                          onChange={(v) => updateField("positionParenthetical", v)} 
                        />
                        <InputField 
                          label="Reclassification?" 
                          type="select"
                          options={["YES", "NO"]}
                          value={formData.reclassification} 
                          onChange={(v) => updateField("reclassification", v)} 
                        />
                        <InputField 
                          label="Tagging of Item" 
                          type="select"
                          options={["Regular", "Coterminous", "CTI"]}
                          value={formData.taggingOfItem} 
                          onChange={(v) => updateField("taggingOfItem", v)} 
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <InputField label="SG" placeholder="13" value={formData.sg} onChange={(v) => updateField("sg", v)} />
                          <InputField label="Step" placeholder="1" value={formData.step} onChange={(v) => updateField("step", v)} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <InputField label="Authorized" placeholder="33,000.00" value={formData.authorized} onChange={(v) => updateField("authorized", v)} />
                          <InputField label="Actual" placeholder="33,000.00" value={formData.actual} onChange={(v) => updateField("actual", v)} />
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <InputField label="Code" placeholder="7" value={formData.code} onChange={(v) => updateField("code", v)} />
                          <InputField label="Type" placeholder="T" value={formData.type} onChange={(v) => updateField("type", v)} />
                          <InputField label="Level" placeholder="SEC" value={formData.level} onChange={(v) => updateField("level", v)} />
                          <InputField label="Attri" placeholder="N/A" value={formData.attri} onChange={(v) => updateField("attri", v)} />
                        </div>
                      </>
                    ) : (
                      <>
                        <InputField 
                          label="Office/Station Assignment" 
                          placeholder="e.g. OSDS - Records Section"
                          value={formData.assignment} 
                          onChange={(v) => updateField("assignment", v)} 
                        />
                        <InputField 
                          label="Nature of Work" 
                          placeholder="e.g. Clerical / IT Support / Admin"
                          value={formData.natureOfWork} 
                          onChange={(v) => updateField("natureOfWork", v)} 
                        />
                        <InputField 
                          label="Monthly Salary / Rate" 
                          placeholder="e.g. 15,000.00"
                          value={formData.monthlySalary} 
                          onChange={(v) => updateField("monthlySalary", v)} 
                        />
                        <InputField 
                          label="Source of Funds" 
                          type="select"
                          options={["PS", "MOOE", "LOCAL", "OTHERS"]}
                          value={formData.sourceOfFunds} 
                          onChange={(v) => updateField("sourceOfFunds", v)} 
                        />
                      </>
                    )}
                    
                    <InputField 
                      label="School ID" 
                      placeholder="e.g. 104123"
                      value={formData.schoolId} 
                      onChange={(v) => updateField("schoolId", v)} 
                    />
                    <InputField 
                      label="School Name" 
                      placeholder="e.g. Laguna National High School"
                      value={formData.schoolName} 
                      onChange={(v) => updateField("schoolName", v)} 
                    />
                  </div>

                  <div className="mt-12 flex justify-between gap-4">
                    <button onClick={handleBack} className="px-8 py-4 bg-slate-50 text-slate-400 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-all">
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <button onClick={handleNext} className="flex-1 py-4 bg-[#0038A8] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#002B80] transition-all shadow-lg shadow-blue-900/10">
                      Next Section <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Personal Step */}
              {currentStep === "personal" && (
                <motion.div 
                  key="personal"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 sm:p-12"
                >
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase mb-8 flex items-center gap-3">
                    <User className="w-5 h-5 text-emerald-500" /> Personal Identity
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    <InputField 
                      label="Employee Number" 
                      placeholder="e.g. 47123456"
                      value={formData.employeeNumber} 
                      onChange={(v) => updateField("employeeNumber", v)} 
                    />
                    <div className="hidden sm:block"></div> {/* Spacer */}
                    
                    <InputField 
                      label="Last Name" 
                      placeholder="e.g. DELA CRUZ"
                      value={formData.lastName} 
                      onChange={(v) => updateField("lastName", v)} 
                    />
                    <InputField 
                      label="Given Name" 
                      placeholder="e.g. JUAN"
                      value={formData.givenName} 
                      onChange={(v) => updateField("givenName", v)} 
                    />
                    <InputField 
                      label="Middle Name" 
                      placeholder="e.g. REYES"
                      value={formData.middleName} 
                      onChange={(v) => updateField("middleName", v)} 
                    />
                    <InputField 
                      label="Suffix" 
                      placeholder="e.g. JR. / SR. (if any)"
                      value={formData.suffix} 
                      onChange={(v) => updateField("suffix", v)} 
                    />
                    
                    <InputField 
                      label="Sex (Assigned at Birth)" 
                      type="select" 
                      options={["MALE", "FEMALE"]} 
                      value={formData.sex} 
                      onChange={(v) => updateField("sex", v)} 
                    />
                    <InputField 
                      label="Birth Date" 
                      type="date"
                      value={formData.birthDate} 
                      onChange={(v) => updateField("birthDate", v)} 
                    />
                    <InputField 
                      label="TIN (Tax Identification No.)" 
                      placeholder="e.g. 123-456-789-000"
                      value={formData.tin} 
                      onChange={(v) => updateField("tin", v)} 
                    />
                  </div>

                  <div className="mt-12 flex justify-between gap-4">
                    <button onClick={handleBack} className="px-8 py-4 bg-slate-50 text-slate-400 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-all">
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <button onClick={handleNext} className="flex-1 py-4 bg-[#0038A8] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#002B80] transition-all shadow-lg shadow-blue-900/10">
                      Next Section <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Professional Step */}
              {currentStep === "professional" && (
                <motion.div 
                  key="professional"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 sm:p-12"
                >
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase mb-8 flex items-center gap-3">
                    <Target className="w-5 h-5 text-purple-500" /> Service Record & Engagement
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    {employeeType === "plantilla" ? (
                      <>
                        <InputField 
                          label="Original Appointment Date" 
                          type="date"
                          value={formData.origAppt} 
                          onChange={(v) => updateField("origAppt", v)} 
                        />
                        <InputField 
                          label="Date of Last Promotion" 
                          type="date"
                          value={formData.lastProm} 
                          onChange={(v) => updateField("lastProm", v)} 
                        />
                        <InputField 
                          label="Status of Appointment" 
                          type="select" 
                          options={["Permanent", "Temporary", "Coterminous", "Provisional"]} 
                          value={formData.status} 
                          onChange={(v) => updateField("status", v)} 
                        />
                        <InputField 
                          label="Deployment (RO/SDO)" 
                          placeholder="e.g. STATIONED AT SCHOOL"
                          value={formData.actualDeployment} 
                          onChange={(v) => updateField("actualDeployment", v)} 
                        />
                        <InputField 
                          label="Highest Eligibility" 
                          className="sm:col-span-2"
                          placeholder="e.g. LET / PBET / RA 1080"
                          value={formData.eligibility} 
                          onChange={(v) => updateField("eligibility", v)} 
                        />
                      </>
                    ) : (
                      <>
                        <InputField 
                          label="First Day of Service" 
                          type="date"
                          value={formData.firstDayOfService} 
                          onChange={(v) => updateField("firstDayOfService", v)} 
                        />
                        <InputField 
                          label="Status of Engagement" 
                          type="select"
                          options={["Job Order", "Contractual", "Casual", "COS"]}
                          value={formData.statusOfEngagement} 
                          onChange={(v) => updateField("statusOfEngagement", v)} 
                        />
                        <InputField 
                          label="Contract Duration / Period" 
                          placeholder="e.g. 6 Months (Jan-June 2024)"
                          className="sm:col-span-2"
                          value={formData.contractDuration} 
                          onChange={(v) => updateField("contractDuration", v)} 
                        />
                      </>
                    )}
                  </div>

                  <div className="mt-12 flex justify-between gap-4">
                    <button onClick={handleBack} className="px-8 py-4 bg-slate-50 text-slate-400 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-all">
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <button 
                      onClick={handleSubmit} 
                      disabled={isSubmitting}
                      className="flex-1 py-4 bg-[#0038A8] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#002B80] transition-all shadow-lg shadow-emerald-900/10 disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting..." : "Complete Registration"} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Success Step */}
              {currentStep === "success" && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-12 text-center"
                >
                  <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                    <CheckCircle2 className="w-12 h-12" />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1.5 }}
                      transition={{ delay: 0.2 }}
                      className="absolute inset-0 bg-emerald-500/10 rounded-full"
                    />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight uppercase mb-4">Registration Submitted</h2>
                  <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">
                    Your Plantilla profile has been submitted for verification. You will be notified via email once approved.
                  </p>
                  
                  <Link 
                    to="/login"
                    className="inline-flex h-14 px-8 bg-[#0038A8] text-white rounded-2xl font-bold items-center justify-center gap-2 hover:bg-[#002B80] transition-all shadow-lg shadow-blue-900/10 active:scale-[0.98]"
                  >
                    Go to Login <ChevronRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-center mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            DepEd Laguna HR Information System • Security Guaranteed
          </p>
        </div>
      </main>
    </div>
  );
}

function InputField({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = "text", 
  options = [],
  className = ""
}: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void; 
  placeholder?: string; 
  type?: "text" | "select" | "date";
  options?: string[];
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">{label}</label>
      <div className="relative">
        {type === "text" && (
          <input 
            type="text" 
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#0038A8] focus:bg-white transition-all shadow-sm"
          />
        )}
        {type === "date" && (
          <div className="relative">
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none" />
            <input 
              type="date" 
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#0038A8] focus:bg-white transition-all shadow-sm appearance-none"
            />
          </div>
        )}
        {type === "select" && (
          <div className="relative">
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 rotate-90 pointer-events-none" />
            <select 
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#0038A8] focus:bg-white transition-all shadow-sm appearance-none"
            >
              <option value="">Select Option</option>
              {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
