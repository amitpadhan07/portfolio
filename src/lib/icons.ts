import React from "react";
import {
  Send,
  Globe,
  Mail,
  Link2,
  MessageSquare,
  // Achievements
  FolderGit2,
  Code,
  Zap,
  Layers,
  Code2,
  Sparkles,
  Trophy,
  Award,
  Cpu,
  Terminal,
  BookOpen,
} from "lucide-react";

// Custom props interface to support size mapping
interface BrandIconProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number | string;
}

// Standard SVG wrapper for custom brand icons using React.createElement
const createBrandIcon = (children: React.ReactNode) => {
  const IconComponent = React.forwardRef<SVGSVGElement, BrandIconProps>(
    ({ size = 24, className = "", ...props }, ref) => {
      return React.createElement(
        "svg",
        {
          ref,
          xmlns: "http://www.w3.org/2000/svg",
          width: size,
          height: size,
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          className,
          ...props,
        },
        children
      );
    }
  );
  IconComponent.displayName = "BrandIcon";
  return IconComponent;
};

// Custom SVG components using React.createElement to keep it in a pure .ts file
export const Github = createBrandIcon(
  React.createElement(
    React.Fragment,
    null,
    React.createElement("path", {
      d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",
    }),
    React.createElement("path", { d: "M9 18c-4.51 2-5-2-7-2" })
  )
);

export const Linkedin = createBrandIcon(
  React.createElement(
    React.Fragment,
    null,
    React.createElement("path", {
      d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",
    }),
    React.createElement("rect", { width: "4", height: "12", x: "2", y: "9" }),
    React.createElement("circle", { cx: "4", cy: "4", r: "2" })
  )
);

export const Instagram = createBrandIcon(
  React.createElement(
    React.Fragment,
    null,
    React.createElement("rect", {
      width: "20",
      height: "20",
      x: "2",
      y: "2",
      rx: "5",
      ry: "5",
    }),
    React.createElement("path", {
      d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",
    }),
    React.createElement("line", { x1: "17.5", x2: "17.51", y1: "6.5", y2: "6.5" })
  )
);

export const Twitter = createBrandIcon(
  React.createElement("path", {
    d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
  })
);

export const Youtube = createBrandIcon(
  React.createElement(
    React.Fragment,
    null,
    React.createElement("path", {
      d: "M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z",
    }),
    React.createElement("polygon", { points: "10 15 15 12 10 9" })
  )
);

export const Facebook = createBrandIcon(
  React.createElement("path", {
    d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  })
);

// Social icon map (normalized to lowercase keys for case-insensitive lookup)
const socialIconMap: Record<string, React.ComponentType<any>> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  telegram: Send,
  send: Send,
  twitter: Twitter,
  youtube: Youtube,
  facebook: Facebook,
  globe: Globe,
  mail: Mail,
  link2: Link2,
  messagesquare: MessageSquare,
};

// Achievement icon map (normalized to lowercase keys for case-insensitive lookup)
const achievementIconMap: Record<string, React.ComponentType<any>> = {
  foldergit2: FolderGit2,
  code: Code,
  zap: Zap,
  layers: Layers,
  code2: Code2,
  sparkles: Sparkles,
  trophy: Trophy,
  award: Award,
  cpu: Cpu,
  terminal: Terminal,
  bookopen: BookOpen,
};

/**
 * Returns the Lucide icon component associated with the social platform or icon name.
 * Falls back to Link2 if not found.
 */
export function getSocialIcon(iconName: string): React.ComponentType<any> {
  if (!iconName) return Link2;
  const normalized = iconName.trim().toLowerCase();
  return socialIconMap[normalized] || Link2;
}

/**
 * Returns the Lucide icon component associated with the achievement icon name.
 * Falls back to Sparkles if not found.
 */
export function getAchievementIcon(iconName: string): React.ComponentType<any> {
  if (!iconName) return Sparkles;
  const normalized = iconName.trim().toLowerCase();
  return achievementIconMap[normalized] || Sparkles;
}
