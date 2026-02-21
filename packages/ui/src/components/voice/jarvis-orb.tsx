"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

interface JarvisOrbProps {
  active?: boolean;
  isListening?: boolean;
  onClick?: () => void;
  size?: number;
  variant?: "default" | "minimal" | "pulse";
  className?: string;
}

const glowLayers = [0, 1, 2] as const;

function JarvisOrb({
  active = false,
  isListening = false,
  onClick,
  size = 80,
  variant = "default",
  className,
}: JarvisOrbProps) {
  const isMinimal = variant === "minimal";
  const isPulse = variant === "pulse";

  return (
    <motion.button
      onClick={onClick}
      className={cn("jarvis-orb relative border-none bg-transparent cursor-pointer outline-none", className)}
      style={{ width: size, height: size, borderRadius: "50%" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isListening ? "Listening" : active ? "Active" : "Activate voice"}
    >
      {/* Layer 1: Ambient glow */}
      {!isMinimal && (
        <div
          className="absolute rounded-full transition-all duration-400"
          style={{
            inset: "-20%",
            background: active
              ? "radial-gradient(circle, color-mix(in srgb, var(--color-primary) 30%, transparent) 0%, color-mix(in srgb, var(--color-primary) 10%, transparent) 50%, transparent 70%)"
              : "radial-gradient(circle, color-mix(in srgb, var(--color-primary) 20%, transparent) 0%, color-mix(in srgb, var(--color-primary) 8%, transparent) 50%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />
      )}

      {/* Layer 2-4: Animated glow rings */}
      {!isMinimal &&
        glowLayers.map((i) => (
          <motion.div
            key={i}
            animate={
              isListening || isPulse
                ? {
                    scale: [1, 1.1 + i * 0.05, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }
                : { scale: 1, opacity: 0.2 }
            }
            transition={{
              duration: 2 + i * 0.3,
              repeat: isListening || isPulse ? Infinity : 0,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
            className="absolute rounded-full"
            style={{
              inset: `${-15 - i * 12}px`,
              background: active
                ? `radial-gradient(circle, color-mix(in srgb, var(--color-primary) ${25 - i * 7}%, transparent) 0%, transparent 70%)`
                : `radial-gradient(circle, color-mix(in srgb, var(--color-primary) ${15 - i * 4}%, transparent) 0%, transparent 70%)`,
              filter: `blur(${20 + i * 10}px)`,
            }}
          />
        ))}

      {/* Glass core */}
      <div
        className="absolute rounded-full transition-all duration-400"
        style={{
          inset: `${size * 0.15}px`,
          background: active
            ? "radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--color-primary) 90%, white) 0%, var(--color-primary) 50%, color-mix(in srgb, var(--color-primary) 80%, black) 100%)"
            : "radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--color-primary) 70%, white) 0%, color-mix(in srgb, var(--color-primary) 50%, black 20%) 50%, color-mix(in srgb, var(--color-primary) 60%, black 30%) 100%)",
          backdropFilter: "blur(30px) saturate(200%)",
          WebkitBackdropFilter: "blur(30px) saturate(200%)",
          border: "1px solid rgba(255,255,255,0.25)",
          boxShadow: active
            ? "inset 0 0 40px rgba(255,255,255,0.3), var(--glow-primary)"
            : "inset 0 0 30px rgba(255,255,255,0.2), 0 0 40px color-mix(in srgb, var(--color-primary) 20%, transparent)",
        }}
      >
        {/* Specular highlight */}
        <div
          className="absolute rounded-full"
          style={{
            top: "10%",
            left: "15%",
            width: "35%",
            height: "25%",
            background: "radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />
        {/* Inner depth */}
        <div
          className="absolute rounded-full"
          style={{
            inset: "20%",
            background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%)",
            filter: "blur(10px)",
          }}
        />
      </div>

      {/* Breathing glow (listening state) */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.15, 1],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute rounded-full"
            style={{
              inset: "-25px",
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--color-primary) 35%, transparent) 0%, color-mix(in srgb, var(--color-primary) 15%, transparent) 40%, transparent 70%)",
              filter: "blur(25px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Listening ring indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute rounded-full"
            style={{
              inset: "-8px",
              border: "1px solid color-mix(in srgb, var(--color-primary) 40%, transparent)",
              boxShadow: "0 0 30px color-mix(in srgb, var(--color-primary) 25%, transparent)",
              filter: "blur(2px)",
            }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}

JarvisOrb.displayName = "JarvisOrb";

export { JarvisOrb };
export default JarvisOrb;
export type { JarvisOrbProps };
