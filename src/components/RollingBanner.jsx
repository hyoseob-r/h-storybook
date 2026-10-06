import { useState } from "react";
import { YdsIcon } from "../icons.jsx";

// ─── YDS 2.0 RollingBanner Component (리뉴얼-2026) ────────────────────────
// Figma spec: brandnew banner — node 13739:583526
// 390 x 128 고정, overflow hidden
// 3가지 유형:
//   type1: 라이트 배경 + 우측 오브젝트, 좌측 텍스트
//   type2: 투명/흰 배경 + 우측 음식 누끼, 좌측 텍스트
//   type3: 어두운 풀이미지, 텍스트 이미지에 포함 (오버레이 불필요)

const BANNER_IMAGES = {
  type1: "/assets/banners/banner_type1_fullimg_text.png",
  type2: "/assets/banners/banner_type2_nukki.png",
  type3: "/assets/banners/banner_type3_fullimg_notext.png",
};

// ── BannerBadge (상단 좌측 — 어두운 배경 + 흰 텍스트) ────────────────────────
function BannerBadge({ icon, text, small = false }) {
  const fontSize = small ? 11 : 12;
  const lineHeight = small ? "15px" : "16px";
  const padding = small ? "2px 6px" : "2px 8px";

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 2,
      padding,
      background: "#153274",
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

// ── CustomBadge (우상단 삼각형 — 45도 회전 텍스트) ──────────────────────────
function CustomBadge({ label }) {
  if (!label) return null;

  return (
    <div style={{
      position: "absolute", top: 0, right: 0,
      width: 50, height: 50,
      overflow: "hidden",
      pointerEvents: "none",
    }}>
      {/* 삼각형 배경 */}
      <div style={{
        position: "absolute", top: -25, right: -25,
        width: 50, height: 50,
        background: "#fff",
        transform: "rotate(45deg)",
        transformOrigin: "center center",
      }} />
      {/* 45도 회전 텍스트 */}
      <span style={{
        position: "absolute",
        top: 10,
        right: 2,
        transform: "rotate(45deg)",
        transformOrigin: "center center",
        fontSize: 12,
        fontWeight: 700,
        lineHeight: "16px",
        color: "#2d509c",
        fontFamily: "'YOGIYO Sans', Pretendard, sans-serif",
        whiteSpace: "nowrap",
      }}>{label}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RollingBanner — 메인 컴포넌트
// ═══════════════════════════════════════════════════════════════════════════════
export function RollingBanner({
  bannerType = "type1",
  bgColor = "#8fc7ff",
  title1 = "매일 하루종일 특가",
  title2 = "+최대 5% 적립까지!",
  description = "멈추지 않는 선착순 할인!",
  badges = [],
  customBadgeLabel = "선착순",
  bannerSrc = null,
  onClick,
}) {
  const isType3 = bannerType === "type3";
  const imageSrc = bannerSrc || BANNER_IMAGES[bannerType] || BANNER_IMAGES.type1;

  return (
    <div style={{
      position: "relative",
      width: 390, height: 128,
      overflow: "hidden",
      background: isType3 ? "#1a1a2e" : bgColor,
      cursor: onClick ? "pointer" : "default",
      fontFamily: "Pretendard, Roboto, sans-serif",
    }} onClick={onClick}>
      {/* 배경 이미지 (전체 커버) */}
      <img src={imageSrc} alt="" style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        objectFit: "cover", objectPosition: "center",
      }} />

      {/* type3: 이미지만 표시, 텍스트/뱃지 숨김 */}
      {!isType3 && (
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
        </>
      )}

      {/* 우상단: CustomBadge */}
      {customBadgeLabel && <CustomBadge label={customBadgeLabel} />}
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

export default function RollingBannerSection() {
  const [bannerType, setBannerType] = useState("type1");
  const [showBadges, setShowBadges] = useState(true);
  const [showCustomBadge, setShowCustomBadge] = useState(true);

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
        <div style={{ fontSize: 11, fontWeight: 700, color: "#333", marginBottom: 10 }}>Banner Type</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {["type1", "type2", "type3"].map(t => (
            <button key={t} onClick={() => setBannerType(t)} style={chipStyle(bannerType === t)}>
              {t === "type1" ? "Type 1 (풀이미지+텍스트)" : t === "type2" ? "Type 2 (누끼)" : "Type 3 (풀이미지)"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setShowBadges(!showBadges)} style={chipStyle(showBadges)}>
            Badges {showBadges ? "ON" : "OFF"}
          </button>
          <button onClick={() => setShowCustomBadge(!showCustomBadge)} style={chipStyle(showCustomBadge)}>
            CustomBadge {showCustomBadge ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Interactive Preview */}
      <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8 }}>Interactive Preview</div>
      <div style={{ marginBottom: 32 }}>
        <RollingBanner
          bannerType={bannerType}
          bgColor={bannerType === "type1" ? "#8fc7ff" : bannerType === "type2" ? "#ffffff" : undefined}
          title1="매일 하루종일 특가"
          title2="+최대 5% 적립까지!"
          description="멈추지 않는 선착순 할인!"
          badges={showBadges ? DEMO_BADGES : []}
          customBadgeLabel={showCustomBadge ? "선착순" : null}
        />
      </div>

      {/* 3가지 유형 데모 */}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#333", marginBottom: 16 }}>All 3 Types</h3>

      {/* Type 1 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#999", marginBottom: 6 }}>Type 1 — 라이트 배경 + 우측 오브젝트, 좌측 텍스트</div>
        <RollingBanner
          bannerType="type1"
          bgColor="#8fc7ff"
          title1="매일 하루종일 특가"
          title2="+최대 5% 적립까지!"
          description="멈추지 않는 선착순 할인!"
          badges={[
            { icon: "ic_lowest_flat", text: "배달앱 최저가" },
            { icon: "ic_specialpoint_flat", text: "스페셜적립", small: true },
          ]}
          customBadgeLabel="선착순"
        />
      </div>

      {/* Type 2 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#999", marginBottom: 6 }}>Type 2 — 투명/흰 배경 + 우측 음식 누끼, 좌측 텍스트</div>
        <RollingBanner
          bannerType="type2"
          bgColor="#ffffff"
          title1="오늘의 추천 메뉴"
          title2="신선한 재료로 만든"
          description="매일 새로운 메뉴를 만나보세요"
          badges={[
            { icon: "ic_lowest_flat", text: "배달앱 최저가" },
          ]}
          customBadgeLabel="추천"
        />
      </div>

      {/* Type 3 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#999", marginBottom: 6 }}>Type 3 — 어두운 풀이미지, 텍스트 이미지에 포함 (오버레이 없음)</div>
        <RollingBanner
          bannerType="type3"
          customBadgeLabel={null}
        />
      </div>
    </div>
  );
}
