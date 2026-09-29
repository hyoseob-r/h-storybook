import { useState } from "react";
import { metaTokens } from "../tokens";
import { YdsIcon } from "../icons.jsx";

// ─── YDS 2.0 BrandnewBanner Component (리뉴얼-2026) ────────────────────────
// 2가지 타입:
// 1) 컬러 테마 배너 — 파스텔 bg + 고정/커스텀뱃지 + KV 영역
// 2) 이미지 배너 — 풀 배경이미지 + 텍스트 오버레이 (black/white 반전)

// ── 컬러 테마 (10종) ────────────────────────────────────────────────────────
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

const FIXED_BADGE_PRESETS = {
  lowest:       { text: "배달앱 최저가", iconName: "ic_lowest" },
  specialpoint: { text: "스페셜적립", iconName: "ic_specialpoint" },
};

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE 1: 컬러 테마 배너
// ═══════════════════════════════════════════════════════════════════════════════
export function BrandnewBanner({
  themeId = "blue",
  title = "선착순 특가",
  subtitle = "오늘만 이 가격!",
  fixedBadges = ["lowest", "specialpoint"],
  customBadges = [],
  imageCount = 10,
  currentImage = 1,
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
    }} onClick={onClick}>
      <div style={{ padding: 16 }}>
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
          <span style={{ fontSize: 11, color: theme.badgeColor, opacity: 0.7, flexShrink: 0, marginLeft: 8 }}>
            {currentImage}/{imageCount} 더보기 ›
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#333", lineHeight: "26px" }}>{title}</div>
            {subtitle && <div style={{ fontSize: 14, color: "#666", marginTop: 4, lineHeight: "20px" }}>{subtitle}</div>}
          </div>
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

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE 2: 이미지 배경 배너 (brandnew banner)
// ═══════════════════════════════════════════════════════════════════════════════
// 케이스: 텍스트 O/X, 텍스트 색상 반전 (black/white), 서브텍스트 O/X
export function BrandnewImageBanner({
  bgImage = null,
  bgColor = "#1a1a2e",
  title = "매일 하루종일 특가\n+최대 5% 적립까지!",
  subtitle = "멈추지 않는 선착순 할인!",
  showTitle = true,
  showSubtitle = true,
  textInvert = true,
  height = 200,
  borderRadius = 16,
  onClick,
}) {
  const textColor = textInvert ? "#fff" : "#333";
  const subColor = textInvert ? "rgba(255,255,255,0.7)" : "#666";

  return (
    <div style={{
      position: "relative",
      width: "100%", height,
      borderRadius,
      overflow: "hidden",
      background: bgColor,
      cursor: onClick ? "pointer" : "default",
      fontFamily: "'YOGIYO Sans', Pretendard, Roboto, sans-serif",
    }} onClick={onClick}>
      {/* Background image */}
      {bgImage && (
        <img src={bgImage} alt="" style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center",
        }} />
      )}

      {/* Text overlay */}
      {showTitle && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          justifyContent: "center",
          padding: "24px 20px",
        }}>
          <div style={{
            fontSize: 24, fontWeight: 700, color: textColor,
            lineHeight: "32px", whiteSpace: "pre-line",
          }}>
            {title}
          </div>
          {showSubtitle && subtitle && (
            <div style={{
              fontSize: 14, fontWeight: 400, color: subColor,
              marginTop: 8, lineHeight: "20px",
              fontFamily: "Pretendard, Roboto, sans-serif",
            }}>
              {subtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── BrandnewCarousel (다중 배너 캐러셀) ────────────────────────────────────
export function BrandnewCarousel({ banners = [], type = "color" }) {
  const [current, setCurrent] = useState(0);
  if (banners.length === 0) return null;
  const b = banners[current];

  return (
    <div style={{ position: "relative", fontFamily: "Pretendard, Roboto, sans-serif" }}>
      {type === "image" ? (
        <BrandnewImageBanner {...b} />
      ) : (
        <BrandnewBanner {...b} imageCount={banners.length} currentImage={current + 1} />
      )}
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
export default function BrandnewBannerSection() {
  const [selectedTheme, setSelectedTheme] = useState("blue");
  const [textInvert, setTextInvert] = useState(true);
  const [showSub, setShowSub] = useState(true);

  return (
    <div style={{ padding: "24px 0" }}>
      {/* ── 이미지 배너 (Type 2) ── */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#333", marginBottom: 16 }}>Image Banner (brandnew banner)</h3>

        <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#999" }}>Text color:</span>
          <button onClick={() => setTextInvert(!textInvert)}
            style={{ padding: "4px 12px", borderRadius: 20, border: "1.5px solid #e0e0e0",
              background: textInvert ? "#333" : "#fff", color: textInvert ? "#fff" : "#333",
              fontSize: 10, cursor: "pointer" }}>{textInvert ? "White" : "Black"}</button>
          <span style={{ fontSize: 11, color: "#999", marginLeft: 8 }}>Subtitle:</span>
          <button onClick={() => setShowSub(!showSub)}
            style={{ padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${showSub ? "#0C74E4" : "#e0e0e0"}`,
              background: showSub ? "#0C74E4" : "#fff", color: showSub ? "#fff" : "#666",
              fontSize: 10, cursor: "pointer" }}>{showSub ? "ON" : "OFF"}</button>
        </div>

        {/* 서브 텍스트 O */}
        <div style={{ width: 375, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#999", marginBottom: 6 }}>텍스트 O · 서브텍스트 {showSub ? "O" : "X"} · {textInvert ? "white" : "black"}</div>
          <BrandnewImageBanner
            bgColor="#1a1a2e"
            title={"매일 하루종일 특가\n+최대 5% 적립까지!"}
            subtitle="멈추지 않는 선착순 할인!"
            textInvert={textInvert}
            showSubtitle={showSub}
          />
        </div>

        {/* 텍스트 X */}
        <div style={{ width: 375 }}>
          <div style={{ fontSize: 11, color: "#999", marginBottom: 6 }}>텍스트 X (이미지만)</div>
          <BrandnewImageBanner
            bgColor="#2d1b4e"
            showTitle={false}
          />
        </div>
      </div>

      {/* ── 컬러 테마 배너 (Type 1) ── */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#333", marginBottom: 16 }}>Color Theme Banner</h3>

        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#999", marginRight: 4 }}>Theme:</span>
          {BANNER_THEMES.map(t => (
            <button key={t.id} onClick={() => setSelectedTheme(t.id)}
              style={{
                width: 28, height: 28, borderRadius: 8,
                background: t.bannerBg,
                border: selectedTheme === t.id ? `2px solid ${t.badgeColor}` : "2px solid transparent",
                cursor: "pointer",
              }}
              title={t.id}
            />
          ))}
        </div>

        <div style={{ width: 375, marginBottom: 16 }}>
          <BrandnewBanner
            themeId={selectedTheme}
            title="선착순 특가"
            subtitle="오늘만 이 가격!"
            fixedBadges={["lowest", "specialpoint"]}
            customBadges={["한정수량"]}
          />
        </div>

        {/* All 10 themes */}
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

      {/* ── Carousel ── */}
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#333", marginBottom: 16 }}>Carousel</h3>
        <div style={{ width: 375 }}>
          <BrandnewCarousel banners={[
            { themeId: "blue", title: "선착순 특가", subtitle: "오늘만 이 가격!", fixedBadges: ["lowest", "specialpoint"] },
            { themeId: "green", title: "네이버 멤버십", subtitle: "최대 10% 적립 혜택", fixedBadges: ["specialpoint"], customBadges: ["네이버페이"] },
            { themeId: "red", title: "오늘의 핫딜", subtitle: "매일 바뀌는 특가 메뉴", fixedBadges: ["lowest"], customBadges: ["한정수량"] },
          ]} />
        </div>
      </div>
    </div>
  );
}
