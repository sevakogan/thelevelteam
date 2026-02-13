"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function BackButton() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link href="/#portfolio">
        <motion.span
          className="inline-flex items-center gap-1 text-brand-muted text-sm font-medium cursor-pointer"
          whileHover={{ scale: 1.03, color: "#ffffff" }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-lg leading-none">&larr;</span>
          Back to Portfolio
        </motion.span>
      </Link>
    </motion.div>
  );
}
