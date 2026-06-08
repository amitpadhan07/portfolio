"use client";

import { ArrowUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { getSocialIcon } from "@/lib/icons";

interface SocialLinkItem {
  platform: string;
  url: string;
  icon: string;
}

interface FooterProps {
  socialLinks?: SocialLinkItem[];
}

export default function Footer({ socialLinks = [] }: FooterProps) {
  const pathname = usePathname();

  // Hide public footer in the administrative portal
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/5 bg-[#0a0f1d] py-12 overflow-hidden">
      {/* Decorative blurred background orb */}
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand logo & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold font-mono text-xs text-text-primary shadow-lg shadow-primary/5">
              AP
            </div>
            <span className="text-sm font-semibold tracking-wider text-text-primary uppercase font-mono">
              Amit.Dev
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            © {new Date().getFullYear()} Amit Padhan. Built with Next.js & Tailwind.
          </p>
        </div>

        {/* Center: Social links */}
        <div className="flex items-center gap-4">
          {socialLinks.map((link, idx) => {
            const IconComponent = getSocialIcon(link.icon);
            return (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                aria-label={`${link.platform} Profile`}
              >
                <IconComponent className="w-4 h-4" />
              </a>
            );
          })}
        </div>

        {/* Right: Scroll-to-top button */}
        <button
          onClick={scrollToTop}
          className="group w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-text-primary hover:border-primary/50 flex items-center justify-center transition-all cursor-pointer"
          title="Scroll to Top"
        >
          <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </footer>
  );
}
