"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, FileText, Send, Layers } from "lucide-react";
import { incrementResumeDownloads } from "@/actions/resume";

interface HeroProps {
  profile?: {
    name: string;
    title: string;
    heroHeading: string;
    heroDescription: string;
    profilePicture: string;
    heroImage: string;
  } | null;
  resume?: {
    pdfUrl: string;
  } | null;
}

const defaultRoles = [
  "Full Stack Developer",
  "AI Engineer",
  "Machine Learning Enthusiast",
  "Problem Solver",
];

export default function Hero({ profile, resume }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Dynamically resolve roles from profile title or use defaults
  const roles = profile?.title
    ? profile.title.split(",").map((r) => r.trim()).filter((r) => r.length > 0)
    : defaultRoles;

  // Typewriter effect
  useEffect(() => {
    if (roles.length === 0) return;
    let timer: NodeJS.Timeout;
    const currentRole = roles[roleIndex % roles.length];
    const typingSpeed = isDeleting ? 30 : 80;

    if (!isDeleting && displayText === currentRole) {
      timer = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    } else {
      timer = setTimeout(() => {
        setDisplayText(
          isDeleting
            ? currentRole.substring(0, displayText.length - 1)
            : currentRole.substring(0, displayText.length + 1)
        );
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, roles]);

  // Particle network canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particleCount = Math.min(Math.floor((width * height) / 15000), 80);
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
      });
    }

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(56, 189, 248, 0.5)";
      ctx.strokeStyle = "rgba(139, 92, 246, 0.05)";

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      if (mouse.x !== -1000) {
        particles.forEach((p) => {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.25 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleResumeClick = async () => {
    try {
      await incrementResumeDownloads();
    } catch (err) {
      console.error("Failed to increment resume download counter:", err);
    }
  };

  const displayName = profile?.name || "Amit Padhan";
  const displayHeading = profile?.heroHeading || "Hi, I'm Amit Padhan";
  const displayDescription = profile?.heroDescription || "AI Full Stack Developer & Software Engineer";
  const displayAvatar = profile?.profilePicture || "/Amit.jpg";
  const displayBgAvatar = profile?.heroImage || null;

  // Use resume URL if available, otherwise default to legacy static print file
  const resumeUrl = resume?.pdfUrl || "/Amit_Padhan_Resume.html";

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20"
    >
      {/* Canvas Particle Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Grid Overlay */}
      <div className="absolute inset-0 grid-bg opacity-[0.25] pointer-events-none z-0" />

      {/* Floating radial gradient blur orbs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/10 w-[450px] h-[450px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: "-3s" }} />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        {/* Circular Avatar Profile Picture */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-32 h-32 mx-auto mb-6 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary shadow-xl shadow-primary/15"
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 border-2 border-slate-950">
            <img
              src={displayAvatar}
              alt={`${displayName} Profile`}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </motion.div>

        {/* Intro Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-medium uppercase tracking-wider mb-6 font-mono"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {displayDescription}
        </motion.div>

        {/* Main Header Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-4 text-[#F8FAFC]"
        >
          {displayHeading.includes(displayName) ? (
            <>
              {displayHeading.split(displayName)[0]}
              <span className="text-gradient-accent">{displayName}</span>
              {displayHeading.split(displayName)[1]}
            </>
          ) : displayHeading.includes("Amit Padhan") ? (
            <>
              {displayHeading.split("Amit Padhan")[0]}
              <span className="text-gradient-accent">Amit Padhan</span>
              {displayHeading.split("Amit Padhan")[1]}
            </>
          ) : displayHeading.includes("Amit") ? (
            <>
              {displayHeading.split("Amit")[0]}
              <span className="text-gradient-accent">Amit</span>
              {displayHeading.split("Amit")[1]}
            </>
          ) : (
            displayHeading
          )}
        </motion.h1>

        {/* Static Subtitle */}
        {displayBgAvatar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none"
          >
            <img src={displayBgAvatar} alt="Background Art" className="w-[500px] h-[500px] object-contain" />
          </motion.div>
        )}

        {/* Dynamic Typewriter Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="h-10 text-base sm:text-lg md:text-xl text-text-muted font-mono font-light mb-12 flex items-center justify-center gap-1"
        >
          <span>I am a</span>
          <span className="text-primary font-semibold">{displayText}</span>
          <span className="w-1.5 h-5 bg-primary animate-pulse ml-0.5" />
        </motion.div>

        {/* Action Call-to-Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
        >
          <button
            onClick={() => handleNavClick("#projects")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold uppercase tracking-wider bg-gradient-to-r from-primary to-secondary text-text-primary hover:opacity-90 transition-all shadow-lg shadow-primary/10 cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            View Projects
          </button>
          
          <a
            href={resumeUrl}
            target="_blank"
            onClick={handleResumeClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold uppercase tracking-wider bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-text-primary transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            View Resume
          </a>

          <button
            onClick={() => handleNavClick("#contact")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold uppercase tracking-wider bg-transparent hover:bg-white/5 text-text-secondary hover:text-text-primary transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            Contact Me
          </button>
        </motion.div>

        {/* Scroll indicator anchor */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-text-muted cursor-pointer"
          onClick={() => handleNavClick("#about")}
        >
          <span className="text-[10px] font-mono uppercase tracking-widest">Explore</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
