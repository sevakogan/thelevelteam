import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TheLevelTeam — We build software that moves industries forward.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  // Generate star positions deterministically for the OG image
  const stars: { x: number; y: number; r: number; o: number }[] = [];
  for (let i = 0; i < 120; i++) {
    // Simple seeded pseudo-random using index
    const px = ((i * 7919 + 1) % 1200);
    const py = ((i * 6271 + 3) % 630);
    const pr = ((i * 31) % 3) * 0.4 + 0.6;
    const po = ((i * 17) % 5) * 0.1 + 0.15;
    stars.push({ x: px, y: py, r: pr, o: po });
  }

  // A few brighter stars
  const brightStars: { x: number; y: number; r: number; o: number }[] = [];
  for (let i = 0; i < 15; i++) {
    const px = ((i * 4253 + 100) % 1200);
    const py = ((i * 3571 + 50) % 630);
    const pr = ((i * 13) % 3) * 0.5 + 1.5;
    const po = ((i * 11) % 4) * 0.1 + 0.5;
    brightStars.push({ x: px, y: py, r: pr, o: po });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0F",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background gradient orbs */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-50px",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-50px",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Stars */}
        {stars.map((star, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: star.x,
              top: star.y,
              width: star.r * 2,
              height: star.r * 2,
              borderRadius: "50%",
              backgroundColor: `rgba(255, 255, 255, ${star.o})`,
            }}
          />
        ))}
        {brightStars.map((star, i) => (
          <div
            key={`b${i}`}
            style={{
              position: "absolute",
              left: star.x,
              top: star.y,
              width: star.r * 2,
              height: star.r * 2,
              borderRadius: "50%",
              backgroundColor: `rgba(147, 197, 253, ${star.o})`,
              boxShadow: `0 0 ${star.r * 4}px rgba(147, 197, 253, ${star.o * 0.4})`,
            }}
          />
        ))}

        {/* Logo + Text centered */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            zIndex: 10,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="TheLevelTeam Logo"
            src="https://thelevelteam.com/logo.png"
            width={80}
            height={80}
            style={{ borderRadius: 0 }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 64,
                fontWeight: 700,
                letterSpacing: "-1px",
              }}
            >
              <span style={{ color: "#FFFFFF" }}>TheLevel</span>
              <span style={{ color: "#3B82F6" }}>Team</span>
            </div>
          </div>
        </div>

        {/* Tagline below */}
        <div
          style={{
            marginTop: "20px",
            fontSize: 24,
            color: "#9CA3AF",
            zIndex: 10,
            fontWeight: 300,
          }}
        >
          We build software that moves industries forward.
        </div>

        {/* Subtle bottom border line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, transparent 0%, #3B82F6 30%, #8B5CF6 70%, transparent 100%)",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
