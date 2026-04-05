"use client";

import { useEffect } from "react";

export default function DarkForcer() {
  useEffect(() => {
    const html = document.documentElement;
    const wasDark = html.classList.contains("dark");
    html.classList.add("dark");
    localStorage.setItem("tlt-theme", "dark");

    return () => {
      if (!wasDark) {
        html.classList.remove("dark");
      }
    };
  }, []);

  return null;
}
