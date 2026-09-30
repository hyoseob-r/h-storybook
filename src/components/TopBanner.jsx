import { useState } from "react";
import { metaTokens } from "../tokens";
import { YdsIcon } from "../icons.jsx";

// ─── YDS 2.0 TopBanner (promotion_area) ─────────────────────────────────────
// Figma: 리뉴얼-2026 > 탑배너 가이드
// 구조: 배경(480 기준 센터크롭) + safety area(116+32) + contents_area(100)
// 헤더: dark/light theme 선택 가능

const STATUS_BAR_H = 52;
const TOP_NAV_H = 56;
const SAFETY_TOP = STATUS_BAR_H + TOP_NAV_H; // 108 → safety area 116
const CONTENTS_H = 100;
const SAFETY_BOTTOM = 32;
const BANNER_H = 248;

function StatusBar({ theme = "dark" }) {
  const color = theme === "dark" ? "#fff" : "#333";
  return (
    <div style={{
      height: STATUS_BAR_H, padding: "0 45px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <span style={{ fontSize: 15, fontWeight: 600, color }}>9:41</span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{ fontSize: 10, color, opacity: 0.6 }}>●●●●</span>
        <span style={{ fontSize: 10, color, opacity: 0.6 }}>WiFi</span>
        <span style={{ fontSize: 10, color, opacity: 0.6 }}>🔋</span>
      </div>
    </div>
  );
}

function TopNav({ theme = "dark", address = "서울 강남구 역삼동" }) {
  const color = theme === "dark" ? "#fff" : "#333";
  return (
    <div style={{
      height: TOP_NAV_H, padding: "10px 16px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 4,
        background: theme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)",
        borderRadius: 18, padding: "7px 12px",
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, color }}>{address}</span>
        <YdsIcon name="chevron_right_s" size={20} color={color} style={{ transform: "rotate(90deg)" }} />
      </div>
      <div style={{
        width: 36, height: 36, borderRadius: 18,
        background: theme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <YdsIcon name="heart" size={20} color={color} />
      </div>
    </div>
  );
}

function ContentsArea({ title = "매일 하루종일 특가", subtitle = "멈추지 않는 선착순 할인!", theme = "dark" }) {
  const textColor = theme === "dark" ? "#fff" : "#333";
  const subColor = theme === "dark" ? "rgba(255,255,255,0.7)" : "#666";
  return (
    <div style={{
      height: CONTENTS_H, padding: "0 20px",
      display: "flex", alignItems: "center",
    }}>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 22, fontWeight: 700, color: textColor, lineHeight: "28px",
          fontFamily: "'YOGIYO Sans', Pretendard, sans-serif",
        }}>{title}</div>
        {subtitle && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
            <span style={{ fontSize: 13, color: subColor }}>{subtitle}</span>
            <YdsIcon name="chevron_right_s" size={18} color={subColor} />
          </div>
        )}
      </div>
      <div style={{
        width: 135, height: 97, borderRadius: 12,
        background: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, color: textColor, opacity: 0.3 }}>KV</span>
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <div style={{
      height: 32, margin: "0 16px",
      background: "rgba(0,0,0,0.04)", borderRadius: 16,
      display: "flex", alignItems: "center", padding: "0 12px", gap: 6,
    }}>
      <YdsIcon name="chevron_right_s" size={16} color="#999" />
      <span style={{ fontSize: 13, color: "#999" }}>뭐 먹을까? 메뉴나 가게를 검색해보세요</span>
    </div>
  );
}

export function TopBanner({
  bgColor = "#1a1a2e",
  bgImage = null,
  theme = "dark",
  title = "매일 하루종일 특가",
  subtitle = "멈추지 않는 선착순 할인!",
  address = "서울 강남구 역삼동",
  showSearch = true,
}) {
  return (
    <div style={{
      width: "100%", position: "relative",
      background: bgColor,
      fontFamily: "Pretendard, Roboto, sans-serif",
      overflow: "hidden",
    }}>
      {/* 배경 이미지 — 480 기준 센터, 좌우 크롭, bottom 정렬 */}
      {bgImage && (
        <img src={bgImage} alt="" style={{
          position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: 480, height: "auto", minHeight: "100%",
          objectFit: "cover", objectPosition: "center bottom",
          pointerEvents: "none",
        }} />
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        <StatusBar theme={theme} />
        <TopNav theme={theme} address={address} />
        <ContentsArea title={title} subtitle={subtitle} theme={theme} />
        {showSearch && <SearchBar />}
        {/* safety bottom 32px */}
        <div style={{ height: SAFETY_BOTTOM }} />
      </div>
    </div>
  );
}

// ── Section (Storybook) ─────────────────────────────────────────────────────
export default function TopBannerSection() {
  const [theme, setTheme] = useState("dark");

  return (
    <div style={{ padding: "24px 0" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#999" }}>Theme:</span>
        <button onClick={() => setTheme("dark")}
          style={{ padding: "4px 12px", borderRadius: 20, border: "1.5px solid #e0e0e0",
            background: theme === "dark" ? "#333" : "#fff", color: theme === "dark" ? "#fff" : "#666",
            fontSize: 10, cursor: "pointer" }}>Dark</button>
        <button onClick={() => setTheme("light")}
          style={{ padding: "4px 12px", borderRadius: 20, border: "1.5px solid #e0e0e0",
            background: theme === "light" ? "#0C74E4" : "#fff", color: theme === "light" ? "#fff" : "#666",
            fontSize: 10, cursor: "pointer" }}>Light</button>
      </div>

      {/* Dark theme */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#999", marginBottom: 6 }}>promotion_area_1 — {theme} theme</div>
        <div style={{ width: 390, borderRadius: 16, overflow: "hidden" }}>
          <TopBanner
            theme={theme}
            bgColor={theme === "dark" ? "#1a1a2e" : "#E8F0FF"}
            title="매일 하루종일 특가"
            subtitle="멈추지 않는 선착순 할인!"
          />
        </div>
      </div>

      {/* Variants */}
      <div style={{ fontSize: 11, color: "#999", marginBottom: 6 }}>color variants</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {[
          { bg: "#1a1a2e", theme: "dark", title: "무한적립" },
          { bg: "#2d1b4e", theme: "dark", title: "브랜드위크" },
          { bg: "#0C3B5C", theme: "dark", title: "요기패스X" },
          { bg: "#FFE6EE", theme: "light", title: "선착순 특가" },
          { bg: "#E8F5E9", theme: "light", title: "네이버 멤버십" },
        ].map((v, i) => (
          <div key={i} style={{ width: 390, borderRadius: 16, overflow: "hidden", marginBottom: 12 }}>
            <TopBanner bgColor={v.bg} theme={v.theme} title={v.title} subtitle="오늘만 이 가격!" showSearch={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
