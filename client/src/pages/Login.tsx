import React, { useState } from "react";
import { useAuth } from "../lib/auth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Loader2, ShieldCheck, ArrowRight, Award } from "lucide-react";
import { SmartImage } from "../components/ui/SmartImage";
import { motion } from "motion/react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (activeTab === "signup") {
      if (!username || !password) {
        setErrorMsg("Email and password are required");
        return;
      }
      // Redirect to register page with current credentials
      navigate("/register", { 
        state: { 
          email: username, 
          password: password,
          directToOtp: true 
        } 
      });
      return;
    }

    if (!username) {
      setErrorMsg("Please enter your email or username");
      return;
    }
    setLoading(true);
    try {
      await login(username.trim().toLowerCase());
      navigate("/", { replace: true });
    } catch (e) {
      setErrorMsg("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Backend OAuth logic will be implemented here
      // Fallback for UI prototype
      await login("applicant");
      navigate("/", { replace: true });
    } catch (e) {
      alert("Google Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans bg-slate-50">
      {/* Left side - Branded Area */}
      <div className="hidden lg:flex flex-col w-[50%] xl:w-[55%] relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-slate-950">
          {/* The object-[20%_center] shifts the image to the left. You can tweak the '20%' (e.g., to 10%, 0%, or -10%) to shift it more or less. */}
          <SmartImage
            src="/banner.png"
            alt="Department of Education"
            className="absolute inset-0 w-full h-full object-[5%_center]"
            placeholderClassName="bg-slate-900"
            loading="eager"
            fetchPriority="high"
          />
          {/* A slight 10% dark tint overlay */}
          <div className="absolute inset-0 bg-black/15 z-15"></div>

          {/* Add a very subtle bottom gradient to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent z-10"></div>

          {/* Subtle accent lines */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0038A8] rounded-full filter blur-[120px] opacity-30 -translate-y-1/2 translate-x-1/2 z-10" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#CE1126] rounded-full filter blur-[150px] opacity-20 translate-y-1/3 -translate-x-1/3 z-10" />
        </div>

        {/* Content over image */}
        <div className="relative z-20 flex flex-col justify-end h-full p-16 xl:p-24 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 mb-8 shadow-lg">
              <Award className="w-8 h-8 text-[#FCD116]" />
            </div>
            <h1 className="text-4xl xl:text-6xl font-normal tracking-tight mb-6 text-white leading-[1.15] w-[95%] text-shadow-sm">
              Department of Education <br />
              <span className="font-bold">Human Resources Information System</span>
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-[50%] xl:w-[45%] flex items-center justify-center p-6 sm:p-12 lg:p-20 relative bg-white z-20 shadow-[-20px_0_40px_-5px_rgba(0,0,0,0.05)]">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[420px] space-y-8 relative z-10"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-3">
              Welcome to HRIS
            </h2>
            <p className="text-slate-500 text-sm">
              Log in to access workflows, applications, and your portal.
            </p>
          </div>

          <div className="flex border-b border-slate-200 mb-8 relative">
            <button
              onClick={() => setActiveTab("signin")}
              className={`flex-1 pb-3 text-[13px] font-bold uppercase tracking-wider transition-colors relative z-10 ${
                activeTab === "signin"
                  ? "text-slate-900"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 pb-3 text-[13px] font-bold uppercase tracking-wider transition-colors relative z-10 ${
                activeTab === "signup"
                  ? "text-slate-900"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Apply Now
            </button>
            <div
              className="absolute bottom-0 h-0.5 bg-slate-900 transition-all duration-300 ease-out z-20"
              style={{
                width: "50%",
                left: activeTab === "signin" ? "0%" : "50%",
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center space-x-2 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            <svg width="20" height="20" viewBox="0 0 48 48" className="mr-2">
              <path
                fill="#FFC107"
                d="M43.6 20.1H42V20H24v8h11.3C34.7 32.8 30.6 36 24 36c-7.3 0-13.4-5.4-14.7-12.4-.1-.5-.2-1-.2-1.6s.1-1.1.2-1.6C10.6 13.4 16.7 8 24 8c3.2 0 6.1 1.2 8.4 3.2L38 5.6C34.3 2.1 29.4 0 24 0 14.6 0 6.5 5.4 2.5 13.3 1 16.7.1 20.3.1 24s.9 7.3 2.4 10.7c4 7.9 12.1 13.3 21.5 13.3 10.4 0 19.3-7.5 20.9-17.7.1-.6.2-1.3.2-1.9 0-.9-.1-1.8-.3-2.6L43.6 20.1z"
              ></path>
              <path
                fill="#FF3D00"
                d="M24 8c3.2 0 6.1 1.2 8.4 3.2L38 5.6C34.3 2.1 29.4 0 24 0 14.6 0 6.5 5.4 2.5 13.3l7.9 6.1C12.3 13.6 17.7 8 24 8z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24 48c6 0 11.2-2.1 15-5.6l-7.7-6C29.3 38.3 26.8 39.2 24 39.2c-6.1 0-11.4-4.1-13.3-9.7l-7.9 6.2C6.8 42.8 14.8 48 24 48z"
              ></path>
              <path
                fill="#1976D2"
                d="M47.7 24.3c0-.9-.1-1.8-.3-2.6L43.6 20.1H42V20H24v8h11.3c-.6 2.4-2.1 4.5-4 5.9l7.7 6C42.8 36.3 47.7 30.9 47.7 24.3z"
              ></path>
            </svg>
            <span className="text-slate-700 font-semibold text-sm">
              Continue with Google
            </span>
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-4 text-[10px] tracking-widest uppercase font-bold text-slate-400">
              Or continue with email
            </span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="block text-xs uppercase tracking-wider font-bold text-slate-500 mb-2"
                >
                  Email
                </label>
                <input
                  id="username"
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-[#0038A8] focus:ring-2 focus:ring-[#0038A8]/20 transition-all sm:text-sm outline-none"
                  placeholder="admin@admin.com"
                  autoComplete="username"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs uppercase tracking-wider font-bold text-slate-500 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Rolan123"
                  className="block w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-[#0038A8] focus:ring-2 focus:ring-[#0038A8]/20 transition-all sm:text-sm outline-none"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              data-testid="login-submit"
              className="w-full h-12 mt-8 rounded-xl text-sm font-semibold bg-[#0038A8] text-white hover:bg-[#002B80] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center disabled:opacity-70 disabled:pointer-events-none group relative overflow-hidden"
              disabled={loading}
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-12" />
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  {activeTab === "signup"
                    ? "Create Applicant Account"
                    : "Sign In"}
                  <ArrowRight className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100 transition-all" />
                </>
              )}
            </button>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
                data-testid="login-error"
              >
                <p className="text-sm font-medium text-red-500">{errorMsg}</p>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
