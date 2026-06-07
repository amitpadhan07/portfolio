"use client";

import React, { useState } from "react";
import { createCertification, updateCertification, deleteCertification } from "@/actions/certifications";
import ImageSelector from "./ImageSelector";
import { Plus, Edit, Trash2, X, Save, Loader2, Award, ExternalLink } from "lucide-react";

interface CertificationItem {
  _id: string;
  name: string;
  issuer: string;
  date: string;
  certificateUrl: string;
  image: string;
}

interface CertificationsManagerProps {
  initialCertifications: CertificationItem[];
}

export default function CertificationsManager({ initialCertifications }: CertificationsManagerProps) {
  const [certifications, setCertifications] = useState<CertificationItem[]>(initialCertifications);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCert, setCurrentCert] = useState<Partial<CertificationItem> | null>(null);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");
  const [image, setImage] = useState("");

  const openAddModal = () => {
    setCurrentCert(null);
    setName("");
    setIssuer("");
    setDate("");
    setCertificateUrl("");
    setImage("");
    setIsEditing(true);
  };

  const openEditModal = (cert: CertificationItem) => {
    setCurrentCert(cert);
    setName(cert.name);
    setIssuer(cert.issuer);
    setDate(cert.date);
    setCertificateUrl(cert.certificateUrl || "");
    setImage(cert.image || "");
    setIsEditing(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete certification: "${name}"?`)) return;

    setActionLoading(id);
    const result = await deleteCertification(id);
    if (result.success) {
      setCertifications(certifications.filter((c) => c._id !== id));
    } else {
      alert(result.error || "Failed to delete certification");
    }
    setActionLoading(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { name, issuer, date, certificateUrl, image };

    if (currentCert?._id) {
      const result = await updateCertification(currentCert._id, payload);
      if (result.success && result.data) {
        setCertifications(
          certifications.map((c) => (c._id === currentCert._id ? (result.data as CertificationItem) : c))
        );
        setIsEditing(false);
      } else {
        setError(result.error || "Failed to update certification");
      }
    } else {
      const result = await createCertification(payload);
      if (result.success && result.data) {
        setCertifications([...certifications, result.data as CertificationItem]);
        setIsEditing(false);
      } else {
        setError(result.error || "Failed to create certification");
      }
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Certifications</h1>
          <p className="text-xs text-[#94A3B8] font-light">Showcase your verified technical accreditations.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-500 hover:to-violet-600 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-500/10 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Certification
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="bg-white/[0.01] border border-white/5 p-12 text-center rounded-2xl">
          <Award className="w-8 h-8 mx-auto mb-3 text-[#64748B]" />
          <p className="text-sm text-[#94A3B8]">No certifications added yet.</p>
          <button
            onClick={openAddModal}
            className="text-xs text-sky-400 hover:underline mt-2 font-semibold"
          >
            Add your first certification
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert._id}
              className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-all group relative overflow-hidden"
            >
              {cert.image && (
                <div className="h-32 -mx-5 -mt-5 mb-4 overflow-hidden border-b border-white/5 relative bg-slate-950/40">
                  <img src={cert.image} alt={cert.name} className="w-full h-full object-cover" />
                </div>
              )}
              
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm text-[#F8FAFC]">{cert.name}</h3>
                  <Award className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                </div>
                <p className="text-xs text-[#94A3B8] font-light">{cert.issuer} | {cert.date}</p>
                
                {cert.certificateUrl && (
                  <a
                    href={cert.certificateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-[10px] text-sky-400 hover:underline font-mono"
                  >
                    <span>Verify Link</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/5 justify-end">
                <button
                  onClick={() => openEditModal(cert)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.03] text-xs font-semibold text-sky-400 cursor-pointer"
                >
                  <Edit className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(cert._id, cert.name)}
                  disabled={actionLoading === cert._id}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {actionLoading === cert._id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Trash2 className="w-3 h-3" />
                  )}
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
          
          <div className="bg-[#0B0F1E] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col">
            <div className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-[#090D18]">
              <h2 className="font-bold text-sm text-[#F8FAFC]">
                {currentCert ? "Edit Certification Details" : "Add Certification"}
              </h2>
              <button onClick={() => setIsEditing(false)} className="text-[#94A3B8] hover:text-[#F8FAFC] p-1.5 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-light">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Certification Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Database Management Systems"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Issuing Organization</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NPTEL / Google"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Date Issued</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2025"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Verification URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={certificateUrl}
                    onChange={(e) => setCertificateUrl(e.target.value)}
                    className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none"
                  />
                </div>
              </div>

              <ImageSelector
                value={image}
                onChange={setImage}
                label="Certificate Badge / Document Preview"
                folder="certifications"
              />

              <div className="h-14 flex items-center justify-end gap-3 border-t border-white/5 pt-5 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-xs font-semibold text-[#F8FAFC] hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-500 hover:to-violet-600 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-500/10 cursor-pointer disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{currentCert ? "Save Changes" : "Create Certification"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
