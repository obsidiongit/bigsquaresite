import { ImageResponse } from "next/og";

// Brand-default OG image, inherited by every route until a page-specific
// image exists (case studies and lead magnets get their own later).
// Swap for a designed asset when brand imagery is delivered.

export const alt = "BigSquare Marketing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          gap: 40,
          backgroundColor: "#0B0F17",
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            border: "6px solid #0657F9",
          }}
        />
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            color: "#E9ECF1",
          }}
        >
          BigSquare
        </div>
        <div style={{ fontSize: 32, color: "#8D97A8" }}>
          Franchise & Multi-Location Marketing
        </div>
      </div>
    ),
    size,
  );
}
