import { getCompanies } from "@/lib/companies";
import Carousel3D from "./Carousel3D";
import MasonryExpand from "./MasonryExpand";
import HorizontalDepth from "./HorizontalDepth";
import StackedDeck from "./StackedDeck";
import DarkForcer from "./DarkForcer";

export default async function PortfolioDemoPage() {
  const companies = await getCompanies();

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
      <DarkForcer />
      {/* Option A */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <h2 style={{ textAlign: "center", fontSize: "2.25rem", fontWeight: 700, marginBottom: 8 }} className="font-display">
          Option A — <span style={{ color: "#FF3B6F" }}>3D Carousel</span>
        </h2>
        <p style={{ textAlign: "center", color: "#8E8E93", marginBottom: 48, fontSize: 14 }}>Drag or use arrows to spin</p>
        <Carousel3D companies={companies} />
      </section>

      {/* Option B */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: "80px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <h2 style={{ textAlign: "center", fontSize: "2.25rem", fontWeight: 700, marginBottom: 8 }} className="font-display">
          Option B — <span style={{ color: "#AF52DE" }}>Masonry + Hover Expand</span>
        </h2>
        <p style={{ textAlign: "center", color: "#8E8E93", marginBottom: 48, fontSize: 14 }}>Hover any card to expand</p>
        <MasonryExpand companies={companies} />
      </section>

      {/* Option C */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <h2 style={{ textAlign: "center", fontSize: "2.25rem", fontWeight: 700, marginBottom: 8 }} className="font-display">
          Option C — <span style={{ color: "#89D4F5" }}>Horizontal Scroll + Depth</span>
        </h2>
        <p style={{ textAlign: "center", color: "#8E8E93", marginBottom: 48, fontSize: 14 }}>Scroll horizontally or drag</p>
        <HorizontalDepth companies={companies} />
      </section>

      {/* Option D */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 0" }}>
        <h2 style={{ textAlign: "center", fontSize: "2.25rem", fontWeight: 700, marginBottom: 8 }} className="font-display">
          Option D — <span style={{ color: "#FF2D55" }}>Stacked Card Deck</span>
        </h2>
        <p style={{ textAlign: "center", color: "#8E8E93", marginBottom: 48, fontSize: 14 }}>Drag cards to throw them</p>
        <StackedDeck companies={companies} />
      </section>
    </div>
  );
}
