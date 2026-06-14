"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("home");
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Hide public navigation elements in the administrative portal
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Set background opacity on scroll
      setScrolled(window.scrollY > 20);

      // Detect active section
      const sections = navLinks.map(link => link.href.substring(1));
      const scrollPosition = window.scrollY + 150; // offset

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleClick(e, "#home")}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold font-mono text-sm text-text-primary shadow-lg shadow-primary/10 transition-transform group-hover:scale-105">
            AP
          </div>
          <span className="text-sm font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary uppercase font-mono transition-opacity group-hover:opacity-85">
            Amit.Dev
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full glass-effect shadow-lg shadow-black/10">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className={`relative px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-full transition-all ${
                  isActive
                    ? "text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute inset-0 bg-white/5 rounded-full border border-white/5"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Contact CTA */}
        <div className="hidden md:block">
          <a
            href="#contact"
            onClick={(e) => handleClick(e, "#contact")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 text-text-primary transition-all group cursor-pointer"
          >
            Hire Me
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-text-primary hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 p-6 mx-6 mt-2 rounded-2xl glass-effect shadow-2xl md:hidden flex flex-col gap-4"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleClick(e, link.href)}
                    className={`px-4 py-3 text-sm font-medium tracking-wide uppercase rounded-xl transition-all flex items-center justify-between ${
                      isActive
                        ? "bg-primary/10 text-primary border-l-2 border-primary"
                        : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                    }`}
                  >
                    {link.name}
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </a>
                );
              })}
            </nav>
            <a
              href="#contact"
              onClick={(e) => handleClick(e, "#contact")}
              className="flex items-center justify-center gap-1.5 py-3.5 rounded-xl text-sm font-semibold uppercase tracking-wider bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-text-primary transition-all"
            >
              Get In Touch
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
