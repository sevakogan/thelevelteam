"use client";

import {
  useRef,
  useState,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from "framer-motion";

interface TiltCardProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly style?: CSSProperties;
  /** Max rotation in degrees (default 12) */
  readonly maxTilt?: number;
  /** Perspective distance in px (default 800) */
  readonly perspective?: number;
  /** Show glare/shine effect on hover (default true) */
  readonly glare?: boolean;
  /** Max glare opacity 0-1 (default 0.15) */
  readonly glareOpacity?: number;
  /** Scale on hover (default 1.02) */
  readonly hoverScale?: number;
  /** Spring stiffness (default 300) */
  readonly stiffness?: number;
  /** Spring damping (default 25) */
  readonly damping?: number;
}

export default function TiltCard({
  children,
  className = "",
  style,
  maxTilt = 12,
  perspective = 800,
  glare = true,
  glareOpacity = 0.15,
  hoverScale = 1.02,
  stiffness = 300,
  damping = 25,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Motion values for tilt
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Motion values for glare position (0-100)
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  // Springs for smooth tilt interpolation
  const springConfig = { stiffness, damping };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  // Reactive glare gradient via useMotionTemplate
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,${glareOpacity}), transparent 60%)`;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // -1 to 1 range from center
      const normalizedX = (e.clientX - centerX) / (rect.width / 2);
      const normalizedY = (e.clientY - centerY) / (rect.height / 2);

      // Invert Y for natural tilt direction (tilt toward cursor)
      rotateX.set(-normalizedY * maxTilt);
      rotateY.set(normalizedX * maxTilt);

      // Glare follows cursor (0-100%)
      glareX.set(((e.clientX - rect.left) / rect.width) * 100);
      glareY.set(((e.clientY - rect.top) / rect.height) * 100);
    },
    [maxTilt, rotateX, rotateY, glareX, glareY]
  );

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
  }, [rotateX, rotateY, glareX, glareY]);

  return (
    <div style={{ perspective }} className={className}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
          ...style,
        }}
        animate={{ scale: isHovering ? hoverScale : 1 }}
        transition={{ scale: { duration: 0.3, ease: "easeOut" } }}
        className="relative will-change-transform"
      >
        {/* Children with 3D depth */}
        <div style={{ transformStyle: "preserve-3d" }}>{children}</div>

        {/* Glare overlay — reactive to cursor via useMotionTemplate */}
        {glare && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
            style={{
              transform: "translateZ(1px)",
              background: glareBackground,
            }}
            animate={{ opacity: isHovering ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    </div>
  );
}
