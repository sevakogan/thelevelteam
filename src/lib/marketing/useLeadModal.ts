"use client";

import { createContext, useContext } from "react";

export interface LeadModalContextValue {
  readonly isOpen: boolean;
  readonly projectSlug: string | null;
  readonly openModal: (projectSlug?: string) => void;
  readonly closeModal: () => void;
}

export const LeadModalContext = createContext<LeadModalContextValue>({
  isOpen: false,
  projectSlug: null,
  openModal: () => {},
  closeModal: () => {},
});

export function useLeadModal() {
  return useContext(LeadModalContext);
}
