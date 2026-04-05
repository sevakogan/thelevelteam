"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full bg-gradient-to-r from-miami-red to-miami-pink text-white font-semibold shadow-lg shadow-miami-pink/25 hover:shadow-miami-pink/40 transition-shadow"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          💬 Chat With Us
        </motion.button>
      )}
    </AnimatePresence>
  );
}
