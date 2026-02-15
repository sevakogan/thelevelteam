"use client";

import { useState, useCallback, useMemo } from "react";
import { LeadModalContext } from "@/lib/marketing/useLeadModal";
import LeadCaptureModal from "./LeadCaptureModal";

export default function LeadModalProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [projectSlug, setProjectSlug] = useState<string | null>(null);

  const openModal = useCallback((slug?: string) => {
    setProjectSlug(slug ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setProjectSlug(null);
  }, []);

  const value = useMemo(
    () => ({ isOpen, projectSlug, openModal, closeModal }),
    [isOpen, projectSlug, openModal, closeModal]
  );

  return (
    <LeadModalContext.Provider value={value}>
      {children}
      <LeadCaptureModal />
    </LeadModalContext.Provider>
  );
}
