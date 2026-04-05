"use client";

import { useEffect, useState } from "react";
import SkylineSVG from "./SkylineSVG";

export default function MiamiSceneMobile() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? window.scrollY / docHeight : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sky color transitions: sunset pink -> dark night -> dawn pink
  const getSkyGradient = () => {
    if (scrollProgress < 0.5) {
      const t = scrollProgress * 2;
      return `linear-gradient(180deg,
        rgb(${Math.round(255 - t * 245)}, ${Math.round(59 - t * 49)}, ${Math.round(111 - t * 85)}) 0%,
        rgb(${Math.round(26 - t * 16)}, ${Math.round(5 - t * 5)}, ${Math.round(30 - t * 4)}) 60%,
        rgb(10, 26, 42) 100%)`;
    }
    const t = (scrollProgress - 0.5) * 2;
    return `linear-gradient(180deg,
      rgb(${Math.round(10 + t * 245)}, ${Math.round(10 + t * 97)}, ${Math.round(26 + t * 131)}) 0%,
      rgb(${Math.round(10 + t * 16)}, ${Math.round(10)}, ${Math.round(26 + t * 4)}) 60%,
      rgb(10, 26, 42) 100%)`;
  };

  return (
    <div
      className="fixed inset-0 z-0"
      aria-hidden="true"
      style={{ background: getSkyGradient() }}
    >
      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              top: `${Math.random() * 40}%`,
              left: `${Math.random() * 100}%`,
              opacity:
                scrollProgress > 0.3 && scrollProgress < 0.8 ? 0.6 : 0.1,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              transition: "opacity 1s ease",
            }}
          />
        ))}
      </div>

      {/* Skyline at bottom */}
      <div
        className="absolute bottom-[20%] left-0 right-0"
        style={{ transform: `translateY(${scrollProgress * -20}px)` }}
      >
        <SkylineSVG progress={scrollProgress} />
      </div>

      {/* Ocean */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[25%]"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,26,42,0.6) 0%, rgba(0,30,60,0.8) 50%, #0a1a2a 100%)",
        }}
      >
        {/* Shimmer lines */}
        <div className="absolute top-3 left-[25%] w-[50%] h-px bg-gradient-to-r from-transparent via-miami-pink/20 to-transparent animate-pulse" />
        <div
          className="absolute top-6 left-[30%] w-[40%] h-px bg-gradient-to-r from-transparent via-miami-baby-blue/15 to-transparent animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-9 left-[35%] w-[30%] h-px bg-gradient-to-r from-transparent via-miami-pink/10 to-transparent animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>
    </div>
  );
}
