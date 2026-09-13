import { ImageResponse } from "next/og";
import { components } from "@/lib/registry";

export const alt = "Gear5 UI. Good interfaces, even on a bad day. Open-source React components.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", background: "#09090d", color: "#f3eeeb", padding: "64px 72px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 32, fontWeight: 700, color: "#eebe52" }}>GEAR5 UI</span>
        <span style={{ fontSize: 20, color: "#aaa7b3" }}>OPEN SOURCE / MIT LICENSED</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 88, lineHeight: 1.08, letterSpacing: -4 }}>
        <span>Good interfaces.</span>
        <span>Even on a <span style={{ color: "#eebe52" }}>bad day.</span></span>
      </div>
      <div style={{ display: "flex", borderTop: "1px solid #34313b", paddingTop: 28, justifyContent: "space-between", fontSize: 23, color: "#aaa7b3" }}>
        <span>{components.length} React components. Copy the source. Make it yours.</span>
        <span style={{ color: "#eebe52" }}>gear5-ui.vercel.app</span>
      </div>
    </div>, size,
  );
}
