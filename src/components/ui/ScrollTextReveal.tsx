"use client";

import { motion } from "framer-motion";
import {
  letterStagger,
  letterChild,
  wordStagger,
  wordChild,
} from "@/lib/animations";

interface ScrollTextRevealProps {
  readonly text: string;
  readonly as?: "h1" | "h2" | "h3" | "p" | "span";
  readonly mode?: "word" | "letter";
  readonly className?: string;
  readonly delay?: number;
}

export default function ScrollTextReveal({
  text,
  as: Tag = "h2",
  mode = "word",
  className = "",
  delay = 0,
}: ScrollTextRevealProps) {
  const isLetter = mode === "letter";
  const items = isLetter ? text.split("") : text.split(" ");
  const containerVariant = isLetter ? letterStagger : wordStagger;
  const childVariant = isLetter ? letterChild : wordChild;

  return (
    <Tag className={className}>
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          ...containerVariant,
          visible: {
            ...containerVariant.visible,
            transition: {
              ...(typeof containerVariant.visible === "object" &&
              "transition" in containerVariant.visible
                ? containerVariant.visible.transition
                : {}),
              delayChildren: delay,
            },
          },
        }}
        className="inline-flex flex-wrap"
      >
        {items.map((item, i) => (
          <motion.span
            key={`${item}-${i}`}
            variants={childVariant}
            className="inline-block"
          >
            {item === " " || (!isLetter && i < items.length - 1)
              ? `${item}\u00A0`
              : item}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
