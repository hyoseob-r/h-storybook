import { useState } from "react";
import { YdsIcon } from "../icons.jsx";

// ─── YDS 2.0 Rating Component ───────────────────────────────────────────────
// Figma: 📌 Customer-Component > Rating
// Anatomy: starIcon + grade + total

const RATING_SIZES = {
  small: { starSize: 12, fontSize: 12, lineHeight: 16, gap: 2 },
  medium: { starSize: 16, fontSize: 14, lineHeight: 19, gap: 4 },
};

// 별점 아이콘 — 전역 단일 소스 (ic_item_star)
// 색상 변경 시 여기만 수정하면 모든 Rating 컴포넌트에 일괄 적용
const STAR_ICON_SRC = "/assets/badge-icons/ic_item_star.svg";
function StarIcon({ size = 16 }) {
  return <img src={STAR_ICON_SRC} alt="★" style={{ width: size, height: size, display: "block", flexShrink: 0 }} />;
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
