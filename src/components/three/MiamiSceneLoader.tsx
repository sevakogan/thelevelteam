"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MiamiScene = dynamic(() => import("./MiamiScene"), { ssr: false });
const MiamiSceneMobile = dynamic(
  () => import("../mobile/MiamiSceneMobile"),
  { ssr: false }
);

const DESKTOP_BREAKPOINT = 1024;

export default function MiamiSceneLoader() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const check = () => setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isMounted) return null;
  return isDesktop ? <MiamiScene /> : <MiamiSceneMobile />;
}
