"use client";

import React, { useState } from "react";
import { updateContactInfo } from "@/actions/contact";
import { Save, Loader2, Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";

interface ContactInfoFormProps {
  initialContactInfo: {
    email: string;
    phone: string;
    address: string;
    location: string;
    whatsapp: string;
    telegram: string;
  } | null;
}

export default function ContactInfoForm({ initialContactInfo }: ContactInfoFormProps) {
  const [email, setEmail] = useState(initialContactInfo?.email || "");
  const [phone, setPhone] = useState(initialContactInfo?.phone || "");
  const [address, setAddress] = useState(initialContactInfo?.address || "");
  const [location, setLocation] = useState(initialContactInfo?.location || "");
  const [whatsapp, setWhatsapp] = useState(initialContactInfo?.whatsapp || "");
  const [telegram, setTelegram] = useState(initialContactInfo?.telegram || "");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await updateContactInfo({
      email,
      phone,
      address,
      location,
      whatsapp,
      telegram,
    });

    if (result.success) {
      setMessage({ success: true, text: "Contact details updated successfully!" });
    } else {
      setMessage({ success: false, text: result.error || "Failed to update contact info." });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {message && (
        <div
          className={`p-4 rounded-xl text-xs text-center border font-light ${
            message.success
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Contact Information</h1>
          <p className="text-xs text-[#94A3B8] font-light">
            Manage your public-facing reachability endpoints and social messaging numbers.
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-500 hover:to-violet-600 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Save Changes</span>
        </button>
      </div>

      <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-6">
        <h3 className="text-sm font-semibold text-[#F8FAFC]">Direct Contact Paths</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-sky-400" /> Public Email
            </label>
            <input
              type="email"
              required
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-sm py-2 px-3.5 rounded-xl text-[#F8FAFC] outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" /> Phone Number
            </label>
            <input
              type="text"
              placeholder="+91 XXXXX XXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-sm py-2 px-3.5 rounded-xl text-[#F8FAFC] outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" /> Full Address
            </label>
            <input
              type="text"
              placeholder="Street, City, State, Country"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-sm py-2 px-3.5 rounded-xl text-[#F8FAFC] outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-violet-400" /> Short Location
            </label>
            <input
              type="text"
              placeholder="e.g. Bangalore, India"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-sm py-2 px-3.5 rounded-xl text-[#F8FAFC] outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-6">
        <h3 className="text-sm font-semibold text-[#F8FAFC]">Instant Messaging Handles</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Link / Number
            </label>
            <input
              type="text"
              placeholder="https://wa.me/xxxxxxxxxx or number"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-sm py-2 px-3.5 rounded-xl text-[#F8FAFC] outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-sky-400" /> Telegram Username / Link
            </label>
            <input
              type="text"
              placeholder="https://t.me/username or username"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-sm py-2 px-3.5 rounded-xl text-[#F8FAFC] outline-none transition-all"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
