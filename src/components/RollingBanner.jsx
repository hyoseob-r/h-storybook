import { useState } from "react";
import { YdsIcon } from "../icons.jsx";

// ─── YDS 2.0 RollingBanner Component (리뉴얼-2026) ────────────────────────
// Figma spec: brandnew banner — node 13739:583526
// 390 x 128 고정, overflow hidden
// 3가지 유형:
//   nukki1: 누끼 이미지 (음식 등) — 에셋 우측 정렬
//   nukki2: 누끼 이미지 (오브젝트+배경) — 에셋 우측 정렬
//   fullimg: 풀이미지 (텍스트 포함) — 에셋 센터 정렬, 텍스트/뱃지 숨김

const BANNER_IMAGES = {
  nukki1: "/assets/banners/banner_type2_nukki.png",
  nukki2: "/assets/banners/banner_type1_fullimg_text.png",
  fullimg: "/assets/banners/banner_type3_fullimg_notext.png",
};

// ── 컬러 테마 10종 (Figma theme_3차 26.06.05) ──────────────────────────────
const BANNER_THEMES = [
  { id: "red",    bannerBg: "#FFBCBC", kvBg: "#FFDBDB", badgeColor: "#D03021", customBadgeBg: "#FFE3E3", customBadgeText: "#D03021" },
  { id: "orange", bannerBg: "#FFC47D", kvBg: "#FFE2D6", badgeColor: "#E26917", customBadgeBg: "#FFEEDE", customBadgeText: "#E26917" },
  { id: "yellow", bannerBg: "#FFD874", kvBg: "#FFF3D6", badgeColor: "#D47C00", customBadgeBg: "#FFF2D2", customBadgeText: "#D47C00" },
  { id: "green",  bannerBg: "#B0ECB0", kvBg: "#DFF6DF", badgeColor: "#168046", customBadgeBg: "#E3FFE3", customBadgeText: "#168046" },
  { id: "cyan",   bannerBg: "#A6E3FF", kvBg: "#DBF5FF", badgeColor: "#095EAE", customBadgeBg: "#E2F7FF", customBadgeText: "#095EAE" },
  { id: "blue",   bannerBg: "#A2D1FF", kvBg: "#DBEAFF", badgeColor: "#2D509C", customBadgeBg: "#DFEFFF", customBadgeText: "#2D509C" },
  { id: "pink",   bannerBg: "#FFC3D6", kvBg: "#FFE1EB", badgeColor: "#D93759", customBadgeBg: "#FFE9F0", customBadgeText: "#D93759" },
  { id: "purple", bannerBg: "#D5BFFF", kvBg: "#E9E9FF", badgeColor: "#5F3E9B", customBadgeBg: "#EFE7FF", customBadgeText: "#5F3E9B" },
  { id: "brown",  bannerBg: "#ECCBAF", kvBg: "#F2E6F1", badgeColor: "#894D2D", customBadgeBg: "#FFF1E5", customBadgeText: "#894D2D" },
  { id: "gray",   bannerBg: "#DADADA", kvBg: "#F2F2F2", badgeColor: "#4E4E4E", customBadgeBg: "#EFEFEF", customBadgeText: "#4E4E4E" },
];

function getTheme(themeId) {
  return BANNER_THEMES.find(t => t.id === themeId) || BANNER_THEMES[5]; // default: blue
}

// ── BannerBadge (상단 좌측 — 어두운 배경 + 흰 텍스트) ────────────────────────
function BannerBadge({ icon, text, small = false, bgColor = "#153274" }) {
  const fontSize = small ? 11 : 12;
  const lineHeight = small ? "15px" : "16px";
  const padding = small ? "2px 6px" : "2px 8px";

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 2,
      padding,
      background: bgColor,
      borderRadius: "0 0 4px 4px",
      overflow: "hidden", whiteSpace: "nowrap",
    }}>
      {icon && <YdsIcon name={icon} size={12} color="#fff" />}
      <span style={{
        fontSize, fontWeight: 700, lineHeight, color: "#fff",
        fontFamily: "Pretendard, Roboto, sans-serif",
      }}>{text}</span>
    </span>
  );
}

// ── CustomBadge (우상단 삼각형 — 45도 회전 텍스트, 테마 색상) ────────────────
function CustomBadge({ label, bgColor = "#DFEFFF", textColor = "#2D509C" }) {
  if (!label) return null;

  return (
    <div style={{
      position: "absolute", top: 0, right: 0,
      width: 50, height: 50,
      overflow: "hidden",
      pointerEvents: "none",
    }}>
      {/* 삼각형 배경 50x50 — 테마 customBadgeBg */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 0, height: 0,
        borderStyle: "solid",
        borderWidth: "0 50px 50px 0",
        borderColor: `transparent ${bgColor} transparent transparent`,
      }} />
      {/* 텍스트 영역 40x40 — 우상단 정렬 */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 36, height: 36,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{
        transform: "rotate(45deg)",
        textAlign: "center",
        fontSize: 12,
        fontWeight: 700,
        lineHeight: "14px",
        color: textColor,
        fontFamily: "'YOGIYO Sans', Pretendard, sans-serif",
        whiteSpace: "nowrap",
      }}>{label}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RollingBanner — 메인 컴포넌트
// ═══════════════════════════════════════════════════════════════════════════════
export function RollingBanner({
  bannerType = "nukki2",
  variant = "full", // "full" | "card"
  theme = "blue",
  bgColor = null,
  title1 = "매일 하루종일 특가",
  title2 = "+최대 5% 적립까지!",
  description = "멈추지 않는 선착순 할인!",
  badges = [],
  customBadgeLabel = "선착순",
  bannerSrc = null,
  onClick,
}) {
  const t = getTheme(theme);
  const isFullImg = bannerType === "fullimg";
  const imageSrc = bannerSrc || BANNER_IMAGES[bannerType] || BANNER_IMAGES.nukki2;

  // 에셋 정렬: 누끼1/2 → 우측, 풀이미지 → 센터
  const imgPosition = isFullImg ? "center" : "right center";

  return (
    <div style={{
      position: "relative",
      width: "100%", height: 128,
      overflow: "hidden",
      background: bgColor || t.bannerBg,
      borderRadius: variant === "card" ? 12 : 0,
      margin: variant === "card" ? "0 16px" : 0,
      cursor: onClick ? "pointer" : "default",
      fontFamily: "Pretendard, Roboto, sans-serif",
    }} onClick={onClick}>
      {/* 배경 이미지 — 원본 크기 고정, 넘치면 크롭 */}
      <img src={imageSrc} alt="" style={{
        position: "absolute", top: 0,
        height: 128,
        ...(isFullImg
          ? { left: "50%", transform: "translateX(-50%)" }
          : { right: 0 }),
      }} />

      {/* 풀이미지: 텍스트/뱃지/커스텀뱃지 전부 숨김 */}
      {!isFullImg && (
        <>
          {/* 상단 좌측: BannerBadge 그룹 */}
          {badges.length > 0 && (
            <div style={{
              position: "absolute", top: 0, left: 20,
              display: "flex", gap: 4,
              zIndex: 2,
            }}>
              {badges.map((b, i) => (
                <BannerBadge
                  key={i}
                  icon={b.icon}
                  text={b.text}
                  small={b.small}
                  bgColor={t.badgeColor}
                />
              ))}
            </div>
          )}

          {/* 중앙 좌측: 타이틀 + description */}
          <div style={{
            position: "absolute",
            top: "50%", left: 20,
            transform: "translateY(-50%)",
            zIndex: 1,
          }}>
            <div style={{
              fontSize: 19, fontWeight: 700, lineHeight: "24px",
              color: "#111",
              fontFamily: "'YOGIYO Sans', Pretendard, sans-serif",
            }}>
              {title1}
            </div>
            {title2 && (
              <div style={{
                fontSize: 19, fontWeight: 700, lineHeight: "24px",
                color: "#111",
                fontFamily: "'YOGIYO Sans', Pretendard, sans-serif",
              }}>
                {title2}
              </div>
            )}
            {description && (
              <div style={{
                fontSize: 12, fontWeight: 400, lineHeight: "16px",
                color: "#333",
                marginTop: 4,
                fontFamily: "Pretendard, Roboto, sans-serif",
              }}>
                {description}
              </div>
            )}
          </div>

          {/* 우상단: CustomBadge — 테마 색상 */}
          {customBadgeLabel && <CustomBadge label={customBadgeLabel} bgColor={t.customBadgeBg} textColor={t.customBadgeText} />}
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Section (Storybook)
// ═══════════════════════════════════════════════════════════════════════════════
const controlStyle = {
  padding: "16px 20px", background: "#fff", borderRadius: 12,
  border: "1px solid #e8e8e8", marginBottom: 16,
};

const DEMO_BADGES = [
  { icon: "ic_lowest_flat", text: "배달앱 최저가" },
  { icon: "ic_specialpoint_flat", text: "스페셜적립", small: true },
];

const THEME_IDS = ["red", "orange", "yellow", "green", "cyan", "blue", "pink", "purple", "brown", "gray"];

export default function RollingBannerSection() {
  const [bannerType, setBannerType] = useState("nukki2");
  const [variant, setVariant] = useState("full");
  const [theme, setTheme] = useState("blue");
  const [showBadges, setShowBadges] = useState(true);
  const [showCustomBadge, setShowCustomBadge] = useState(true);
  const [useCustomBg, setUseCustomBg] = useState(false);
  const [customBgColor, setCustomBgColor] = useState("#1a1a2e");

  const chipStyle = (active) => ({
    padding: "4px 12px", borderRadius: 20,
    border: `1.5px solid ${active ? "#0C74E4" : "#e0e0e0"}`,
    background: active ? "#0C74E4" : "#fff",
    color: active ? "#fff" : "#666",
    fontSize: 10, cursor: "pointer",
  });

  const themeChipStyle = (id) => {
    const t = getTheme(id);
    const active = theme === id;
    return {
      padding: "4px 10px", borderRadius: 20, cursor: "pointer",
      border: active ? "2px solid #333" : "1.5px solid #e0e0e0",
      background: t.bannerBg, color: t.badgeColor,
      fontSize: 10, fontWeight: 700,
    };
  };

  return (
    <div style={{ padding: "24px 0" }}>
      {/* Controls */}
      <div style={controlStyle}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#333", marginBottom: 10 }}>Options</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, color: "#999", width: 60, flexShrink: 0 }}>Type</span>
            {["nukki1", "nukki2", "fullimg"].map(t => (
              <button key={t} onClick={() => setBannerType(t)} style={chipStyle(bannerType === t)}>
                {t === "nukki1" ? "누끼1" : t === "nukki2" ? "누끼2" : "풀이미지"}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "#999", width: 60, flexShrink: 0 }}>Variant</span>
            {["full", "card"].map(v => (
              <button key={v} onClick={() => setVariant(v)} style={chipStyle(variant === v)}>
                {v === "full" ? "Full (좌우 꽉참)" : "Card (r12)"}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, color: "#999", width: 60, flexShrink: 0 }}>Theme</span>
            {THEME_IDS.map(id => (
              <button key={id} onClick={() => setTheme(id)} style={themeChipStyle(id)}>
                {id}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "#999", width: 60, flexShrink: 0 }}>Toggle</span>
            <button onClick={() => setShowBadges(!showBadges)} style={chipStyle(showBadges)}>
              Badges {showBadges ? "ON" : "OFF"}
            </button>
            <button onClick={() => setShowCustomBadge(!showCustomBadge)} style={chipStyle(showCustomBadge)}>
              CustomBadge {showCustomBadge ? "ON" : "OFF"}
            </button>
          </div>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "#999", width: 60, flexShrink: 0 }}>BgColor</span>
            <button onClick={() => setUseCustomBg(!useCustomBg)} style={chipStyle(useCustomBg)}>
              커스텀 배경색 {useCustomBg ? "ON" : "OFF"}
            </button>
            {useCustomBg && (
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <input
                  type="color"
                  value={customBgColor}
                  onChange={e => setCustomBgColor(e.target.value)}
                  style={{ width: 24, height: 24, border: "1px solid #ddd", borderRadius: 6, cursor: "pointer", padding: 0 }}
                />
                <input
                  type="text"
                  value={customBgColor}
                  onChange={e => setCustomBgColor(e.target.value)}
                  style={{ width: 70, fontSize: 10, padding: "4px 6px", border: "1px solid #ddd", borderRadius: 6, fontFamily: "monospace" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8 }}>Preview</div>
      <div style={{ marginBottom: 32 }}>
        <RollingBanner
          bannerType={bannerType}
          variant={variant}
          theme={theme}
          bgColor={useCustomBg ? customBgColor : null}
          title1="매일 하루종일 특가"
          title2="+최대 5% 적립까지!"
          description="멈추지 않는 선착순 할인!"
          badges={showBadges ? DEMO_BADGES : []}
          customBadgeLabel={showCustomBadge ? "선착순" : null}
        />
      </div>

      {/* 3가지 유형 데모 */}
      <div style={{ fontSize: 14, fontWeight: 700, color: "#333", marginBottom: 16 }}>All 3 Types</div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#999", marginBottom: 6 }}>누끼1 — 음식 누끼, 에셋 우측 정렬</div>
        <RollingBanner
          bannerType="nukki1" theme="pink"
          title1="오늘의 추천 메뉴" title2="신선한 재료로 만든" description="매일 새로운 메뉴를 만나보세요"
          badges={[{ icon: "ic_lowest_flat", text: "배달앱 최저가" }]} customBadgeLabel="추천"
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#999", marginBottom: 6 }}>누끼2 — 오브젝트+배경, 에셋 우측 정렬</div>
        <RollingBanner
          bannerType="nukki2" theme="blue"
          title1="매일 하루종일 특가" title2="+최대 5% 적립까지!" description="멈추지 않는 선착순 할인!"
          badges={DEMO_BADGES} customBadgeLabel="선착순"
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#999", marginBottom: 6 }}>풀이미지 — 텍스트 포함 이미지, 센터 정렬</div>
        <RollingBanner bannerType="fullimg" customBadgeLabel={null} />
      </div>
    </div>
  );
}
