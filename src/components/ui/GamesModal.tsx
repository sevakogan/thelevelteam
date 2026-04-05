"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const AngryBirdsGame = dynamic(() => import("@/components/game/AngryBirdsGame"), { ssr: false });
const BreakoutGame = dynamic(() => import("@/components/game/BreakoutGame"), { ssr: false });

type GameType = "angry-birds" | "breakout" | null;

export default function GamesModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<GameType>(null);

  // Expose open function globally so Header can call it
  if (typeof window !== "undefined") {
    (window as unknown as Record<string, unknown>).__openGamesModal = () => setIsOpen(true);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={() => { setIsOpen(false); setActiveGame(null); }}
          />
          <motion.div
            className="relative w-[90vw] max-w-2xl bg-surface/95 rounded-2xl border border-brand-border p-6 shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <button
              onClick={() => { setIsOpen(false); setActiveGame(null); }}
              className="absolute top-3 right-4 text-xl text-brand-muted hover:text-foreground transition-colors"
            >
              ✕
            </button>
            {!activeGame ? (
              <>
                <h2 className="text-xl font-bold text-foreground text-center mb-6">Pick Your Game</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveGame("angry-birds")}
                    className="flex-1 p-6 rounded-xl bg-miami-pink/10 border border-miami-pink/20 hover:border-miami-pink/50 transition-all text-center"
                  >
                    <div className="text-4xl mb-3">🐦</div>
                    <div className="font-semibold text-foreground">Angry Birds</div>
                    <div className="text-xs text-brand-muted mt-1">Slingshot physics</div>
                  </button>
                  <button
                    onClick={() => setActiveGame("breakout")}
                    className="flex-1 p-6 rounded-xl bg-miami-baby-blue/10 border border-miami-baby-blue/20 hover:border-miami-baby-blue/50 transition-all text-center"
                  >
                    <div className="text-4xl mb-3">🧱</div>
                    <div className="font-semibold text-foreground">Breakout</div>
                    <div className="text-xs text-brand-muted mt-1">Classic brick breaker</div>
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full aspect-[4/3]">
                {activeGame === "angry-birds" && <AngryBirdsGame />}
                {activeGame === "breakout" && <BreakoutGame />}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
