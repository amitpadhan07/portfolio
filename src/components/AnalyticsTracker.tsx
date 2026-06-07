"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Avoid tracking admin or api dashboard pages
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    const trackVisit = async () => {
      try {
        const hasVisitedSession = sessionStorage.getItem("has_visited_portfolio");
        let trackType = "view";

        if (!hasVisitedSession) {
          trackType = "visit";
          sessionStorage.setItem("has_visited_portfolio", "true");
        }

        await fetch("/api/analytics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: trackType }),
        });
      } catch (err) {
        console.error("Failed to track analytics event:", err);
      }
    };

    trackVisit();
  }, [pathname]);

  return null;
}
