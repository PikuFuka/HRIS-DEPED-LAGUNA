import React, { createContext, useContext, useState, useEffect } from "react";

export type Role =
  | "hrmo"
  | "records"
  | "hrmpsb"
  | "approver"
  | "csc"
  | "applicant"
  | "adas"
  | "sds"
  | "Super Admin"
  | "HR Officer"
  | "Records Officer"
  | "Superintendent"
  | "Supervisor"
  | "Principal"
  | "Employee";

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  roles?: { name: Role }[];
}

type UserPayload = Partial<User> & {
  role?: Role;
  roles?: { name: Role }[];
};

function normalizeRole(role: string): Role {
  const normalized = role.toLowerCase().trim();
  if (normalized === "supervisor") return "Supervisor";
  if (normalized === "principal") return "Principal";
  if (normalized === "sds" || normalized === "superintendent") return "Superintendent";
  if (normalized === "hr officer" || normalized === "hrmo") return "hrmo";
  if (normalized === "records officer" || normalized === "records") return "records";
  if (normalized === "employee" || normalized === "applicant") return "applicant";
  return role as Role;
}

function normalizeUser(user: UserPayload): User {
  const role = normalizeRole(user.role ?? user.roles?.[0]?.name ?? "applicant");

  return {
    id: user.id ?? 0,
    email: user.email ?? "",
    name: user.name ?? "",
    role,
    roles: user.roles,
  };
}

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(";").shift() || "");
  return "";
}

function getHeaders() {
  const headers: Record<string, string> = {
    "Accept": "application/json",
    "Content-Type": "application/json",
  };
  const token = getCookie("XSRF-TOKEN");
  if (token) {
    headers["X-XSRF-TOKEN"] = token;
  }
  return headers;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user", {
        headers: getHeaders(),
        credentials: "same-origin"
      });
      if (res.ok) {
        const data = await res.json();
        const normalizedUser = normalizeUser(data);
        setUser(normalizedUser);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(normalizeUser(JSON.parse(storedUser)));
    }
    
    // Always double check with server
    fetchUser().finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Sanctum CSRF Initialization
      await fetch("/sanctum/csrf-cookie", { method: "GET", credentials: "same-origin" });

      const res = await fetch("/api/login", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
        credentials: "same-origin"
      });
      if (res.ok) {
        const data = await res.json();
        const normalizedUser = normalizeUser(data.user);
        setUser(normalizedUser);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
      } else {
        throw new Error("Login failed");
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        headers: getHeaders(),
        credentials: "same-origin",
      });
    } catch {
      // Even if the server call fails, clear local state
    }
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
