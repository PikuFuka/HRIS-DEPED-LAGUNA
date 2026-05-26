import { FileText, Hammer } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function Placeholder() {
  const loc = useLocation();
  const path = loc.pathname.replace("/", "").replace(/-/g, " ");

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200 m-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-white shadow-sm rounded-2xl flex items-center justify-center text-gray-400 mb-6 border border-gray-100">
        <Hammer className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 capitalize mb-2">
        {path} Module
      </h2>
      <p className="text-gray-500 max-w-md text-center">
        This module is currently under construction. It will be available in the
        next release.
      </p>
    </div>
  );
}
