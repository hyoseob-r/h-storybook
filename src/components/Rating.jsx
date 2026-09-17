import { useState } from "react";

// ─── YDS 2.0 Rating Component ───────────────────────────────────────────────
// Figma: 📌 Customer-Component > Rating
// Anatomy: starIcon + grade + total

const RATING_SIZES = {
  small: { starSize: 12, fontSize: 12, lineHeight: 16, gap: 2 },
  medium: { starSize: 16, fontSize: 14, lineHeight: 19, gap: 4 },
};

function StarIcon({ size = 16, filled = true, color = "#FFCB2E" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function RatingCompact({ grade = 4.8, total = 1234, size = "small" }) {
  const s = RATING_SIZES[size];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: s.gap,
      fontFamily: "Pretendard, Roboto, sans-serif",
    }}>
      <StarIcon size={s.starSize} />
      <span style={{ fontSize: s.fontSize, fontWeight: 700, lineHeight: `${s.lineHeight}px`, color: "#333" }}>
        {grade}
      </span>
      <span style={{ fontSize: s.fontSize, fontWeight: 400, lineHeight: `${s.lineHeight}px`, color: "#999" }}>
        ({total.toLocaleString("ko-KR")})
      </span>
    </span>
  );
}

export default function RatingSection() {
  const [size, setSize] = useState("small");

  return (
    <div style={{ padding: "24px 0" }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 20, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#999", marginRight: 4 }}>Size:</span>
        {["small", "medium"].map(s => (
          <button key={s} onClick={() => setSize(s)}
            style={{ padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${size === s ? "#0C74E4" : "#e0e0e0"}`,
              background: size === s ? "#0C74E4" : "#fff", color: size === s ? "#fff" : "#666",
              fontSize: 11, cursor: "pointer" }}>{s}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>compact — 기본</div>
          <RatingCompact grade={4.8} total={1234} size={size} />
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>compact — 높은 평점</div>
          <RatingCompact grade={5.0} total={89} size={size} />
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>compact — 낮은 평점</div>
          <RatingCompact grade={3.2} total={45678} size={size} />
        </div>
      </div>
    </div>
  );
}
