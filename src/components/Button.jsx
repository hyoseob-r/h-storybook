import { metaTokens } from "../tokens";
import { YdsIcon } from "../icons.jsx";

// ─── YDS 2.0 Button Component (재사용 가능) ─────────────────────────────────
// Figma: 📌 Customer-Component > Button
// 모든 버튼은 이 컴포넌트를 기반으로 구성

const SIZE_MAP = {
  medium: { height: 48, px: 16, fontSize: 14, iconSize: 16, radius: metaTokens.radius.meta_r3 },
  small:  { height: 36, px: 12, fontSize: 12, iconSize: 14, radius: metaTokens.radius.meta_r2 },
};

const SHAPE_COLOR_MAP = {
  filled: {
    primary_v2:  { bg: "#FA0050", fg: "#fff", border: "none" },
    gray_v2:     { bg: "#333333", fg: "#fff", border: "none" },
    gray250_v2:  { bg: "#BFBFBF", fg: "#333", border: "none" },
  },
  outlined: {
    primary_v2:  { bg: "transparent", fg: "#FA0050", border: "1px solid #FA0050" },
    gray_v2:     { bg: "transparent", fg: "#333333", border: "1px solid #333333" },
  },
  text: {
    primary_v2:  { bg: "transparent", fg: "#FA0050", border: "none" },
    gray_v2:     { bg: "transparent", fg: "#333333", border: "none" },
  },
};

export function Button({
  label = "버튼",
  shapeStyle = "filled",
  colorStyle = "primary_v2",
  size = "medium",
  leftIcon = null,
  rightIcon = null,
  disabled = false,
  fullWidth = false,
  onClick,
  children,
  style: customStyle,
}) {
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const colors = SHAPE_COLOR_MAP[shapeStyle]?.[colorStyle] || SHAPE_COLOR_MAP.filled.primary_v2;

  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 4,
      height: s.height, padding: `0 ${s.px}px`, borderRadius: s.radius,
      background: colors.bg, color: colors.fg, border: colors.border,
      fontSize: s.fontSize, fontWeight: 700, fontFamily: "Pretendard, Roboto, sans-serif",
      cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.35 : 1,
      width: fullWidth ? "100%" : undefined, flex: fullWidth ? 1 : undefined,
      whiteSpace: "nowrap", position: "relative",
      ...customStyle,
    }}>
      {leftIcon && (typeof leftIcon === "string" ? <YdsIcon name={leftIcon} size={s.iconSize} color={colors.fg} /> : leftIcon)}
      {children || label}
      {rightIcon && (typeof rightIcon === "string" ? <YdsIcon name={rightIcon} size={s.iconSize} color={colors.fg} /> : rightIcon)}
    </button>
  );
}

// ── PriceButton (Button의 variant) ───────────────────────────────────────────
export function PriceButton({
  label = "버튼",
  strikePrice = null,
  countBadge = null,
  disabled = false,
  fullWidth = true,
  onClick,
}) {
  return (
    <Button
      shapeStyle="filled"
      colorStyle="primary_v2"
      size="medium"
      disabled={disabled}
      fullWidth={fullWidth}
      onClick={onClick}
    >
      {strikePrice && (
        <span style={{ fontSize: 12, textDecoration: "line-through", opacity: 0.8, marginRight: 2 }}>{strikePrice}원</span>
      )}
      <span>{label}</span>
      {countBadge != null && (
        <span style={{
          minWidth: 20, height: 20, borderRadius: 360, background: "#fff", color: "#FA0050",
          fontSize: 14, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center",
          padding: "0 4px", border: "1px solid #FA0050", marginLeft: 4,
        }}>{countBadge}</span>
      )}
    </Button>
  );
}

export default Button;
