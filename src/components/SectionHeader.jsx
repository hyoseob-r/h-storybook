import { YdsIcon } from "../icons.jsx";

// ─── YDS 2.0 SectionHeader (리뉴얼-2026) ───────────────────────────────────
// Figma: SectionHeader_p04 (node 9078:189565)
// paddingTop 20, paddingLeft 16, paddingRight 12
// title: 20b (title_4) lineHeight 27, color #333
// leftIcon: 옵션 (24x24 이미지)
// rightIcon: 옵션 (chevron_right_s 24px)

export function SectionHeader({
  title = "고객님 추천",
  leftIcon = null,    // 이미지 src 또는 null
  showArrow = true,   // 우측 chevron 화살표
  onClick,
}) {
  return (
    <div style={{
      paddingTop: 20,
      paddingLeft: 16,
      paddingRight: 12,
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "Pretendard, Roboto, sans-serif",
    }}>
      {/* Left — 아이콘 + 타이틀 */}
      <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
        {leftIcon && (
          <img src={leftIcon} alt="" style={{ width: 24, height: 24, flexShrink: 0 }} />
        )}
        <span style={{
          fontSize: 20, fontWeight: 700, lineHeight: "27px",
          color: "#333",
        }}>{title}</span>
      </div>

      {/* Spacer — 우측 끝 정렬 */}
      <div style={{ flex: 1 }} />

      {/* Right — chevron 화살표 (항상 우측 끝) */}
      {showArrow && (
        <div
          onClick={onClick}
          style={{ width: 24, height: 24, flexShrink: 0, cursor: onClick ? "pointer" : "default" }}
        >
          <YdsIcon name="chevron_right_s" size={24} color="#333" />
        </div>
      )}
    </div>
  );
}

// ── Section (Storybook) ─────────────────────────────────────────────────────
export default function SectionHeaderSection() {
  return (
    <div style={{ padding: "24px 0" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8 }}>Preview</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* 기본 */}
        <div style={{ background: "#fff" }}>
          <SectionHeader title="고객님 맞춤 추천 가게" />
        </div>

        {/* 화살표 없음 */}
        <div style={{ background: "#fff" }}>
          <SectionHeader title="내 주변 할인중인 브랜드" showArrow={false} />
        </div>

        {/* 긴 타이틀 */}
        <div style={{ background: "#fff" }}>
          <SectionHeader title="이 가게 어때요? 새로운 맛집을 찾아보세요" />
        </div>
      </div>
    </div>
  );
}
