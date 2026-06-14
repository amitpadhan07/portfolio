"use client";

import React, { useState } from "react";
import { createCertification, updateCertification, deleteCertification } from "@/actions/certifications";
import { uploadImageAction } from "@/actions/media";
import { Plus, Edit, Trash2, X, Save, Loader2, Award, ExternalLink, FileText, Image, Upload } from "lucide-react";

interface CertificationItem {
  _id: string;
  name: string;
  issuer: string;
  date: string;
  certificateUrl: string;
  image: string; // Keeps sync with fileUrl
  fileType: "image" | "pdf";
  fileUrl: string;
  issuerLogo?: string;
}

interface CertificationsManagerProps {
  initialCertifications: CertificationItem[];
}

const PRESET_LOGOS = [
  { name: "AWS", url: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
  { name: "Google", url: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" },
  { name: "Microsoft", url: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { name: "Cisco", url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg" },
  { name: "NPTEL", url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/NPTEL_Logo.png" },
  { name: "Coursera", url: "https://upload.wikimedia.org/wikipedia/commons/9/97/Coursera-Logo_New.svg" },
  { name: "Udemy", url: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Udemy_logo.svg" },
  { name: "Oracle", url: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg" },
];

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
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState<"image" | "pdf">("image");
  const [issuerLogo, setIssuerLogo] = useState("");

  // Upload States
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  const certFileInputRef = React.useRef<HTMLInputElement>(null);
  const logoFileInputRef = React.useRef<HTMLInputElement>(null);

  const openAddModal = () => {
    setCurrentCert(null);
    setName("");
    setIssuer("");
    setDate("");
    setCertificateUrl("");
    setFileUrl("");
    setFileType("image");
    setIssuerLogo("");
    setFileError(null);
    setLogoError(null);
    setIsEditing(true);
  };

  const openEditModal = (cert: CertificationItem) => {
    setCurrentCert(cert);
    setName(cert.name);
    setIssuer(cert.issuer);
    setDate(cert.date);
    setCertificateUrl(cert.certificateUrl || "");
    setFileUrl(cert.fileUrl || cert.image || "");
    setFileType(cert.fileType || "image");
    setIssuerLogo(cert.issuerLogo || "");
    setFileError(null);
    setLogoError(null);
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

  const handleCertFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setFileError("File is too large. Maximum size is 10MB.");
      return;
    }

    setUploadingFile(true);
    setFileError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "certifications");

      const result = await uploadImageAction(formData);
      if (result.success && result.url) {
        setFileUrl(result.url);
        const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
        setFileType(isPdf ? "pdf" : "image");
      } else {
        setFileError(result.error || "Upload failed");
      }
    } catch (err: any) {
      setFileError("Upload failed: " + err.message);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setLogoError("Logo file is too large. Maximum size is 5MB.");
      return;
    }

    setUploadingLogo(true);
    setLogoError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "certifications");

      const result = await uploadImageAction(formData);
      if (result.success && result.url) {
        setIssuerLogo(result.url);
      } else {
        setLogoError(result.error || "Upload failed");
      }
    } catch (err: any) {
      setLogoError("Upload failed: " + err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name,
      issuer,
      date,
      certificateUrl,
      image: fileUrl,
      fileUrl,
      fileType,
      issuerLogo,
    };

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
          {certifications.map((cert) => {
            const hasLogo = !!cert.issuerLogo;
            const isPdf = cert.fileType === "pdf" || (cert.fileUrl || "").toLowerCase().endsWith(".pdf");
            const previewUrl = cert.fileUrl || cert.image;

            return (
              <div
                key={cert._id}
                className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-all group relative overflow-hidden"
              >
                {previewUrl && (
                  <div className="h-32 -mx-5 -mt-5 mb-4 overflow-hidden border-b border-white/5 relative bg-slate-950/40 flex items-center justify-center">
                    {isPdf ? (
                      <div className="flex flex-col items-center justify-center text-[#94A3B8] gap-1.5">
                        <FileText className="w-8 h-8 text-rose-400" />
                        <span className="text-[10px] font-mono">PDF Document Certificate</span>
                      </div>
                    ) : (
                      <img src={previewUrl} alt={cert.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                )}
                
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-sm text-[#F8FAFC] line-clamp-1">{cert.name}</h3>
                    {hasLogo ? (
                      <img
                        src={cert.issuerLogo}
                        alt="Issuer Logo"
                        className="w-5 h-5 object-contain flex-shrink-0 bg-white/5 rounded p-0.5"
                      />
                    ) : (
                      <Award className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    )}
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
            );
          })}
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
          
          <div className="bg-[#0B0F1E] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-[#090D18] flex-shrink-0">
              <h2 className="font-bold text-sm text-[#F8FAFC]">
                {currentCert ? "Edit Certification Details" : "Add Certification"}
              </h2>
              <button onClick={() => setIsEditing(false)} className="text-[#94A3B8] hover:text-[#F8FAFC] p-1.5 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
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

              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Upload Certificate File (.pdf, .jpg, .jpeg, .png, .webp)</span>
                
                {fileUrl ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-white/10">
                    {fileType === "pdf" ? (
                      <FileText className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    ) : (
                      <Image className="w-5 h-5 text-sky-400 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#F8FAFC] font-semibold truncate">Certificate Uploaded</p>
                      <a href={fileUrl} target="_blank" rel="noreferrer" className="text-[9px] text-sky-400 hover:underline truncate block font-mono">
                        View file
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFileUrl("")}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer text-[10px] font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => certFileInputRef.current?.click()}
                    className="w-full h-24 rounded-xl border border-dashed border-white/10 hover:border-sky-500/50 bg-white/[0.01] hover:bg-white/[0.02] flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all group"
                  >
                    {uploadingFile ? (
                      <>
                        <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
                        <span className="text-[10px] text-[#94A3B8] font-mono">Uploading to Cloudinary...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-[#64748B] group-hover:text-sky-400 transition-colors" />
                        <span className="text-[10px] text-[#94A3B8] font-mono group-hover:text-[#F8FAFC]">Upload Document (Max 10MB)</span>
                      </>
                    )}
                  </div>
                )}
                {fileError && <span className="text-[10px] text-rose-400 font-light">{fileError}</span>}
                <input
                  type="file"
                  ref={certFileInputRef}
                  onChange={handleCertFileChange}
                  accept=".pdf,image/*"
                  className="hidden"
                />
              </div>

              <div className="flex flex-col gap-2.5 pt-2 border-t border-white/5">
                <span className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Issuer Logo (Select Preset OR Upload Custom)</span>

                <div className="grid grid-cols-4 gap-2">
                  {PRESET_LOGOS.map((logo) => {
                    const isSelected = issuerLogo === logo.url;
                    return (
                      <button
                        type="button"
                        key={logo.name}
                        onClick={() => setIssuerLogo(logo.url)}
                        className={`px-2 py-1.5 rounded-lg border text-[10px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-sky-500/10 border-sky-400 text-sky-400 shadow-md shadow-sky-500/5"
                            : "bg-white/[0.01] border-white/5 hover:border-white/10 text-[#94A3B8] hover:text-[#F8FAFC]"
                        }`}
                      >
                        <img src={logo.url} alt={logo.name} className="w-3.5 h-3.5 object-contain" />
                        <span>{logo.name}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-1.5 mt-1">
                  {issuerLogo ? (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-white/10">
                      <img src={issuerLogo} alt="Logo Preview" className="w-6 h-6 object-contain bg-white/5 rounded p-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-[#F8FAFC] font-semibold truncate">Issuer Logo Selected</p>
                        <span className="text-[8px] text-[#64748B] block truncate font-mono">{issuerLogo}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIssuerLogo("")}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer text-[10px] font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => logoFileInputRef.current?.click()}
                      className="w-full h-16 rounded-xl border border-dashed border-white/10 hover:border-sky-500/50 bg-white/[0.01] hover:bg-white/[0.02] flex flex-col items-center justify-center gap-1 cursor-pointer transition-all group"
                    >
                      {uploadingLogo ? (
                        <>
                          <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />
                          <span className="text-[9px] text-[#94A3B8] font-mono">Uploading Logo...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-[#64748B] group-hover:text-sky-400 transition-colors" />
                          <span className="text-[9px] text-[#94A3B8] font-mono group-hover:text-[#F8FAFC]">Upload Custom Logo (.svg, .png, .jpg)</span>
                        </>
                      )}
                    </div>
                  )}
                  {logoError && <span className="text-[10px] text-rose-400 font-light">{logoError}</span>}
                  <input
                    type="file"
                    ref={logoFileInputRef}
                    onChange={handleLogoFileChange}
                    accept=".svg,.png,.jpg,.jpeg,.webp"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="h-14 flex items-center justify-end gap-3 border-t border-white/5 pt-5 mt-6 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-xs font-semibold text-[#F8FAFC] hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploadingFile || uploadingLogo || !fileUrl}
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
