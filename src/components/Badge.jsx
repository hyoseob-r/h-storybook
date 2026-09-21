import { useState } from "react";
import { metaTokens } from "../tokens";
import { YdsIcon } from "../icons.jsx";

// ─── YDS 2.0 Badge Component (리뉴얼-2026 기준) ─────────────────────────────
// Figma: 📌 Customer-Component > Badge
// 스타일: 흰색 bg + gray100 보더 + outlined 스타일 (이전 filled 스타일에서 변경됨)

const BADGE_SIZES = {
  small: { height: 18, fontSize: 10, lineHeight: 14, iconSize: 12, px: 4, gap: 2, radius: metaTokens.radius.meta_r1 },
  medium: { height: 22, fontSize: 12, lineHeight: 16, iconSize: 16, px: 6, gap: 2, radius: metaTokens.radius.meta_r1 },
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
  leftIconName = "check_s",
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
      <span style={{ fontSize: s.fontSize, fontWeight: 700, lineHeight: `${s.lineHeight}px`, color: c.text }}>{text}</span>
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

// ── OffersBadge ──────────────────────────────────────────────────────────────
export function OffersBadge({
  text = "할인",
  size = "small",
  showLeftIcon = false,
  showRightIcon = false,
  leftIconName = "coupon",
  rightIconName = "chevron_right_s",
}) {
  const s = BADGE_SIZES[size];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: s.gap,
      height: s.height, padding: `0 ${s.px}px`, borderRadius: s.radius,
      background: "#FA0050", border: "none", overflow: "hidden", whiteSpace: "nowrap",
      fontFamily: "Pretendard, Roboto, sans-serif",
    }}>
      {showLeftIcon && <YdsIcon name={leftIconName} size={s.iconSize} color="#fff" />}
      <span style={{ fontSize: s.fontSize, fontWeight: 700, lineHeight: `${s.lineHeight}px`, color: "#fff" }}>{text}</span>
      {showRightIcon && <YdsIcon name={rightIconName} size={s.iconSize} color="#fff" />}
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
      border: "1px solid rgba(0,0,0,0.08)",
    }}>
      {src ? <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> :
        <span style={{ fontSize: size * 0.25, color: "#ccc", fontFamily: "Pretendard, sans-serif" }}>Logo</span>}
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
export default function BadgeSection() {
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

      {/* singleBadge */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 8 }}>singleBadge</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <SingleBadge text="배지" colorStyle={selectedColor} size={selectedSize} />
          <SingleBadge text="배달앱 최저가" colorStyle={selectedColor} size={selectedSize} showLeftIcon leftIconName="check_s" />
          <SingleBadge text="스페셜 적립" colorStyle={selectedColor} size={selectedSize} showLeftIcon leftIconName="check_s" />
          <SingleBadge text="Right Icon" colorStyle={selectedColor} size={selectedSize} showRightIcon rightIconName="task" />
          <SingleBadge text="Both" colorStyle={selectedColor} size={selectedSize} showLeftIcon showRightIcon />
        </div>
      </div>

      {/* groupBadge */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 8 }}>groupBadge</div>
        <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
          <GroupBadge items={[{ text: "무료배달", showLeftIcon: true, leftIconName: "check_s" }, { text: "최대 5% 적립" }]} colorStyle={selectedColor} size={selectedSize} />
          <GroupBadge items={[{ text: "배지1" }, { text: "배지2" }, { text: "배지3" }]} colorStyle={selectedColor} size={selectedSize} />
        </div>
      </div>

      {/* offersBadge */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 8 }}>offersBadge</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <OffersBadge text="1,000원 할인" size={selectedSize} />
          <OffersBadge text="최대 50% 할인" size={selectedSize} showLeftIcon leftIconName="coupon" />
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

      {/* logoBadge */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 8 }}>logoBadge</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <LogoBadge size={44} />
          <LogoBadge size={64} />
          <LogoBadge size={88} />
        </div>
      </div>

      {/* iconBadge */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 8 }}>iconBadge</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <IconBadge iconName="information" size={24} />
          <IconBadge iconName="heart" size={32} />
          <IconBadge iconName="gift" size={40} bg="#FFE6EE" />
        </div>
      </div>
    </div>
  );
}
