import { useState } from "react";
import { YdsIcon } from "../icons.jsx";

// ─── SearchBar (search_bar_ranking) ─────────────────────────────────────────
// Figma node 13797:452982 — search
// 인기 검색어 순위 + 트렌드 아이콘 + 보너스 텍스트

const SHADOW_LEVEL1_V2 = "0px 0px 2px rgba(25,48,64,0.08), 0px 1px 8px rgba(25,48,64,0.1)";

const TREND_ICONS = {
  up: "/assets/search-icons/ic_arrow_up.png",
  down: "/assets/search-icons/ic_arrow_down.png",
  dash: "/assets/search-icons/ic_dash.png",
  new: "/assets/search-icons/ic_new.png",
};

export function SearchBar({
  rank = 1,
  keyword = "파리바게뜨",
  trend = "up",         // "up" | "down" | "dash" | "new"
  bonusText = "",       // 옵션
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: SHADOW_LEVEL1_V2,
        height: 44,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: onClick ? "pointer" : "default",
        fontFamily: "Pretendard, -apple-system, sans-serif",
      }}
    >
      {/* left_tail */}
      <div style={{
        paddingLeft: 16,
        display: "flex",
        gap: 4,
        alignItems: "center",
      }}>
        {/* 순위 번호 — 14b */}
        <span style={{
          fontSize: 14,
          fontWeight: 700,
          lineHeight: "19px",
          color: "rgba(0,0,0,0.6)",
        }}>{rank}</span>

        {/* 키워드 — 14r, gap 10 from rank */}
        <span style={{
          fontSize: 14,
          fontWeight: 400,
          lineHeight: "19px",
          color: "rgba(0,0,0,0.6)",
          marginLeft: 6, // 4(gap) + 6 = 10 visual gap
        }}>{keyword}</span>

        {/* 트렌드 아이콘 20x20 */}
        <img
          src={TREND_ICONS[trend] || TREND_ICONS.dash}
          alt={trend}
          width={20}
          height={20}
          style={{ flexShrink: 0 }}
        />

        {/* 보너스 텍스트 — 12r */}
        {bonusText && (
          <span style={{
            fontSize: 12,
            fontWeight: 400,
            lineHeight: "16px",
            color: "rgba(0,0,0,0.4)",
          }}>{bonusText}</span>
        )}
      </div>

      {/* right_tail — 44x44 중앙 정렬 */}
      <div style={{
        width: 44,
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        <YdsIcon name="search" size={18} color="rgba(0,0,0,0.6)" />
      </div>
    </div>
  );
}

// ─── Section (Storybook Controls) ───────────────────────────────────────────

const DEMO_ITEMS = [
  { rank: 1, keyword: "파리바게뜨", trend: "up", bonusText: "5,000원 할인" },
  { rank: 2, keyword: "맥도날드", trend: "down", bonusText: "" },
  { rank: 3, keyword: "스타벅스", trend: "dash", bonusText: "쿠폰 증정" },
  { rank: 4, keyword: "BBQ치킨", trend: "new", bonusText: "" },
];

const controlStyle = {
  padding: "16px 20px", background: "#fff", borderRadius: 12,
  border: "1px solid #e8e8e8", marginBottom: 16,
};

export default function SearchBarSection({ previewWidth }) {
  const [trend, setTrend] = useState("up");
  const [showBonus, setShowBonus] = useState(true);

  const chipStyle = (active) => ({
    padding: "4px 12px", borderRadius: 20,
    border: `1.5px solid ${active ? "#0C74E4" : "#e0e0e0"}`,
    background: active ? "#0C74E4" : "#fff",
    color: active ? "#fff" : "#666",
    fontSize: 10, cursor: "pointer",
  });

  return (
    <div style={{ padding: "24px 0" }}>
      {/* Controls */}
      <div style={controlStyle}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#333", marginBottom: 10 }}>Options</div>

        {/* Trend */}
        <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 10, color: "#999", width: 80, flexShrink: 0 }}>Trend</span>
          {["up", "down", "dash", "new"].map(t => (
            <button key={t} onClick={() => setTrend(t)} style={chipStyle(trend === t)}>{t}</button>
          ))}
        </div>

        {/* BonusText */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "#999", width: 80, flexShrink: 0 }}>BonusText</span>
          <button onClick={() => setShowBonus(false)} style={chipStyle(!showBonus)}>Off</button>
          <button onClick={() => setShowBonus(true)} style={chipStyle(showBonus)}>On</button>
        </div>
      </div>

      {/* Single Interactive */}
      <div style={{ width: previewWidth > 0 ? previewWidth : "100%", margin: previewWidth > 0 ? "0 auto" : 0 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8 }}>Interactive</div>
      <div style={{ padding: "16px 16px 8px", background: "#f5f5f5", borderRadius: 12, marginBottom: 24 }}>
        <SearchBar
          rank={1}
          keyword="파리바게뜨"
          trend={trend}
          bonusText={showBonus ? "5,000원 할인" : ""}
        />
      </div>

      {/* 4가지 트렌드 유형 데모 */}
      <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8 }}>All Trends</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "16px 16px 8px", background: "#f5f5f5", borderRadius: 12 }}>
        {DEMO_ITEMS.map(item => (
          <SearchBar
            key={item.rank}
            rank={item.rank}
            keyword={item.keyword}
            trend={item.trend}
            bonusText={item.bonusText}
          />
        ))}
      </div>
      </div>
    </div>
  );
}
