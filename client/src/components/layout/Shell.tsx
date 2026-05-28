import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import {
  LogOut,
  Home,
  UserCircle,
  Settings,
  Briefcase,
  FileText,
  CheckCircle,
  Upload,
  Menu,
  X,
  Loader2,
  ChevronDown,
  TrendingUp,
  FileSearch,
  Search,
  Bell,
  Command,
  ArrowUpRight,
  Activity,
  Users,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

const ROLE_NAVIGATION: Record<
  string,
  { to: string; icon: React.ReactNode; label: string }[]
> = {
  "Super Admin": [
    {
      to: "/admin/users",
      icon: <Users className="w-[18px] h-[18px]" />,
      label: "User Management",
    },
    {
      to: "/admin/logs",
      icon: <Activity className="w-[18px] h-[18px]" />,
      label: "Audit Trail",
    },
  ],
  hrmo: [
    {
      to: "/vacancies",
      icon: <Briefcase className="w-[18px] h-[18px]" />,
      label: "Vacancies", // Step 1
    },
    {
      to: "/applications",
      icon: <FileText className="w-[18px] h-[18px]" />,
      label: "Application Tracker", // Steps 3-13
    },
    {
      to: "/registers",
      icon: <FileText className="w-[18px] h-[18px]" />,
      label: "Item Numbers", 
    },
    {
      to: "/records",
      icon: <FileText className="w-[18px] h-[18px]" />,
      label: "Personnel Records",
    },
    {
      to: "/reports",
      icon: <TrendingUp className="w-[18px] h-[18px]" />,
      label: "Reports",
    },
  ],
  records: [
    {
      to: "/verification",
      icon: <CheckCircle className="w-[18px] h-[18px]" />,
      label: "Verification", // Step 11
    },
    {
      to: "/appointments",
      icon: <Upload className="w-[18px] h-[18px]" />,
      label: "Appointments", // Step 16
    },
    {
      to: "/records",
      icon: <FileText className="w-[18px] h-[18px]" />,
      label: "Personnel Records",
    },
  ],
  hrmpsb: [
    {
      to: "/screening",
      icon: <FileSearch className="w-[18px] h-[18px]" />,
      label: "Assessment", // Step 5
    },
    {
      to: "/registers",
      icon: <FileText className="w-[18px] h-[18px]" />,
      label: "IER", // IER List
    },
    {
      to: "/evaluations",
      icon: <FileText className="w-[18px] h-[18px]" />,
      label: "CAR-RQA", // Step 6
    },
  ],
  Superintendent: [
    {
      to: "/approvals",
      icon: <CheckCircle className="w-[18px] h-[18px]" />,
      label: "Approvals", // Steps 7, 10, 12
    },
    {
      to: "/registers",
      icon: <FileText className="w-[18px] h-[18px]" />,
      label: "RQA", // RQA List
    },
    {
      to: "/hierarchy",
      icon: <Users className="w-[18px] h-[18px]" />,
      label: "Personnel",
    },
  ],
  Supervisor: [
    {
      to: "/hierarchy",
      icon: <Users className="w-[18px] h-[18px]" />,
      label: "District Org",
    },
    {
      to: "/registers",
      icon: <FileText className="w-[18px] h-[18px]" />,
      label: "Item Numbers",
    },
    {
      to: "/reports",
      icon: <TrendingUp className="w-[18px] h-[18px]" />,
      label: "Reports",
    },
  ],
  Principal: [
    {
      to: "/hierarchy",
      icon: <Users className="w-[18px] h-[18px]" />,
      label: "School Org",
    },
    {
      to: "/vacancies",
      icon: <Briefcase className="w-[18px] h-[18px]" />,
      label: "Vacancies",
    },
    {
      to: "/registers",
      icon: <FileText className="w-[18px] h-[18px]" />,
      label: "Tracking",
    },
  ],
  csc: [
    {
      to: "/vacancies",
      icon: <Briefcase className="w-[18px] h-[18px]" />,
      label: "BVP", // Step 1
    },
    {
      to: "/csc-submissions",
      icon: <Upload className="w-[18px] h-[18px]" />,
      label: "Validation", // Step 15
    },
  ],
  applicant: [
    {
      to: "/vacancies",
      icon: <Briefcase className="w-[18px] h-[18px]" />,
      label: "Vacancies",
    },
  ],
};

function DateTimeDisplay() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden lg:flex flex-col items-end mr-4">
      <span className="text-xs font-semibold text-slate-700">
        {time.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        {time.toLocaleTimeString("en-US")}
      </span>
    </div>
  );
}

export default function Shell() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = async () => {
    logout();
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={closeMobileMenu}
        />
      )}

      {/* Main Sidebar (Desktop fixed, Mobile sliding) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-slate-50/95 backdrop-blur-md text-slate-800 flex flex-col p-5 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"} border-r border-slate-200/60`}
      >
        <div className="mb-8 flex flex-col relative tracking-tight px-1 block">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0038A8] via-[#002B80] to-[#CE1126] flex items-center justify-center shadow-lg shadow-[#0038A8]/15 border border-white/20">
                <span className="font-black text-xl text-white font-heading tracking-tight select-none">
                  D
                </span>
              </div>
              <div>
                <h1 className="text-[15px] font-bold tracking-tight leading-tight text-slate-900">
                  DepEd HRIS
                </h1>
                <p className="text-[10px] uppercase tracking-wider text-[#CE1126] font-bold truncate max-w-[140px]">
                  Division of Laguna
                </p>
              </div>
            </div>
            <button
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
              onClick={closeMobileMenu}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-1 -mx-2 px-2 custom-scrollbar">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 mt-2 px-2">
            Navigation
          </div>
          <NavLink
            to="/"
            icon={<Home className="w-[18px] h-[18px]" />}
            onClick={closeMobileMenu}
          >
            Dashboard
          </NavLink>

          {ROLE_NAVIGATION[user.role]?.map((nav, index) => (
            <NavLink
              key={index}
              to={nav.to}
              icon={nav.icon}
              onClick={closeMobileMenu}
            >
              {nav.label}
            </NavLink>
          ))}

          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 mt-6 px-2">
            System
          </div>
          <NavLink
            to="/settings"
            icon={<Settings className="w-[18px] h-[18px]" />}
            onClick={closeMobileMenu}
          >
            Settings
          </NavLink>
        </div>

        <div className="mt-auto pt-5 border-t border-slate-200/60 flex items-center justify-between mx-1 gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              Role
            </span>
            <span className="text-xs font-semibold capitalize truncate pr-2 text-slate-700">
              {user.role.replace("-", " ")}
            </span>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors disabled:opacity-50"
            title="Sign out"
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative lg:pl-[260px] bg-slate-50/30">
        {/* Top Header */}
        <header className="flex justify-between items-center shrink-0 relative z-35 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 md:px-6 py-3.5 w-full sticky top-0">
          <div className="flex items-center space-x-3">
            <button
              className="lg:hidden p-2 -ml-2 mr-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Context Title */}
            <h2 className="hidden lg:block font-bold text-slate-800 text-lg tracking-tight ml-2">
              Division Operations
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <DateTimeDisplay />

            <NotificationDropdown />

            <div className="h-6 w-px bg-slate-200/80 hidden sm:block"></div>

            <UserDropdown
              user={user}
              logout={logout}
              isLoggingOut={isLoggingOut}
              setIsLoggingOut={setIsLoggingOut}
            />
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden w-full p-4 md:p-6 lg:p-8 custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NavLink({
  to,
  icon,
  children,
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
  key?: string | number;
}) {
  const location = useLocation();
  const isActive =
    location.pathname === to ||
    (to !== "/" && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[14px] transition-all duration-300 mx-2 group ${isActive
          ? "bg-gradient-to-r from-[#0038A8] to-[#002B80] font-bold text-white shadow-md shadow-[#0038A8]/20 scale-[1.02] border border-[#0038A8]/10"
          : "text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-100/80 hover:translate-x-1"
        }`}
    >
      <span className={`transition-all duration-300 ${isActive ? "text-white scale-110" : "text-slate-400 group-hover:text-slate-600 group-hover:scale-110"}`}>
        {icon}
      </span>
      <span>{children}</span>
    </Link>
  );
}

function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications: Array<{
    id: number;
    unread: boolean;
    title: string;
    desc: string;
    time: string;
  }> = [];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all ${isOpen ? "bg-slate-100 text-slate-900" : ""}`}
      >
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#CE1126] border-2 border-white shadow-sm"></span>
        <Bell className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden z-50 transform origin-top-right">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-900 text-sm tracking-tight uppercase">Notifications</h3>
            <button className="text-[10px] font-bold text-[#0038A8] uppercase tracking-widest hover:underline">Mark all read</button>
          </div>
          <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
            {notifications.map((notif) => (
              <div key={notif.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer relative ${notif.unread ? "bg-blue-50/30" : ""}`}>
                {notif.unread && <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#0038A8] rounded-full"></div>}
                <p className="text-sm font-bold text-slate-900 leading-tight">{notif.title}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{notif.desc}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-2 uppercase tracking-wide">{notif.time}</p>
              </div>
            ))}
          </div>
          <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
            <button className="text-[11px] font-bold text-slate-500 hover:text-slate-700 uppercase tracking-widest flex items-center justify-center gap-2 w-full">
              View All Activity <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function UserDropdown({
  user,
  logout,
  isLoggingOut,
  setIsLoggingOut,
}: {
  user: any;
  logout: () => void;
  isLoggingOut: boolean;
  setIsLoggingOut: (val: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 pl-2 pr-1 py-1 rounded-full transition-all border ${isOpen ? "bg-slate-50 border-slate-200" : "bg-transparent border-transparent hover:bg-slate-50 hover:border-slate-200"}`}
      >
        <div className="flex flex-col items-end hidden sm:flex">
          <h2 className="font-semibold text-slate-800 leading-none text-sm">
            {user.name}
          </h2>
          <span className="text-[10px] text-slate-500 font-medium capitalize mt-0.5">
            {user.role.replace("-", " ")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0038A8] to-[#002B80] flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-white">
            {user.name.charAt(0)}
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden z-50 transform origin-top-right">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <p className="text-sm font-bold text-slate-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {user.email}
            </p>
          </div>
          <div className="p-2 space-y-1">
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-colors font-medium"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              Account Settings
            </Link>
          </div>
          <div className="p-2 border-t border-slate-100 space-y-1">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors font-medium disabled:opacity-50"
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              ) : (
                <LogOut className="w-4 h-4 shrink-0" />
              )}
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
