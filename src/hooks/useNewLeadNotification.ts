"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Hook that polls for new leads and exposes:
 *  - hasNew: whether there are unseen leads
 *  - refreshLeads: callback to trigger a leads re-fetch (optional, passed by parent)
 *
 * Polls every 10s, and ALSO re-checks instantly when:
 *  - The browser tab regains focus (visibilitychange)
 *  - The window regains focus
 */
export function useNewLeadNotification(onNewLeads?: () => void) {
  const [hasNew, setHasNew] = useState(false);
  const pathname = usePathname();
  const onNewLeadsRef = useRef(onNewLeads);
  onNewLeadsRef.current = onNewLeads;
  const prevCountRef = useRef<number | null>(null);

  const check = useCallback(async () => {
    try {
      const res = await fetch("/api/marketing/leads/recent");
      if (!res.ok) return;
      const { count } = await res.json();
      setHasNew(count > 0);

      // If count increased and we have a callback, trigger a leads refresh
      if (count > 0 && prevCountRef.current !== null && count > prevCountRef.current) {
        onNewLeadsRef.current?.();
      }
      prevCountRef.current = count;
    } catch {
      // silently ignore
    }
  }, []);

  useEffect(() => {
    check();
    const interval = setInterval(check, 10_000); // poll every 10s (was 30s)

    // Also check instantly when the tab/window regains focus
    function handleVisibility() {
      if (document.visibilityState === "visible") {
        check();
      }
    }
    function handleFocus() {
      check();
    }

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
    };
  }, [check]);

  // Clear notification when visiting leads or marketing pages
  useEffect(() => {
    if (
      pathname.startsWith("/dashboard/leads") ||
      pathname.startsWith("/dashboard/marketing")
    ) {
      setHasNew(false);
      // Mark as seen
      fetch("/api/marketing/leads/recent", { method: "POST" }).catch(() => {});
    }
  }, [pathname]);

  return hasNew;
}
