import { useState } from "react";
import { metaTokens } from "../tokens";
import { YdsIcon } from "../icons.jsx";
import { SingleBadge, OffersBadge } from "./Badge.jsx";

// ─── YDS 2.0 BrandnewBanner Component (리뉴얼-2026) ────────────────────────
// Figma: 리뉴얼-2026 > BrandnewBanner
// 프로모션 배너 — 선착순 특가 / 네이버 멤버십 / 무한적립

const BANNER_VARIANTS = {
  a: {
    title: "선착순 특가",
    subtitle: "오늘만 이 가격!",
    bg: "linear-gradient(135deg, #FFE6EE 0%, #FFF5F8 100%)",
    accentColor: "#FA0050",
    emoji: "👑",
    badges: [
      { text: "배달앱최저가", showLeftIcon: true, leftIconName: "check_s" },
    ],
  },
  b: {
    title: "네이버 멤버십",
    subtitle: "최대 10% 적립 혜택",
    bg: "linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%)",
    accentColor: "#00B886",
    emoji: "💚",
    badges: [
      { text: "스페셜적립", showLeftIcon: true, leftIconName: "check_s" },
    ],
  },
  c: {
    title: "무한적립",
    subtitle: "주문할수록 적립이 쌓여요",
    bg: "linear-gradient(135deg, #EDE7F6 0%, #F3E5F5 100%)",
    accentColor: "#7B61FF",
    emoji: "✨",
    badges: [
      { text: "최대 5% 적립" },
    ],
  },
};

export function BrandnewBanner({
  variant = "a",
  card = false,
  imageCount = 10,
  currentImage = 1,
  onClick,
}) {
  const v = BANNER_VARIANTS[variant] || BANNER_VARIANTS.a;

  const containerStyle = {
    display: "flex", flexDirection: "column", gap: 10,
    padding: card ? 16 : "16px 0",
    background: card ? v.bg : "transparent",
    borderRadius: card ? metaTokens.radius.meta_r5 : 0,
    fontFamily: "Pretendard, Roboto, sans-serif",
    cursor: onClick ? "pointer" : "default",
    overflow: "hidden",
    position: "relative",
  };

  return (
    <div style={containerStyle} onClick={onClick}>
      {/* Card background gradient for non-card mode */}
      {!card && (
        <div style={{
          position: "absolute", inset: 0, background: v.bg,
          borderRadius: metaTokens.radius.meta_r5,
          zIndex: 0,
        }} />
      )}

      <div style={{ position: "relative", zIndex: 1, padding: card ? 0 : 16 }}>
        {/* Top row: badges + indicator */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ display: "flex", gap: 4 }}>
            {v.badges.map((b, i) => (
              <SingleBadge key={i} text={b.text} colorStyle="primary" size="small"
                showLeftIcon={b.showLeftIcon} leftIconName={b.leftIconName} />
            ))}
          </div>
          <span style={{ fontSize: 11, color: "#999" }}>
            {currentImage}/{imageCount}
            <span style={{ marginLeft: 4, fontSize: 10, color: "#bbb" }}>더보기 ›</span>
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Text */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#333", lineHeight: "26px" }}>{v.title}</div>
            <div style={{ fontSize: 14, color: "#666", marginTop: 4, lineHeight: "20px" }}>{v.subtitle}</div>
          </div>

          {/* Visual */}
          <div style={{
            width: 80, height: 80, borderRadius: metaTokens.radius.meta_r4,
            background: `${v.accentColor}15`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 36 }}>{v.emoji}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── BrandnewCarousel (다중 배너 캐러셀) ────────────────────────────────────
export function BrandnewCarousel({ banners = ["a", "b", "c"] }) {
  const [current, setCurrent] = useState(0);

  return (
    <div style={{ position: "relative", fontFamily: "Pretendard, Roboto, sans-serif" }}>
      <BrandnewBanner
        variant={banners[current]}
        card
        imageCount={banners.length}
        currentImage={current + 1}
      />

      {/* Indicator dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8 }}>
        {banners.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{
            width: current === i ? 16 : 6, height: 6,
            borderRadius: 3,
            background: current === i ? "#333" : "#ddd",
            border: "none", cursor: "pointer", padding: 0,
            transition: "all 0.2s",
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Section (Storybook) ─────────────────────────────────────────────────────
export default function BrandnewBannerSection() {
  const [variant, setVariant] = useState("a");
  const [isCard, setIsCard] = useState(true);

  return (
    <div style={{ padding: "24px 0" }}>
      {/* Controls */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#999", marginRight: 4 }}>Variant:</span>
          {["a", "b", "c"].map(v => (
            <button key={v} onClick={() => setVariant(v)}
              style={{ padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${variant === v ? "#0C74E4" : "#e0e0e0"}`,
                background: variant === v ? "#0C74E4" : "#fff", color: variant === v ? "#fff" : "#666",
                fontSize: 11, cursor: "pointer" }}>
              {v === "a" ? "선착순 특가" : v === "b" ? "네이버 멤버십" : "무한적립"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#999", marginRight: 4 }}>Card:</span>
          <button onClick={() => setIsCard(!isCard)}
            style={{ padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${isCard ? "#0C74E4" : "#e0e0e0"}`,
              background: isCard ? "#0C74E4" : "#fff", color: isCard ? "#fff" : "#666",
              fontSize: 11, cursor: "pointer" }}>{isCard ? "ON" : "OFF"}</button>
        </div>
      </div>

      {/* Single banner */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 12 }}>BrandnewBanner</div>
        <div style={{ width: 375, background: "#fff", borderRadius: 12, padding: 16 }}>
          <BrandnewBanner variant={variant} card={isCard} />
        </div>
      </div>

      {/* All variants */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 12 }}>All Variants</div>
        <div style={{ width: 375, display: "flex", flexDirection: "column", gap: 12 }}>
          {["a", "b", "c"].map(v => (
            <BrandnewBanner key={v} variant={v} card />
          ))}
        </div>
      </div>

      {/* Carousel */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 12 }}>BrandnewCarousel</div>
        <div style={{ width: 375, background: "#fff", borderRadius: 12, padding: 16 }}>
          <BrandnewCarousel />
        </div>
      </div>
    </div>
  );
}
