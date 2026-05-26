import React, { useState, useEffect } from "react";
import { useAuth } from "../../lib/auth";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "" });

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", {
        headers: { Accept: "application/json" }
      });
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/admin/roles", {
        headers: { Accept: "application/json" }
      });
      const data = await res.json();
      setRoles(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    Promise.all([fetchUsers(), fetchRoles()]).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const endpoint = editingId ? `/api/admin/users/${editingId}` : "/api/admin/users";
      
      const payload: any = { ...formData };
      if (editingId && !payload.password) delete payload.password; // Don't send empty pass on edit

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setShowModal(false);
        fetchUsers();
        setFormData({ name: "", email: "", password: "", role: "" });
        setEditingId(null);
      } else {
        alert("Failed to save user.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" }
      });
      fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const openEdit = (u: any) => {
    setEditingId(u.id);
    setFormData({
      name: u.name,
      email: u.email,
      password: "",
      role: u.roles?.[0]?.name || ""
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="h-8 w-64 bg-slate-200/60 rounded-xl"></div>
            <div className="h-4 w-96 bg-slate-200/60 rounded-lg"></div>
          </div>
          <div className="h-10 w-32 bg-slate-200/60 rounded-xl"></div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-6">
          <div className="space-y-4">
            <div className="h-10 w-full bg-slate-200/60 rounded-xl"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-12 flex-1 bg-slate-100 rounded-xl"></div>
                <div className="h-12 flex-1 bg-slate-100 rounded-xl"></div>
                <div className="h-12 flex-1 bg-slate-100 rounded-xl"></div>
                <div className="h-12 w-24 bg-slate-100 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">User Management</h1>
          <p className="text-slate-500 font-medium mt-1">Manage government personnel roles & access</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ name: "", email: "", password: "", role: "" });
            setShowModal(true);
          }}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="uppercase tracking-wider border-b border-slate-200/80 bg-slate-50/80 backdrop-blur-md text-slate-500 font-bold text-[11px]">
              <tr>
                <th className="px-6 py-5">Name</th>
                <th className="px-6 py-5">Email</th>
                <th className="px-6 py-5">Role</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 text-slate-700">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-900">{u.name}</td>
                  <td className="px-6 py-4 font-medium text-slate-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">
                      {u.roles?.[0]?.name || "No Role"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-end space-x-3">
                    <button onClick={() => openEdit(u)} className="p-2 text-slate-400 hover:text-indigo-600 bg-white rounded-xl border border-slate-200 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteUser(u.id)} className="p-2 text-slate-400 hover:text-rose-600 bg-white rounded-xl border border-slate-200 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">{editingId ? "Edit User" : "Create User"}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors rounded-lg p-1 hover:bg-slate-100">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:border-[#0038A8] focus:ring-1 focus:ring-[#0038A8] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:border-[#0038A8] focus:ring-1 focus:ring-[#0038A8] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Password {editingId && <span className="text-slate-400 font-normal normal-case">(leave blank to keep)</span>}</label>
                <input required={!editingId} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:border-[#0038A8] focus:ring-1 focus:ring-[#0038A8] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Role</label>
                <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:border-[#0038A8] focus:ring-1 focus:ring-[#0038A8] outline-none">
                  <option value="">Select a Role</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#0038A8] text-white hover:bg-[#002B80]">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
