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
export const Github = React.forwardRef<SVGSVGElement, BrandIconProps>(
  ({ size = 24, className = "", ...props }, ref) => (
    React.createElement(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "#F8FAFC",
        className,
        ...props,
      },
      React.createElement("path", {
        d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
      })
    )
  )
);
Github.displayName = "Github";

export const Linkedin = React.forwardRef<SVGSVGElement, BrandIconProps>(
  ({ size = 24, className = "", ...props }, ref) => (
    React.createElement(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        className,
        ...props,
      },
      React.createElement("rect", { width: "24", height: "24", rx: "4", fill: "#0A66C2" }),
      React.createElement("path", {
        fill: "#FFFFFF",
        d: "M6.5 20h-3V9h3v11zM4.75 7.65c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zM20.5 20h-3v-5.604c0-3.368-4-3.113-4 0V20h-3V9h3v1.765c1.396-2.586 7-2.777 7 2.476V20z"
      })
    )
  )
);
Linkedin.displayName = "Linkedin";

export const Telegram = React.forwardRef<SVGSVGElement, BrandIconProps>(
  ({ size = 24, className = "", ...props }, ref) => (
    React.createElement(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        className,
        ...props,
      },
      React.createElement("circle", { cx: "12", cy: "12", r: "12", fill: "#229ED9" }),
      React.createElement("path", {
        fill: "#FFFFFF",
        d: "M17.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.869 4.325-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.46c.536-.196 1.006.128.832.93z"
      })
    )
  )
);
Telegram.displayName = "Telegram";

export const Instagram = React.forwardRef<SVGSVGElement, BrandIconProps>(
  ({ size = 24, className = "", ...props }, ref) => (
    React.createElement(
      "svg",
      {
        ref,
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        className,
        ...props,
      },
      React.createElement(
        "defs",
        null,
        React.createElement(
          "radialGradient",
          { id: "instagram-gradient-icon", cx: "30%", cy: "107%", r: "130%" },
          React.createElement("stop", { offset: "0%", stopColor: "#fdf497" }),
          React.createElement("stop", { offset: "5%", stopColor: "#fdf497" }),
          React.createElement("stop", { offset: "45%", stopColor: "#fd5949" }),
          React.createElement("stop", { offset: "60%", stopColor: "#d6249f" }),
          React.createElement("stop", { offset: "90%", stopColor: "#285AEB" })
        )
      ),
      React.createElement("rect", { width: "24", height: "24", rx: "5", fill: "url(#instagram-gradient-icon)" }),
      React.createElement("path", {
        fill: "#FFFFFF",
        d: "M12 5.838c2.007 0 2.244.008 3.037.044.734.034 1.132.157 1.397.26.35.136.6.3.863.563.262.263.427.513.563.863.103.265.226.663.26 1.397.036.793.044 1.03.044 3.037s-.008 2.244-.044 3.037c-.034.734-.157 1.132-.26 1.397-.136.35-.3.6-.563.863-.263.262-.513.427-.863.563-.265.103-.663.226-1.397.26-.793.036-1.03.044-3.037.044s-2.244-.008-3.037-.044c-.734-.034-1.132-.157-1.397-.26-.35-.136-.6-.3-.863-.563-.262-.263-.427-.513-.563-.863-.103-.265-.226-.663-.26-1.397-.036-.793-.044-1.03-.044-3.037s.008-2.244.044-3.037c.034-.734.157-1.132.26-1.397.136-.35.3-.6.563-.863.263-.262.513-.427.863-.563.265-.103.663-.226 1.397-.26.793-.036 1.03-.044 3.037-.044zm0-1.838c-2.04 0-2.296.009-3.097.045-1.118.051-1.88.229-2.548.489-.69.268-1.275.626-1.858 1.21-.584.582-.943 1.167-1.21 1.857-.26.669-.438 1.43-.489 2.548-.036.801-.045 1.057-.045 3.097s.009 2.296.045 3.097c.051 1.118.229 1.88.489 2.548.268.69.626 1.275 1.21 1.858.582.584 1.167.943 1.857 1.21.669.26 1.43.438 2.548.489.801.036 1.057.045 3.097.045s2.296-.009 3.097-.045c1.118-.051 1.88-.229 2.548-.489.69-.268 1.275-.626 1.858-1.21.584-.582.943-1.167 1.21-1.857.26-.669.438-1.43.489-2.548.036-.801.045-1.057.045-3.097s-.009-2.296-.045-3.097c-.051-1.118-.229-1.88-.489-2.548-.268-.69-.626-1.275-1.21-1.858-.582-.584-1.167-.943-1.857-1.21-.669-.26-1.43-.438-2.548-.489-.801-.036-1.057-.045-3.097-.045zm0 5.838c-2.298 0-4.162 1.864-4.162 4.162s1.864 4.162 4.162 4.162 4.162-1.864 4.162-4.162-1.864-4.162-4.162-4.162zm0 6.486c-1.284 0-2.324-1.04-2.324-2.324 0-1.284 1.04-2.324 2.324-2.324 1.284 0 2.324 1.04 2.324 2.324 0 1.284-1.04 2.324-2.324 2.324zm5.845-6.945c0 .463-.376.838-.838.838-.463 0-.838-.375-.838-.838 0-.462.375-.838.838-.838.462 0 .838.376.838.838z"
      })
    )
  )
);
Instagram.displayName = "Instagram";

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
  telegram: Telegram,
  send: Telegram,
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
