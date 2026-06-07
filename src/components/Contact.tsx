"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { Mail, Phone, Send, AlertCircle, CheckCircle2, MessageSquare, MapPin } from "lucide-react";
import * as LucideIcons from "lucide-react";
import confetti from "canvas-confetti";

interface ContactInfoItem {
  email: string;
  phone: string;
  address: string;
  location: string;
  whatsapp: string;
  telegram: string;
}

interface SocialLinkItem {
  platform: string;
  url: string;
  icon: string;
}

interface ContactProps {
  contactInfo?: ContactInfoItem | null;
  socialLinks?: SocialLinkItem[];
}

export default function Contact({ contactInfo, socialLinks = [] }: ContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#38bdf8", "#8b5cf6", "#ffffff"],
        });
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    }
  };

  const displayEmail = contactInfo?.email || "padhanamit072006@gmail.com";
  const displayPhone = contactInfo?.phone || "+91 75057 95679";
  const displayLocation = contactInfo?.location || "India";

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#0a0f1d]/40">
      {/* Background decoration orbs */}
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-widest font-mono mb-3"
          >
            Connection
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-gradient"
          >
            Get In Touch
          </motion.h2>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Details Grid */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <SpotlightCard className="p-8 flex-grow flex flex-col justify-between">
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-bold text-text-primary">Contact Details</h3>
                  <p className="text-xs text-text-muted mt-1">Feel free to drop a message or reach out on socials.</p>
                </div>

                <div className="space-y-5">
                  {/* Email */}
                  <a
                    href={`mailto:${displayEmail}`}
                    className="flex items-center gap-4 group/item cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary group-hover/item:text-primary group-hover/item:border-primary/50 transition-all">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-mono uppercase text-text-muted">Email</span>
                      <span className="text-sm text-text-primary group-hover/item:text-primary transition-colors truncate">
                        {displayEmail}
                      </span>
                    </div>
                  </a>

                  {/* Phone */}
                  {displayPhone && (
                    <a
                      href={`tel:${displayPhone.replace(/\s+/g, "")}`}
                      className="flex items-center gap-4 group/item cursor-pointer"
                    >
                      <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary group-hover/item:text-primary group-hover/item:border-primary/50 transition-all">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-mono uppercase text-text-muted">Phone Number</span>
                        <span className="text-sm text-text-primary group-hover/item:text-primary transition-colors truncate">
                          {displayPhone}
                        </span>
                      </div>
                    </a>
                  )}

                  {/* Location */}
                  {displayLocation && (
                    <div className="flex items-center gap-4 group/item">
                      <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-mono uppercase text-text-muted">Location</span>
                        <span className="text-sm text-text-primary">
                          {displayLocation}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Social links (GitHub, LinkedIn, Telegram etc loaded from active profiles) */}
                  {socialLinks.map((link, idx) => {
                    const IconComp = (LucideIcons as any)[link.icon] || MessageSquare;
                    return (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 group/item cursor-pointer"
                      >
                        <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary group-hover/item:text-primary group-hover/item:border-primary/50 transition-all">
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] font-mono uppercase text-text-muted">{link.platform}</span>
                          <span className="text-sm text-text-primary group-hover/item:text-primary transition-colors truncate font-mono">
                            {link.url.replace(/^https?:\/\/(www\.)?/, "")}
                          </span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Right Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex"
          >
            <SpotlightCard className="p-8 w-full flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-6">Send Message</h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-xs font-mono uppercase text-text-muted">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-text-primary placeholder:text-text-muted focus:border-primary/80 focus:bg-white/[0.08] outline-none transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-xs font-mono uppercase text-text-muted">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-text-primary placeholder:text-text-muted focus:border-primary/80 focus:bg-white/[0.08] outline-none transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="subject" className="text-xs font-mono uppercase text-text-muted">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="General Inquiry"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-text-primary placeholder:text-text-muted focus:border-primary/80 focus:bg-white/[0.08] outline-none transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-xs font-mono uppercase text-text-muted">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Write your project details or inquiries here..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-text-primary placeholder:text-text-muted focus:border-primary/80 focus:bg-white/[0.08] outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold uppercase tracking-wider bg-gradient-to-r from-primary to-secondary text-text-primary hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? (
                      <>
                        <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-4 min-h-12 flex flex-col justify-end">
                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs"
                    >
                      <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0" />
                      <span>Message received successfully! I will respond shortly.</span>
                    </motion.div>
                  )}
                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs"
                    >
                      <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
