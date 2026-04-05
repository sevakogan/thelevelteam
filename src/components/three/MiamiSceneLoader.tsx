"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MiamiScene = dynamic(() => import("./MiamiScene"), { ssr: false });

const DESKTOP_BREAKPOINT = 1024;

export default function MiamiSceneLoader() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isDesktop) return null;
  return <MiamiScene />;
}
