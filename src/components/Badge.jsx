import { useState } from "react";
import { colors, metaTokens } from "../tokens";

// ─── YDS 2.0 Badge Component ────────────────────────────────────────────────
// Figma: 📌 Customer-Component > Badge
// Types: singleBadge, groupBadge, offersBadge, notiBadge, logoBadge, iconBadge

const BADGE_SIZES = {
  small: { height: 20, fontSize: 10, lineHeight: 14, iconSize: 12, px: 6, gap: 2, radius: 4 },
  medium: { height: 24, fontSize: 12, lineHeight: 16, iconSize: 16, px: 8, gap: 4, radius: 4 },
};

const BADGE_COLORS = {
  primary: { bg: "#FFE6EE", text: "#FA0050", border: "transparent" },
  secondary: { bg: "#E7F2FE", text: "#0C74E4", border: "transparent" },
  gray: { bg: "#F2F2F2", text: "#666666", border: "transparent" },
  dimmed: { bg: "#F6F6F6", text: "#999999", border: "transparent" },
  disabled: { bg: "#F2F2F2", text: "#CCCCCC", border: "transparent" },
};

const OFFERS_COLORS = {
  bg: "#FA0050",
  text: "#FFFFFF",
};

const NOTI_STYLES = {
  outlined: (val) => ({
    minWidth: 16, height: 16, borderRadius: 360, border: "1px solid #FA0050",
    background: "#fff", color: "#FA0050", fontSize: 10, fontWeight: 700,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    padding: val ? "0 4px" : 0,
  }),
  filled: (val) => ({
    minWidth: 16, height: 16, borderRadius: 360,
    background: "#FA0050", color: "#fff", fontSize: 10, fontWeight: 700,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    padding: val ? "0 4px" : 0,
  }),
  dot: () => ({
    width: 6, height: 6, borderRadius: 360,
    background: "#FA0050", display: "inline-block",
  }),
};

// ── SingleBadge ──────────────────────────────────────────────────────────────
export function SingleBadge({
  text = "Badge",
  colorStyle = "secondary",
  size = "small",
  showLeftIcon = false,
  showRightIcon = false,
  leftIcon = null,
  rightIcon = null,
}) {
  const s = BADGE_SIZES[size];
  const c = BADGE_COLORS[colorStyle] || BADGE_COLORS.secondary;

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: s.gap,
      height: s.height, padding: `0 ${s.px}px`, borderRadius: s.radius,
      background: c.bg, color: c.text, fontSize: s.fontSize, fontWeight: 700,
      lineHeight: `${s.lineHeight}px`, fontFamily: "Pretendard, Roboto, sans-serif",
      whiteSpace: "nowrap",
    }}>
      {showLeftIcon && (leftIcon || <DefaultIcon size={s.iconSize} color={c.text} />)}
      {text}
      {showRightIcon && (rightIcon || <DefaultIcon size={s.iconSize} color={c.text} />)}
    </span>
  );
}

// ── GroupBadge ────────────────────────────────────────────────────────────────
export function GroupBadge({
  items = [{ text: "배지1" }, { text: "배지2" }],
  colorStyle = "secondary",
  size = "small",
}) {
  return (
    <span style={{ display: "inline-flex", gap: BADGE_SIZES[size].gap + 4, flexWrap: "wrap" }}>
      {items.map((item, i) => (
        <SingleBadge key={i} text={item.text} colorStyle={item.colorStyle || colorStyle} size={size}
          showLeftIcon={item.showLeftIcon} showRightIcon={item.showRightIcon} />
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
}) {
  const s = BADGE_SIZES[size];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: s.gap,
      height: s.height, padding: `0 ${s.px}px`, borderRadius: s.radius,
      background: OFFERS_COLORS.bg, color: OFFERS_COLORS.text,
      fontSize: s.fontSize, fontWeight: 700, lineHeight: `${s.lineHeight}px`,
      fontFamily: "Pretendard, Roboto, sans-serif", whiteSpace: "nowrap",
    }}>
      {showLeftIcon && <DefaultIcon size={s.iconSize} color="#fff" />}
      {text}
      {showRightIcon && <DefaultIcon size={s.iconSize} color="#fff" />}
    </span>
  );
}

// ── NotiBadge ────────────────────────────────────────────────────────────────
export function NotiBadge({ shapeStyle = "dot", value = null }) {
  const style = NOTI_STYLES[shapeStyle](value);
  if (shapeStyle === "dot") return <span style={style} />;
  return <span style={style}>{value}</span>;
}

// ── LogoBadge ────────────────────────────────────────────────────────────────
export function LogoBadge({ src, size = 88, alt = "logo" }) {
  return (
    <span style={{
      display: "inline-flex", width: size, height: size, borderRadius: metaTokens.radius.meta_r3,
      overflow: "hidden", background: "#f6f6f6", alignItems: "center", justifyContent: "center",
    }}>
      {src ? <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> :
        <span style={{ fontSize: size * 0.3, color: "#ccc" }}>Logo</span>}
    </span>
  );
}

// ── IconBadge ────────────────────────────────────────────────────────────────
export function IconBadge({ icon = null, size = 24, bg = "#F2F2F2" }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: size, height: size, borderRadius: size / 2,
      background: bg,
    }}>
      {icon || <DefaultIcon size={size * 0.6} color="#666" />}
    </span>
  );
}

function DefaultIcon({ size = 12, color = "#666" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    </svg>
  );
}

// ── Badge Section (Storybook 표시용) ─────────────────────────────────────────
export default function BadgeSection() {
  const [selectedSize, setSelectedSize] = useState("small");
  const [selectedColor, setSelectedColor] = useState("secondary");

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
          <SingleBadge text="Label Only" colorStyle={selectedColor} size={selectedSize} />
          <SingleBadge text="Left Icon" colorStyle={selectedColor} size={selectedSize} showLeftIcon />
          <SingleBadge text="Right Icon" colorStyle={selectedColor} size={selectedSize} showRightIcon />
          <SingleBadge text="Both Icons" colorStyle={selectedColor} size={selectedSize} showLeftIcon showRightIcon />
        </div>
      </div>

      {/* groupBadge */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 8 }}>groupBadge</div>
        <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
          <GroupBadge items={[{ text: "무료배달" }, { text: "최대 5% 적립" }]} colorStyle={selectedColor} size={selectedSize} />
          <GroupBadge items={[{ text: "배지1" }, { text: "배지2" }, { text: "배지3" }]} colorStyle={selectedColor} size={selectedSize} />
          <GroupBadge items={[{ text: "A" }, { text: "B" }, { text: "C" }, { text: "D" }]} colorStyle={selectedColor} size={selectedSize} />
        </div>
      </div>

      {/* offersBadge */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 8 }}>offersBadge</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <OffersBadge text="1,000원 할인" size={selectedSize} />
          <OffersBadge text="최대 50% 할인" size={selectedSize} showLeftIcon />
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
          <IconBadge size={24} />
          <IconBadge size={32} />
          <IconBadge size={40} bg="#FFE6EE" />
        </div>
      </div>
    </div>
  );
}
