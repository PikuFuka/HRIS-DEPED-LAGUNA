import React, { useState, useEffect } from "react";
import { format } from "date-fns";

export default function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/activity-logs", {
      headers: { Accept: "application/json" }
    })
      .then(res => res.json())
      .then(data => {
        // data could be paginated depending on backend, we'll assume it's under data.data if paginated 
        const items = data.data || data;
        setLogs(Array.isArray(items) ? items : []);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLogs([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="space-y-3">
          <div className="h-8 w-48 bg-slate-200/60 rounded-xl"></div>
          <div className="h-4 w-80 bg-slate-200/60 rounded-lg"></div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-6">
          <div className="space-y-4">
            <div className="h-10 w-full bg-slate-200/60 rounded-xl"></div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-12 w-40 bg-slate-100 rounded-xl"></div>
                <div className="h-12 flex-1 bg-slate-100 rounded-xl"></div>
                <div className="h-12 flex-1 bg-slate-100 rounded-xl"></div>
                <div className="h-12 flex-1 bg-slate-100 rounded-xl"></div>
                <div className="h-12 w-48 bg-slate-100 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Audit Trail</h1>
        <p className="text-slate-500 font-medium mt-1">System-wide activity, logins, and data modifications.</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="uppercase tracking-wider border-b border-slate-200/80 bg-slate-50/80 backdrop-blur-md text-slate-500 font-bold text-[11px] whitespace-nowrap">
              <tr>
                <th className="px-6 py-5">Timestamp</th>
                <th className="px-6 py-5">Action</th>
                <th className="px-6 py-5">Subject</th>
                <th className="px-6 py-5">Causer</th>
                <th className="px-6 py-5">Additional Meta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 text-slate-700">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-medium text-[12px] tabular-nums">
                    {format(new Date(log.created_at), "MMM d, yyyy HH:mm:ss")}
                  </td>
                  <td className="px-6 py-4 font-bold text-indigo-700">{log.description}</td>
                  <td className="px-6 py-4">
                    {log.subject_type ? (
                      <span className="text-[10px] font-bold tracking-widest bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg uppercase">
                        {log.subject_type.split("\\").pop()} #{log.subject_id}
                      </span>
                    ) : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900">{log.causer?.name || "System"}</span>
                    {log.causer?.email && <div className="text-[11px] text-slate-400 mt-0.5">{log.causer.email}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <pre className="text-[10px] bg-slate-50/80 p-3 rounded-xl text-slate-500 border border-slate-200/60 max-w-[300px] overflow-auto custom-scrollbar shadow-inner">
                      {JSON.stringify(log.properties, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">No activity logs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
