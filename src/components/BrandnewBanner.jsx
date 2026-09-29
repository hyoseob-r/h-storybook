import { useState } from "react";
import { metaTokens } from "../tokens";
import { YdsIcon } from "../icons.jsx";

// ─── YDS 2.0 BrandnewBanner Component (리뉴얼-2026) ────────────────────────
// Figma: 리뉴얼-2026 > BrandnewBanner
// 10가지 컬러 테마 + 고정뱃지(filled dark) + 커스텀뱃지(light bg + dark text)

// ── 컬러 테마 (10종) ────────────────────────────────────────────────────────
// 배너bg / 고정뱃지(filled) / 커스텀뱃지bg / 커스텀뱃지text — 1:1:1:1 매핑
const BANNER_THEMES = [
  { id: "red",    bannerBg: "#FFBCBC", badgeColor: "#D03021", customBadgeBg: "#FFE3E3", customBadgeText: "#D03021" },
  { id: "orange", bannerBg: "#FFC47D", badgeColor: "#E26917", customBadgeBg: "#FFEEDE", customBadgeText: "#E26917" },
  { id: "yellow", bannerBg: "#FFD874", badgeColor: "#D47C00", customBadgeBg: "#FFF2D2", customBadgeText: "#D47C00" },
  { id: "green",  bannerBg: "#B0ECB0", badgeColor: "#168046", customBadgeBg: "#E3FFE3", customBadgeText: "#168046" },
  { id: "cyan",   bannerBg: "#A6E3FF", badgeColor: "#095EAE", customBadgeBg: "#E2F7FF", customBadgeText: "#095EAE" },
  { id: "blue",   bannerBg: "#A2D1FF", badgeColor: "#2D509C", customBadgeBg: "#DFEFFF", customBadgeText: "#2D509C" },
  { id: "pink",   bannerBg: "#FFC3D6", badgeColor: "#D93759", customBadgeBg: "#FFE9F0", customBadgeText: "#D93759" },
  { id: "purple", bannerBg: "#D5BFFF", badgeColor: "#5F3E9B", customBadgeBg: "#EFE7FF", customBadgeText: "#5F3E9B" },
  { id: "brown",  bannerBg: "#ECCBAF", badgeColor: "#894D2D", customBadgeBg: "#FFF1E5", customBadgeText: "#894D2D" },
  { id: "gray",   bannerBg: "#DADADA", badgeColor: "#4E4E4E", customBadgeBg: "#EFEFEF", customBadgeText: "#4E4E4E" },
];

function getTheme(themeId) {
  return BANNER_THEMES.find(t => t.id === themeId) || BANNER_THEMES[0];
}

// ── 고정 뱃지 (Filled dark bg + white text) ─────────────────────────────────
// 배달앱 최저가, 스페셜적립 — 배너/키비주얼 동일 컬러
function FixedBadge({ text, iconName, theme }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 2,
      height: 18, padding: "0 6px", borderRadius: 4,
      background: theme.badgeColor, overflow: "hidden", whiteSpace: "nowrap",
    }}>
      {iconName && <YdsIcon name={iconName} size={12} color="#fff" />}
      <span style={{ fontSize: 10, fontWeight: 700, lineHeight: "14px", color: "#fff" }}>{text}</span>
    </span>
  );
}

// ── 커스텀 뱃지 (Light bg + dark text) ──────────────────────────────────────
function CustomBadge({ text, theme }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      height: 18, padding: "0 6px", borderRadius: 4,
      background: theme.customBadgeBg, overflow: "hidden", whiteSpace: "nowrap",
    }}>
      <span style={{ fontSize: 10, fontWeight: 700, lineHeight: "14px", color: theme.customBadgeText }}>{text}</span>
    </span>
  );
}

// ── 고정 뱃지 프리셋 ────────────────────────────────────────────────────────
const FIXED_BADGE_PRESETS = {
  lowest:       { text: "배달앱 최저가", iconName: "ic_lowest" },
  specialpoint: { text: "스페셜적립", iconName: "ic_specialpoint" },
};

export function BrandnewBanner({
  themeId = "blue",
  title = "선착순 특가",
  subtitle = "오늘만 이 가격!",
  fixedBadges = ["lowest", "specialpoint"],
  customBadges = [],
  imageCount = 10,
  currentImage = 1,
  card = false,
  onClick,
}) {
  const theme = getTheme(themeId);

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      borderRadius: metaTokens.radius.meta_r5,
      background: theme.bannerBg,
      fontFamily: "Pretendard, Roboto, sans-serif",
      cursor: onClick ? "pointer" : "default",
      overflow: "hidden",
      position: "relative",
    }} onClick={onClick}>
      <div style={{ padding: 16 }}>
        {/* Top row: badges + indicator */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {fixedBadges.map((key, i) => {
              const preset = FIXED_BADGE_PRESETS[key];
              if (!preset) return null;
              return <FixedBadge key={i} text={preset.text} iconName={preset.iconName} theme={theme} />;
            })}
            {customBadges.map((text, i) => (
              <CustomBadge key={`c-${i}`} text={text} theme={theme} />
            ))}
          </div>
          <span style={{
            fontSize: 11, color: theme.badgeColor, opacity: 0.7,
            flexShrink: 0, marginLeft: 8,
          }}>
            {currentImage}/{imageCount} 더보기 ›
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#333", lineHeight: "26px" }}>{title}</div>
            <div style={{ fontSize: 14, color: "#666", marginTop: 4, lineHeight: "20px" }}>{subtitle}</div>
          </div>
          {/* 키비주얼 영역 (이미지 슬롯) */}
          <div style={{
            width: 80, height: 80, borderRadius: metaTokens.radius.meta_r4,
            background: "rgba(255,255,255,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, border: "1px solid rgba(255,255,255,0.6)",
          }}>
            <span style={{ fontSize: 11, color: theme.badgeColor, opacity: 0.5 }}>KV</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── BrandnewCarousel (다중 배너 캐러셀) ────────────────────────────────────
export function BrandnewCarousel({ banners = [] }) {
  const [current, setCurrent] = useState(0);
  if (banners.length === 0) return null;
  const b = banners[current];

  return (
    <div style={{ position: "relative", fontFamily: "Pretendard, Roboto, sans-serif" }}>
      <BrandnewBanner
        {...b}
        imageCount={banners.length}
        currentImage={current + 1}
      />
      {banners.length > 1 && (
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
      )}
    </div>
  );
}

// ── Section (Storybook) ─────────────────────────────────────────────────────
const SAMPLE_BANNERS = [
  { themeId: "blue",   title: "선착순 특가", subtitle: "오늘만 이 가격!", fixedBadges: ["lowest", "specialpoint"] },
  { themeId: "green",  title: "네이버 멤버십", subtitle: "최대 10% 적립 혜택", fixedBadges: ["specialpoint"], customBadges: ["네이버페이"] },
  { themeId: "purple", title: "무한적립", subtitle: "주문할수록 적립이 쌓여요", fixedBadges: ["specialpoint"] },
  { themeId: "red",    title: "오늘의 핫딜", subtitle: "매일 바뀌는 특가 메뉴", fixedBadges: ["lowest"], customBadges: ["한정수량"] },
  { themeId: "orange", title: "브랜드 위크", subtitle: "인기 브랜드 할인 모음", fixedBadges: ["lowest", "specialpoint"] },
  { themeId: "pink",   title: "뷰티 먹거리", subtitle: "건강한 한 끼", customBadges: ["건강식", "샐러드"] },
];

export default function BrandnewBannerSection() {
  const [selectedTheme, setSelectedTheme] = useState("blue");

  return (
    <div style={{ padding: "24px 0" }}>
      {/* Theme selector */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#999", marginRight: 4 }}>Theme:</span>
        {BANNER_THEMES.map(t => (
          <button key={t.id} onClick={() => setSelectedTheme(t.id)}
            style={{
              width: 28, height: 28, borderRadius: 8,
              background: t.bannerBg,
              border: selectedTheme === t.id ? `2px solid ${t.badgeColor}` : "2px solid transparent",
              cursor: "pointer", position: "relative",
            }}
            title={t.id}
          />
        ))}
      </div>

      {/* Single banner with selected theme */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 12 }}>
          BrandnewBanner — {selectedTheme}
        </div>
        <div style={{ width: 375 }}>
          <BrandnewBanner
            themeId={selectedTheme}
            title="선착순 특가"
            subtitle="오늘만 이 가격!"
            fixedBadges={["lowest", "specialpoint"]}
            customBadges={["한정수량"]}
          />
        </div>
      </div>

      {/* All 10 themes */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 12 }}>All 10 Themes</div>
        <div style={{ width: 375, display: "flex", flexDirection: "column", gap: 12 }}>
          {BANNER_THEMES.map(t => (
            <BrandnewBanner
              key={t.id}
              themeId={t.id}
              title={`${t.id} 테마`}
              subtitle="고정뱃지 + 커스텀뱃지 미리보기"
              fixedBadges={["lowest", "specialpoint"]}
              customBadges={["커스텀"]}
            />
          ))}
        </div>
      </div>

      {/* Carousel */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 12 }}>BrandnewCarousel</div>
        <div style={{ width: 375 }}>
          <BrandnewCarousel banners={SAMPLE_BANNERS} />
        </div>
      </div>
    </div>
  );
}
