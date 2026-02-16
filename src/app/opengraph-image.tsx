import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "TheLevelTeam — Boutique Digital Agency | Advertising, Development & Growth Strategy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ─── Services ────────────────────────────────────────────────────────────────

const SERVICES: readonly { readonly label: string; readonly color: string }[] = [
  { label: "Paid Advertising", color: "#EC4899" },
  { label: "Website Development", color: "#3B82F6" },
  { label: "Cold Calling & Outbound", color: "#10B981" },
  { label: "Social Media Management", color: "#8B5CF6" },
  { label: "SEO & Branding", color: "#C9A84C" },
  { label: "Customer Service", color: "#06B6D4" },
];

// ─── Portfolio clients ───────────────────────────────────────────────────────

const CLIENTS: readonly {
  readonly name: string;
  readonly accent: string;
  readonly industry: string;
}[] = [
  { name: "CrownVault", accent: "#3B82F6", industry: "Luxury Watches" },
  { name: "RevenuFlow", accent: "#8B5CF6", industry: "AI Revenue" },
  { name: "WeCare Drive", accent: "#1E40AF", industry: "Medical Logistics" },
  { name: "GeniusTestBoost", accent: "#C9A84C", industry: "Education" },
];

// ─── Stars (deterministic) ──────────────────────────────────────────────────

function generateStars(
  count: number,
  seedA: number,
  seedB: number,
  rBase: number,
  rRange: number,
  oBase: number,
  oRange: number
): readonly { readonly x: number; readonly y: number; readonly r: number; readonly o: number }[] {
  const result: { x: number; y: number; r: number; o: number }[] = [];
  for (let i = 0; i < count; i++) {
    result.push({
      x: (i * seedA + 1) % 1200,
      y: (i * seedB + 3) % 630,
      r: ((i * 31) % 3) * rRange + rBase,
      o: ((i * 17) % 5) * oRange + oBase,
    });
  }
  return result;
}

// ─── OG Image ───────────────────────────────────────────────────────────────

export default async function OGImage() {
  const stars = generateStars(100, 7919, 6271, 0.5, 0.3, 0.1, 0.08);
  const brightStars = generateStars(12, 4253, 3571, 1.2, 0.5, 0.4, 0.12);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0A0A0F",
          position: "relative",
          overflow: "hidden",
          padding: "50px 60px 0",
        }}
      >
        {/* ─── Background gradient orbs ─────────────────────── */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 65%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-140px",
            left: "-60px",
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 65%)",
            borderRadius: "50%",
          }}
        />
        {/* Subtle center glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            height: "400px",
            background:
              "radial-gradient(ellipse, rgba(59,130,246,0.04) 0%, transparent 60%)",
            borderRadius: "50%",
          }}
        />

        {/* ─── Starfield ────────────────────────────────────── */}
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
              boxShadow: `0 0 ${star.r * 6}px rgba(147, 197, 253, ${star.o * 0.5})`,
            }}
          />
        ))}

        {/* ─── Main content: 2-column layout ────────────────── */}
        <div
          style={{
            display: "flex",
            flex: 1,
            zIndex: 10,
            gap: "40px",
          }}
        >
          {/* ─── LEFT COLUMN (brand + tagline) ───────────────── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: "1 1 58%",
            }}
          >
            {/* Logo + Brand Name */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="TheLevelTeam Logo"
                src="https://thelevelteam.com/logo.png"
                width={56}
                height={56}
              />
              <div
                style={{
                  display: "flex",
                  fontSize: 48,
                  fontWeight: 800,
                  letterSpacing: "-1.5px",
                  lineHeight: 1,
                }}
              >
                <span style={{ color: "#FFFFFF" }}>TheLevel</span>
                <span style={{ color: "#3B82F6" }}>Team</span>
              </div>
            </div>

            {/* Gradient divider */}
            <div
              style={{
                marginTop: "18px",
                marginBottom: "18px",
                width: "280px",
                height: "2px",
                background:
                  "linear-gradient(90deg, #3B82F6, #8B5CF6, transparent)",
                borderRadius: "2px",
              }}
            />

            {/* Tagline */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 600,
                  color: "#FFFFFF",
                  lineHeight: 1.3,
                }}
              >
                Boutique Digital Agency
              </div>
              <div
                style={{
                  fontSize: 17,
                  color: "#8888a0",
                  fontWeight: 400,
                  lineHeight: 1.5,
                }}
              >
                Advertising · Development · Growth Strategy
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#6b6b80",
                  fontWeight: 400,
                  marginTop: "4px",
                }}
              >
                Serving businesses across the United States
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN (services) ─────────────────────── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: "1 1 42%",
              gap: "12px",
              paddingLeft: "20px",
              borderLeft: "1px solid rgba(30, 30, 46, 0.8)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#5a5a70",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              Our Services
            </div>
            {SERVICES.map((svc) => (
              <div
                key={svc.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                {/* Colored dot */}
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: svc.color,
                    boxShadow: `0 0 8px ${svc.color}40`,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 16,
                    color: "#d0d0e0",
                    fontWeight: 400,
                  }}
                >
                  {svc.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Bottom: Portfolio client cards ─────────────────── */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            zIndex: 10,
            paddingBottom: "24px",
            paddingTop: "16px",
            borderTop: "1px solid rgba(30, 30, 46, 0.5)",
            marginTop: "auto",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#5a5a70",
              letterSpacing: "2px",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              marginRight: "8px",
              flexShrink: 0,
            }}
          >
            Portfolio
          </div>
          {CLIENTS.map((client) => (
            <div
              key={client.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "rgba(18, 18, 26, 0.8)",
                border: "1px solid rgba(30, 30, 46, 0.6)",
                borderRadius: "10px",
                padding: "8px 16px",
                flex: 1,
              }}
            >
              {/* Colored accent bar */}
              <div
                style={{
                  width: "3px",
                  height: "28px",
                  borderRadius: "3px",
                  backgroundColor: client.accent,
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1px",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#e0e0f0",
                  }}
                >
                  {client.name}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: "#6b6b80",
                    fontWeight: 400,
                  }}
                >
                  {client.industry}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Bottom gradient bar ────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background:
              "linear-gradient(90deg, transparent 0%, #3B82F6 25%, #8B5CF6 50%, #EC4899 75%, transparent 100%)",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
