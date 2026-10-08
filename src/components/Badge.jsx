import { useState } from "react";
import { metaTokens } from "../tokens";
import { YdsIcon } from "../icons.jsx";

// ─── YDS 2.0 Badge Component (리뉴얼-2026 기준) ─────────────────────────────
// Figma: 📌 Customer-Component > Badge
// 스타일: 흰색 bg + gray100 보더 + outlined 스타일 (이전 filled 스타일에서 변경됨)

// ── AD 뱃지 (이미지 기반, 전역 단일 소스) ────────────────────────────────────
// 이 이미지가 교체되면 모든 컴포넌트에 동일하게 적용됨
const AD_BADGE_SRC = "/assets/badge-icons/Tag_AD.png";
export function AdBadge({ style: customStyle }) {
  return (
    <img src={AD_BADGE_SRC} alt="AD" style={{
      height: 16, width: "auto", display: "block",
      ...customStyle,
    }} />
  );
}

// ── 혜택뱃지 (Figma: node 3518:56728) ────────────────────────────────────────
// 흰 배경 + #e5e5e5 보더 0.5px + shadow level_1 + rounded 9
// 텍스트: 10b, primary(#FA0050), center, maxWidth 70
// 사용처: VerticalLauncher, FoodCategory, QCSwimlane, ShopListCard 위 할인 라벨
const BENEFIT_BADGE_SHADOW = "0px 0px 2px rgba(25,48,64,0.08), 0px 1px 8px rgba(25,48,64,0.1)";
export function BenefitBadge({ label = "3,000원 할인" }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      maxWidth: 70,
      background: "#fff", border: "0.5px solid #e5e5e5",
      borderRadius: 9, padding: "1px 4px",
      boxShadow: BENEFIT_BADGE_SHADOW,
      fontSize: 10, fontWeight: 700, color: "#FA0050",
      lineHeight: "14px", whiteSpace: "nowrap",
      textAlign: "center", overflow: "hidden", textOverflow: "ellipsis",
    }}>{label}</span>
  );
}

const BADGE_SIZES = {
  small: { height: 18, fontSize: 10, lineHeight: 14, iconSize: 12, px: 4, labelPx: 0, gap: 2, radius: metaTokens.radius.meta_r1 },
  medium: { height: 22, fontSize: 12, lineHeight: 16, iconSize: 16, px: 4, labelPx: 0, gap: 2, radius: metaTokens.radius.meta_r1 },
};

const BADGE_COLORS = {
  primary:   { text: "#FA0050", iconColor: "#FA0050" },
  secondary: { text: "#0C74E4", iconColor: "#0C74E4" },
  gray:      { text: "#666666", iconColor: "#666666" },
  dimmed:    { text: "#999999", iconColor: "#999999" },
};

// ── SingleBadge ──────────────────────────────────────────────────────────────
export function SingleBadge({
  text = "배지",
  colorStyle = "primary",
  size = "small",
  showLeftIcon = false,
  showRightIcon = false,
  leftIconName = "benefit",
  rightIconName = "task",
}) {
  const s = BADGE_SIZES[size];
  const c = BADGE_COLORS[colorStyle] || BADGE_COLORS.primary;

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: s.gap,
      height: s.height, padding: `0 ${s.px}px`, borderRadius: s.radius,
      background: "#fff", border: "1px solid #E5E5E5",
      overflow: "hidden", whiteSpace: "nowrap",
      fontFamily: "Pretendard, Roboto, sans-serif",
    }}>
      {showLeftIcon && <YdsIcon name={leftIconName} size={s.iconSize} color={c.iconColor} />}
      <span style={{ fontSize: s.fontSize, fontWeight: 700, lineHeight: `${s.lineHeight}px`, color: c.text, padding: `0 ${s.labelPx}px` }}>{text}</span>
      {showRightIcon && <YdsIcon name={rightIconName} size={s.iconSize} color={c.iconColor} />}
    </span>
  );
}

// ── GroupBadge ────────────────────────────────────────────────────────────────
export function GroupBadge({
  items = [{ text: "배지1" }, { text: "배지2" }],
  colorStyle = "primary",
  size = "small",
}) {
  return (
    <span style={{ display: "inline-flex", gap: 8, flexWrap: "wrap" }}>
      {items.map((item, i) => (
        <SingleBadge key={i} text={item.text} colorStyle={item.colorStyle || colorStyle} size={size}
          showLeftIcon={item.showLeftIcon} showRightIcon={item.showRightIcon}
          leftIconName={item.leftIconName} rightIconName={item.rightIconName} />
      ))}
    </span>
  );
}

// ── NotiBadge ────────────────────────────────────────────────────────────────
export function NotiBadge({ shapeStyle = "dot", value = null }) {
  if (shapeStyle === "dot") {
    return <span style={{ width: 6, height: 6, borderRadius: 360, background: "#FA0050", display: "inline-block" }} />;
  }
  const isFilled = shapeStyle === "filled";
  return (
    <span style={{
      minWidth: 16, height: 16, borderRadius: 360,
      background: isFilled ? "#FA0050" : "#fff",
      border: isFilled ? "none" : "1px solid #FA0050",
      color: isFilled ? "#fff" : "#FA0050",
      fontSize: 10, fontWeight: 700,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      padding: value ? "0 4px" : 0,
      fontFamily: "Pretendard, Roboto, sans-serif",
    }}>{value}</span>
  );
}

// ── LogoBadge ────────────────────────────────────────────────────────────────
export function LogoBadge({ src, size = 88, alt = "logo" }) {
  return (
    <span style={{
      display: "inline-flex", width: size, height: size, borderRadius: metaTokens.radius.meta_r3,
      overflow: "hidden", background: "#f6f6f6", alignItems: "center", justifyContent: "center",
      position: "relative",
    }}>
      {src ? <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> :
        <span style={{ fontSize: size * 0.25, color: "#ccc", fontFamily: "Pretendard, sans-serif" }}>Logo</span>}
      <span style={{ position: "absolute", inset: 0, borderRadius: "inherit", border: `1px solid ${metaTokens.colors.alpha.a_black50}`, pointerEvents: "none" }} />
    </span>
  );
}

// ── IconBadge ────────────────────────────────────────────────────────────────
export function IconBadge({ iconName = "information", size = 24, bg = "#F2F2F2" }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: size, height: size, borderRadius: size / 2, background: bg,
    }}>
      <YdsIcon name={iconName} size={size * 0.6} color="#666" />
    </span>
  );
}

// ── Badge Section (Storybook 표시용) ─────────────────────────────────────────
export default function BadgeSection({ previewWidth }) {
  const [selectedSize, setSelectedSize] = useState("small");
  const [selectedColor, setSelectedColor] = useState("primary");

  return (
    <div style={{ padding: "24px 0" }}>
      {/* Controls */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#999", marginRight: 4 }}>Size:</span>
          {["small", "medium"].map(s => (
            <button key={s} onClick={() => setSelectedSize(s)}
              style={{ padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${selectedSize === s ? "#0C74E4" : "#e0e0e0"}`,
                background: selectedSize === s ? "#0C74E4" : "#fff", color: selectedSize === s ? "#fff" : "#666",
                fontSize: 11, cursor: "pointer" }}>{s}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#999", marginRight: 4 }}>Color:</span>
          {Object.keys(BADGE_COLORS).map(c => (
            <button key={c} onClick={() => setSelectedColor(c)}
              style={{ padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${selectedColor === c ? "#0C74E4" : "#e0e0e0"}`,
                background: selectedColor === c ? "#0C74E4" : "#fff", color: selectedColor === c ? "#fff" : "#666",
                fontSize: 11, cursor: "pointer" }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Preview area */}
      <div style={{ width: previewWidth > 0 ? previewWidth : "100%", margin: previewWidth > 0 ? "0 auto" : 0 }}>

      {/* singleBadge */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 8 }}>singleBadge</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <SingleBadge text="배지" colorStyle={selectedColor} size={selectedSize} />
          <SingleBadge text="배달앱 최저가" colorStyle={selectedColor} size={selectedSize} showLeftIcon leftIconName="benefit" />
          <SingleBadge text="스페셜 적립" colorStyle={selectedColor} size={selectedSize} showLeftIcon leftIconName="point" />
          <SingleBadge text="Right Icon" colorStyle={selectedColor} size={selectedSize} showRightIcon rightIconName="task" />
          <SingleBadge text="Both" colorStyle={selectedColor} size={selectedSize} showLeftIcon showRightIcon />
        </div>
      </div>

      {/* groupBadge */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 8 }}>groupBadge</div>
        <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
          <GroupBadge items={[{ text: "무료배달", showLeftIcon: true, leftIconName: "benefit" }, { text: "최대 5% 적립", showLeftIcon: true, leftIconName: "point" }]} colorStyle={selectedColor} size={selectedSize} />
          <GroupBadge items={[{ text: "배지1" }, { text: "배지2" }, { text: "배지3" }]} colorStyle={selectedColor} size={selectedSize} />
        </div>
      </div>

      {/* notiBadge */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 8 }}>notiBadge</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#666" }}>dot:</span> <NotiBadge shapeStyle="dot" />
          <span style={{ fontSize: 11, color: "#666" }}>outlined:</span> <NotiBadge shapeStyle="outlined" value="3" />
          <span style={{ fontSize: 11, color: "#666" }}>filled:</span> <NotiBadge shapeStyle="filled" value="99+" />
        </div>
      </div>


      {/* benefitBadge (혜택뱃지) */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 8 }}>benefitBadge (혜택뱃지)</div>
        <div style={{ fontSize: 11, color: "#999", marginBottom: 8 }}>흰 bg + #e5 보더 + shadow level_1 + r9 · 10b primary · maxWidth 70</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <BenefitBadge label="3,000원 할인" />
          <BenefitBadge label="7% 할인" />
          <BenefitBadge label="15,000원 할인" />
          <BenefitBadge label="최대 7,000원" />
          <BenefitBadge label="5% 할인" />
        </div>
      </div>

      {/* adBadge */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 8 }}>adBadge (광고 뱃지)</div>
        <div style={{ fontSize: 11, color: "#999", marginBottom: 8 }}>이미지 기반 전역 단일 소스 · Tag_AD.png 교체 시 전체 반영</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <AdBadge />
          <span style={{ fontSize: 11, color: "#ccc" }}>← Tag_AD.png</span>
        </div>
      </div>

      {/* starIcon (별점) */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 8 }}>starIcon (리뷰 별점)</div>
        <div style={{ fontSize: 11, color: "#999", marginBottom: 8 }}>이미지 기반 전역 단일 소스 · ic_item_star.svg 교체 시 전체 반영 · #FFCB2E</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <img src="/assets/badge-icons/ic_item_star.svg" alt="★" style={{ width: 12, height: 12 }} />
          <img src="/assets/badge-icons/ic_item_star.svg" alt="★" style={{ width: 16, height: 16 }} />
          <img src="/assets/badge-icons/ic_item_star.svg" alt="★" style={{ width: 24, height: 24 }} />
          <span style={{ fontSize: 11, color: "#ccc" }}>← ic_item_star.svg</span>
        </div>
      </div>

      </div>
    </div>
  );
}
