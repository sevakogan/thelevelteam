// Breakout game constants

export const BREAKOUT = {
  // Ball
  ballRadius: 10,
  ballSpeed: 6,
  minVerticalSpeed: 2.5, // prevent ball going too horizontal
  maxSpeed: 12,

  // Paddle
  paddleWidthRatio: 0.16, // fraction of canvas width
  paddleHeight: 14,
  paddleYRatio: 0.72, // from top of canvas
  paddleSpeed: 18, // keyboard movement per frame
  paddleCornerRadius: 7,

  // Bricks (letter positions)
  bricksYRatio: 0.27, // same as lettersYRatio in angry birds
  brickPaddingX: 2,
  brickHeight: 60,
  fontSize: 100,

  // Game
  maxBalls: 3,
  serveAngle: Math.PI / 4, // 45 degrees from vertical
  scorePerBrick: 100,
  clearBonus: 500,
  comboWindow: 30, // frames for combo to stay active
  comboMax: 4,
  autoRestartDelay: 120, // frames after gameover (~2s at 60fps)
  morphFadeSpeed: 0.04, // per frame (25 frames = ~0.4s)
  celebrationDuration: 90, // frames before morphing (~1.5s)

  // Subtitle
  subtitleOffsetY: 50, // px below bricks
} as const;

// Paddle gradient
export const PADDLE_COLORS = {
  gradStart: "#3B82F6", // blue
  gradEnd: "#8B5CF6",   // purple
  glow: "rgba(99, 102, 241, 0.5)",
  stroke: "rgba(255, 255, 255, 0.2)",
} as const;

// Brick styles
export const BRICK_COLORS = {
  fill: "rgba(255, 255, 255, 0.05)",
  stroke: "rgba(139, 92, 246, 0.3)",
  strokeLit: "rgba(99, 102, 241, 0.8)",
  text: "#ffffff",
  textGlow: "rgba(139, 92, 246, 0.5)",
} as const;

// Ball style
export const BALL_COLORS = {
  fill: "#818CF8",       // indigo
  glow: "rgba(129, 140, 248, 0.6)",
  trail: "rgba(129, 140, 248, 0.3)",
} as const;
