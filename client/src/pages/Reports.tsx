import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Download, Filter, ShieldAlert, Users, Building2,
  TrendingUp, AlertCircle, CheckCircle2, BookOpen,
  Printer, LayoutDashboard, ChevronRight
} from "lucide-react";
import { useAuth } from "../lib/auth";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "../components/ui/Skeleton";

// ─── Palettes ──────────────────────────────────────────────────────────────
const CAT_COLORS = {
  Teaching: "#3b82f6", // Modern Blue
  "Teaching-Related": "#f43f5e", // Modern Rose
  "Non-Teaching": "#eab308", // Modern Yellow
};

const FILLED_COLOR  = "#3b82f6";
const UNFILLED_COLOR = "#f43f5e";

// ─── Demo data ────────────────────────────────────────────────────────────


// ─── Component helpers ───────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string, subtitle?: string }) {
  return (
    <div className="flex flex-col gap-1 mb-6">
      <div className="flex items-center gap-3">
        <div className="h-6 w-1.5 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600 shadow-sm" />
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h3>
      </div>
      {subtitle && <p className="text-sm text-slate-500 ml-4.5 font-medium">{subtitle}</p>}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] ${className}`}>
      {children}
    </div>
  );
}

function Pct({ val, total }: { val: number; total: number }) {
  const p = total === 0 ? 0 : (val / total) * 100;
  return (
    <span className={`font-semibold tabular-nums text-xs px-2 py-1 rounded-md ${p >= 95 ? "bg-emerald-50 text-emerald-700" : p >= 80 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}`}>
      {p.toFixed(1)}%
    </span>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function Reports() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("This Year");
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("full");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/analytics", {
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        toast.error("Failed to load analytics");
        setLoading(false);
      });
  }, [timeRange]);

  if (
    user?.role !== "hrmo" &&
    user?.role !== "records" &&
    user?.role !== "Superintendent" &&
    user?.role !== "Supervisor" &&
    user?.role !== "Principal" &&
    user?.role !== "Super Admin"
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-slate-50/50 rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="w-24 h-24 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-6 shadow-inner border border-rose-100/50">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Access Restricted</h2>
        <p className="text-base text-slate-500 mb-8 max-w-md text-center leading-relaxed">
          You do not have the required clearance to view HR analytics and reports. Please contact the administrator.
        </p>
        <Link to="/" className="px-8 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const SECTIONS = [
    { id: "full",       label: "Full Report", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "summary",    label: "Data Validation" },
    { id: "personnel",  label: "Personnel" },
    { id: "filled",     label: "Filled & Unfilled" },
    { id: "deployment", label: "Deployment" },
    { id: "demographics", label: "Demographics" },
    { id: "vacancies",  label: "Vacancies" },
  ];

  const isVisible = (id: string) => activeSection === "full" || activeSection === id;

  const thClass = "px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200/80";
  const tdClass = "px-5 py-4 font-medium text-slate-700 border-b border-slate-100/80 bg-white/40 group-hover:bg-blue-50/30 transition-colors text-sm";
  const numClass = "px-5 py-4 text-center font-bold text-slate-900 border-b border-slate-100/80 bg-white/40 group-hover:bg-blue-50/30 transition-colors tabular-nums text-sm";

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 pb-16">
      {/* ── Page Header ── */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mt-2">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Data Analysis Report
          </h2>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md font-bold">{data?.region || "Loading..."}</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span>{data?.division || ""}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center bg-white border border-slate-200/80 rounded-2xl px-4 py-2.5 text-sm shadow-sm hover:shadow-md transition-all w-full sm:w-auto gap-2 group">
            <Filter className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            <select
              value={timeRange}
              onChange={e => setTimeRange(e.target.value)}
              className="bg-transparent outline-none text-slate-700 font-bold w-full cursor-pointer focus:ring-0"
            >
              <option>This Week</option>
              <option>This Month</option>
              <option>This Quarter</option>
              <option>This Year</option>
            </select>
          </div>
          <button
            onClick={() => toast.success("Generating modern PDF report…")}
            className="flex items-center justify-center gap-2 bg-white border border-slate-200/80 hover:border-slate-300 text-slate-700 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all shadow-sm hover:shadow-md shrink-0 w-full sm:w-auto"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={() => toast.success("Exporting data…")}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-2xl text-sm font-bold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all shrink-0 w-full sm:w-auto"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {loading || !data ? (
        <div className="flex flex-col gap-8 fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-[144px] md:col-span-2 rounded-[20px] shadow-sm" />
            <Skeleton className="h-[144px] rounded-[20px] shadow-sm" />
            <Skeleton className="h-[144px] rounded-[20px] shadow-sm" />
          </div>
          <div className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur-xl py-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-slate-200/50 mb-4 flex gap-2.5 overflow-hidden">
            <Skeleton className="h-[42px] w-[120px] rounded-full shadow-sm" />
            <Skeleton className="h-[42px] w-[150px] rounded-full shadow-sm" />
            <Skeleton className="h-[42px] w-[100px] rounded-full shadow-sm" />
            <Skeleton className="h-[42px] w-[140px] rounded-full shadow-sm" />
            <Skeleton className="h-[42px] w-[130px] rounded-full shadow-sm" />
            <Skeleton className="h-[42px] w-[110px] rounded-full shadow-sm" />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <Skeleton className="h-[450px] xl:col-span-2 rounded-[24px] shadow-sm" />
            <Skeleton className="h-[450px] rounded-[24px] shadow-sm" />
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col gap-8"
        >
          {/* ── Top Metrics Banner ── */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 md:col-span-2 bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-800 text-white border-none shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                <ShieldAlert className="w-32 h-32" />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between gap-4">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Overall Completion Rate</p>
                <div className="flex items-end gap-3">
                  <p className="text-6xl font-black tracking-tight">{data.completionRate}%</p>
                  <div className="flex items-center gap-1.5 pb-2 text-emerald-400 font-bold text-sm">
                    <TrendingUp className="w-4 h-4" /> +2.4%
                  </div>
                </div>
              </div>
            </Card>

            {[
              { label: "DepEd Plantilla", value: data.personnel.depEdPlantilla, icon: <Building2 className="w-6 h-6 text-indigo-500" />, bg: "bg-indigo-50" },
              { label: "Total Personnel", value: data.personnel.grandTotal, icon: <Users className="w-6 h-6 text-blue-500" />, bg: "bg-blue-50" },
            ].map((k, i) => (
              <Card key={i} className="p-6 flex flex-col justify-between gap-4 relative overflow-hidden group">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{k.label}</p>
                  <div className={`p-2.5 rounded-xl ${k.bg} transition-transform duration-300 group-hover:scale-110`}>{k.icon}</div>
                </div>
                <p className="text-4xl font-black text-slate-800 tracking-tight">{k.value.toLocaleString()}</p>
              </Card>
            ))}
          </div>

          {/* ── Sticky Section Nav ── */}
          <div className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur-xl py-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-slate-200/50 mb-4">
            <div className="flex gap-2.5 overflow-x-auto pb-2 custom-scrollbar snap-x">
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`snap-start px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeSection === s.id
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-100"
                      : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-800 hover:bg-slate-50 hover:scale-105"
                  }`}
                >
                  {s.icon}
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            <AnimatePresence mode="popLayout">

            {/* ══════════════════════════════════════════════════════
                SECTION 1: DATA VALIDATION SUMMARY
            ══════════════════════════════════════════════════════ */}
            {isVisible("summary") && (
              <motion.div key="summary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <Card className="p-1">
                  <div className="p-6 pb-2">
                    <SectionHeader title="Data Validation Summary" subtitle="Verification status across all required personnel fields." />
                  </div>
                  <div className="overflow-x-auto px-2 pb-2">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr>
                          <th className={thClass + " rounded-tl-xl"}>Fields</th>
                          <th className={thClass + " text-center"}>Total Data</th>
                          <th className={thClass + " text-center"}>Matched</th>
                          <th className={thClass + " text-center"}>Mismatched</th>
                          <th className={thClass + " text-center"}>Verified</th>
                          <th className={thClass + " text-center"}>Unverified</th>
                          <th className={thClass + " text-center rounded-tr-xl"}>Status %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.validationSummary.map((row, i) => {
                          const pct = row.total === 0 ? 0 : (row.verified / row.total) * 100;
                          return (
                            <tr key={i} className="group">
                              <td className={`${tdClass} font-semibold`}>{row.field}</td>
                              <td className={numClass}>{row.total.toLocaleString()}</td>
                              <td className={`${numClass} text-emerald-600`}>{row.matched.toLocaleString()}</td>
                              <td className={`${numClass} ${row.mismatched > 0 ? "text-rose-600 font-black" : "text-slate-400"}`}>{row.mismatched.toLocaleString()}</td>
                              <td className={`${numClass} text-indigo-600`}>{row.verified.toLocaleString()}</td>
                              <td className={`${numClass} text-slate-500`}>{row.unverified.toLocaleString()}</td>
                              <td className={tdClass}>
                                <div className="flex justify-center items-center gap-3">
                                  <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                                    <div
                                      className={`h-full rounded-full transition-all duration-1000 ${pct >= 95 ? "bg-emerald-500" : pct >= 80 ? "bg-amber-500" : "bg-rose-500"}`}
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                  <Pct val={row.verified} total={row.total} />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Validation Score Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Fully Verified", value: data.validationSummary.filter(r => r.mismatched === 0).length, color: "text-emerald-600", bg: "bg-emerald-50", icon: <CheckCircle2 className="w-5 h-5" /> },
                    { label: "Has Mismatches", value: data.validationSummary.filter(r => r.mismatched > 0).length, color: "text-rose-600", bg: "bg-rose-50", icon: <AlertCircle className="w-5 h-5" /> },
                    { label: "Avg Match Rate", value: `${(data.validationSummary.reduce((a, r) => a + (r.matched / r.total * 100), 0) / data.validationSummary.length).toFixed(1)}%`, color: "text-indigo-600", bg: "bg-indigo-50", icon: <TrendingUp className="w-5 h-5" /> },
                  ].map((k, i) => (
                    <Card key={i} className="p-5 flex items-center gap-4 group">
                      <div className={`p-3.5 rounded-2xl ${k.bg} ${k.color} transition-transform group-hover:scale-110`}>{k.icon}</div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{k.label}</p>
                        <p className={`text-2xl font-black ${k.color}`}>{typeof k.value === "number" ? k.value.toLocaleString() : k.value}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════
                SECTION 2: NUMBER OF PERSONNEL
            ══════════════════════════════════════════════════════ */}
            {isVisible("personnel") && (
              <motion.div key="personnel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <Card className="p-6 md:p-8">
                  <SectionHeader title="Personnel Distribution by Category" subtitle="Overview of filled and unfilled items across major job families." />
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mt-6">
                    <div className="lg:col-span-1 space-y-4">
                      {data.filledByCategory.map((d, i) => {
                        const total = d.filled + d.unfilled;
                        const grandTotal = data.personnel.grandTotal;
                        const pct = ((total / grandTotal) * 100).toFixed(1);
                        const color = Object.values(CAT_COLORS)[i];
                        return (
                          <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-colors group">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                                <span className="font-bold text-slate-700 text-sm">{d.category}</span>
                              </div>
                              <span className="font-black text-lg" style={{ color }}>{pct}%</span>
                            </div>
                            <div className="text-xs text-slate-500 font-medium">
                              {total.toLocaleString()} total items
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="lg:col-span-2 h-[350px]">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <PieChart>
                          <Pie
                            data={data.filledByCategory.map(d => ({ name: d.category, value: d.filled + d.unfilled }))}
                            cx="50%" cy="50%"
                            innerRadius={90} outerRadius={140}
                            paddingAngle={4} dataKey="value"
                            stroke="none"
                            cornerRadius={8}
                          >
                            {data.filledByCategory.map((d, i) => (
                              <Cell key={i} fill={Object.values(CAT_COLORS)[i]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(v: any) => <span className="font-bold text-slate-900">{v.toLocaleString()}</span>} 
                            contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", padding: "12px 20px" }} 
                            itemStyle={{ fontWeight: 600 }}
                          />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: 13, fontWeight: 700 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════
                SECTION 3: FILLED & UNFILLED
            ══════════════════════════════════════════════════════ */}
            {isVisible("filled") && (
              <motion.div key="filled" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                {/* By Position Category */}
                <Card className="p-1">
                  <div className="p-6 pb-2">
                    <SectionHeader title="Filled vs Unfilled by Category" />
                  </div>
                  <div className="overflow-x-auto px-2 pb-6">
                    <table className="w-full text-left border-collapse mb-6">
                      <thead>
                        <tr>
                          <th className={thClass + " rounded-tl-xl"}>Category</th>
                          <th className={thClass + " text-center"}>Filled</th>
                          <th className={thClass + " text-center"}>Unfilled</th>
                          <th className={thClass + " text-center"}>Total</th>
                          <th className={thClass + " text-center rounded-tr-xl"}>Fill Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.filledByCategory.map((row, i) => (
                          <tr key={i} className="group">
                            <td className={`${tdClass} font-bold`}>{row.category}</td>
                            <td className={`${numClass} text-blue-600`}>{row.filled}</td>
                            <td className={`${numClass} text-rose-500`}>{row.unfilled}</td>
                            <td className={numClass}>{row.filled + row.unfilled}</td>
                            <td className={tdClass}>
                              <div className="flex justify-center items-center gap-3">
                                <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(row.filled / (row.filled + row.unfilled)) * 100}%` }} />
                                </div>
                                <Pct val={row.filled} total={row.filled + row.unfilled} />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    <div className="h-80 px-4">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <BarChart data={data.filledByCategory} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: "#64748b", fontWeight: 700 }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 600 }} />
                          <Tooltip 
                            cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }}
                            contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }} 
                          />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: 13, fontWeight: 700, paddingTop: "20px" }} />
                          <Bar dataKey="filled" name="Filled Positions" fill={FILLED_COLOR} radius={[6,6,0,0]} barSize={40} />
                          <Bar dataKey="unfilled" name="Unfilled Positions" fill={UNFILLED_COLOR} radius={[6,6,0,0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Card>

                {/* By Tagging and Title Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* By Tagging */}
                  <Card className="p-1 h-full">
                    <div className="p-6 pb-2">
                      <SectionHeader title="By Item Tagging" />
                    </div>
                    <div className="overflow-x-auto px-2 pb-2">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr>
                            <th className={thClass + " rounded-tl-xl"}>Tagging</th>
                            <th className={thClass + " text-center"}>Filled</th>
                            <th className={thClass + " text-center"}>Unfilled</th>
                            <th className={thClass + " text-center rounded-tr-xl"}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.filledByTagging.map((row, i) => (
                            <tr key={i} className="group">
                              <td className={`${tdClass} font-semibold text-xs`}>{row.tag}</td>
                              <td className={`${numClass} text-blue-600`}>{row.filled}</td>
                              <td className={`${numClass} text-rose-500`}>{row.unfilled}</td>
                              <td className={numClass}>{row.filled + row.unfilled}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  {/* By Position Title */}
                  <Card className="p-6 h-full flex flex-col">
                    <SectionHeader title="Top Positions by Status" />
                    <div className="flex-1 min-h-[300px]">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <BarChart data={data.byPositionTitle} layout="vertical" margin={{ top: 0, right: 30, left: 120, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                          <YAxis dataKey="title" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#475569", fontWeight: 700 }} width={120} />
                          <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }} />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: 12, fontWeight: 700 }} />
                          <Bar dataKey="filled" name="Filled" fill={FILLED_COLOR} radius={[0,4,4,0]} barSize={12} />
                          <Bar dataKey="unfilled" name="Unfilled" fill={UNFILLED_COLOR} radius={[0,4,4,0]} barSize={12} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════
                SECTION 4: DEPLOYMENT
            ══════════════════════════════════════════════════════ */}
            {isVisible("deployment") && (
              <motion.div key="deployment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <Card className="p-6 md:p-8">
                  <SectionHeader title="Actual Deployment by Position Category" subtitle="Distribution of personnel within vs outside the division." />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-6">
                    <div className="overflow-x-auto bg-slate-50/50 rounded-2xl border border-slate-100">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr>
                            <th className={thClass + " bg-transparent border-none py-5"}>Category</th>
                            <th className={thClass + " bg-transparent border-none text-center"}>Within Div</th>
                            <th className={thClass + " bg-transparent border-none text-center"}>Outside Div</th>
                            <th className={thClass + " bg-transparent border-none text-center"}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.deployment.map((row, i) => (
                            <tr key={i} className="border-t border-slate-100 hover:bg-white transition-colors">
                              <td className="px-5 py-4 font-bold text-slate-700 text-sm">{row.category}</td>
                              <td className="px-5 py-4 text-center font-bold text-indigo-600 tabular-nums">{row.within}</td>
                              <td className="px-5 py-4 text-center font-bold text-amber-500 tabular-nums">{row.outside}</td>
                              <td className="px-5 py-4 text-center font-black text-slate-800 tabular-nums">{row.within + row.outside}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <BarChart data={data.deployment} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b", fontWeight: 700 }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                          <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }} />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: 12, fontWeight: 700, paddingTop: "10px" }} />
                          <Bar dataKey="within" name="Within Division" fill="#4f46e5" radius={[6,6,0,0]} barSize={40} />
                          <Bar dataKey="outside" name="Outside Division" fill="#eab308" radius={[6,6,0,0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════
                SECTION 5: DEMOGRAPHICS
            ══════════════════════════════════════════════════════ */}
            {isVisible("demographics") && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <Card className="p-6 md:p-8">
                  <SectionHeader title="Age Demographics" subtitle="Age distribution across teaching and non-teaching categories." />
                  <div className="h-80 mt-6">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <BarChart
                        data={["Below 30","30–39","40–49","50–59","60+"].map(bracket => ({
                          bracket,
                          ...Object.fromEntries(data.ageBracket.map(r => [r.category, r[bracket as keyof typeof r]]))
                        }))}
                        margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="bracket" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: "#64748b", fontWeight: 700 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                        <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: 13, fontWeight: 700, paddingTop: "20px" }} />
                        {Object.entries(CAT_COLORS).map(([cat, color]) => (
                          <Bar key={cat} dataKey={cat} fill={color} radius={[6,6,0,0]} barSize={28} />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-6 md:p-8">
                  <SectionHeader title="Years in Service" subtitle="Retention and service length analysis." />
                  <div className="h-80 mt-6">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <BarChart
                        data={["<1yr","1–3yrs","4–6yrs",">7yrs"].map(bracket => ({
                          bracket,
                          ...Object.fromEntries(data.yearsInService.map(r => [r.category, r[bracket as keyof typeof r]]))
                        }))}
                        margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="bracket" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: "#64748b", fontWeight: 700 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                        <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: 13, fontWeight: 700, paddingTop: "20px" }} />
                        {Object.entries(CAT_COLORS).map(([cat, color]) => (
                          <Bar key={cat} dataKey={cat} fill={color} radius={[6,6,0,0]} barSize={28} />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════
                SECTION 6: VACANCIES
            ══════════════════════════════════════════════════════ */}
            {isVisible("vacancies") && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Reasons for Unfilled Items */}
                  <Card className="p-6 md:p-8 flex flex-col h-full">
                    <SectionHeader title="Reasons for Unfilled Items" subtitle="Bottlenecks in the recruitment pipeline." />
                    <div className="flex-1 mt-4 min-h-[350px]">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <BarChart
                          data={data.unfilledReasons.slice(0, 8).map(r => ({ reason: r.reason.length > 25 ? r.reason.slice(0,25)+"…" : r.reason, total: r.total }))}
                          layout="vertical"
                          margin={{ top: 0, right: 20, left: 160, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                          <YAxis dataKey="reason" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#475569", fontWeight: 700 }} width={150} />
                          <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }} />
                          <Bar dataKey="total" name="Items" fill={UNFILLED_COLOR} radius={[0,4,4,0]} barSize={16}>
                            {data.unfilledReasons.slice(0, 8).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? "#be123c" : UNFILLED_COLOR} /> // Highlight top reason
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  {/* Vacancy in Years */}
                  <Card className="p-1 h-full">
                    <div className="p-6 pb-2">
                      <SectionHeader title="Vacancy Duration" subtitle="How long items have been unfilled." />
                    </div>
                    <div className="overflow-x-auto px-2 pb-2">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr>
                            <th className={thClass + " rounded-tl-xl"}>Category</th>
                            <th className={thClass + " text-center"}>&lt; 1 Yr</th>
                            <th className={thClass + " text-center"}>1–3 Yrs</th>
                            <th className={thClass + " text-center"}>4–6 Yrs</th>
                            <th className={thClass + " text-center"}>7+ Yrs</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.vacancyInYears.map((row, i) => (
                            <tr key={i} className="group">
                              <td className={`${tdClass} font-bold text-xs`}>{row.category}</td>
                              <td className={`${numClass} text-rose-500`}>{row["<1yr"]}</td>
                              <td className={`${numClass} text-rose-600`}>{row["1–3yrs"]}</td>
                              <td className={`${numClass} text-rose-700`}>{row["4–6yrs"]}</td>
                              <td className={`${numClass} text-rose-800 font-black`}>{row[">7yrs"]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}
            
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}
