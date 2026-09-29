import { useState } from "react";
import { metaTokens } from "../tokens";
import { YdsIcon } from "../icons.jsx";
import { SingleBadge, LogoBadge } from "./Badge.jsx";
import { getShopLogo } from "../shopLogos";

// ─── YDS 2.0 DiscountBrandSwimlane Component (리뉴얼-2026) ─────────────────
// Figma: 리뉴얼-2026 > multi_swimlane_2
// SectionHeader + 3페이지 × 3아이템, 가로 스크롤, 인디케이터 dots
// 뱃지: 배달앱최저가(ic_lowest, primary), 스페셜적립(ic_specialpoint, primary),
//       메뉴할인(ic_bpr, gray), 추천(gray, 아이콘 없음)
// ※ "요기패스X" 뱃지는 이 영역에서 사용 불가

const BRAND_BADGE_PRESETS = {
  lowest:       { text: "배달앱 최저가", colorStyle: "primary", showLeftIcon: true, leftIconName: "ic_lowest" },
  specialpoint: { text: "스페셜적립", colorStyle: "primary", showLeftIcon: true, leftIconName: "ic_specialpoint" },
  menu_discount:{ text: "메뉴할인", colorStyle: "gray", showLeftIcon: true, leftIconName: "ic_bpr" },
  recommend:    { text: "추천", colorStyle: "gray", showLeftIcon: false },
};

export function BrandCard({
  logoSrc = null,
  shopName = "교촌치킨",
  badges = [],
  benefit = "최대 3,000원 할인",
  onClick,
}) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "12px 0", background: "none", border: "none",
      cursor: "pointer", width: "100%", textAlign: "left",
      fontFamily: "Pretendard, Roboto, sans-serif",
    }}>
      {/* Logo */}
      <div style={{
        width: 48, height: 48, borderRadius: metaTokens.radius.meta_r4,
        overflow: "hidden", background: "#fff", flexShrink: 0,
        position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {logoSrc ? (
          <img src={logoSrc} alt={shopName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 12, color: "#ccc" }}>Logo</span>
        )}
        <span style={{ position: "absolute", inset: 0, borderRadius: "inherit", border: `1px solid ${metaTokens.colors.alpha.a_black50}`, pointerEvents: "none" }} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, height: 18 }}>
          <span style={{
            fontSize: 12, fontWeight: 400, color: "#333",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{shopName}</span>
          {badges.map((badgeKey, i) => {
            const preset = BRAND_BADGE_PRESETS[badgeKey];
            if (!preset) return null;
            return (
              <SingleBadge
                key={i}
                text={preset.text}
                colorStyle={preset.colorStyle}
                size="small"
                showLeftIcon={preset.showLeftIcon}
                leftIconName={preset.leftIconName}
              />
            );
          })}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#333" }}>{benefit}</div>
      </div>
    </button>
  );
}

export function DiscountBrandSwimlane({
  title = "내 주변 할인중인 브랜드",
  brands = [],
  itemsPerPage = 3,
  autoTransition = true,
  onMoreClick,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(brands.length / itemsPerPage);
  const pageItems = brands.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div style={{ fontFamily: "Pretendard, Roboto, sans-serif" }}>
      {/* Section header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 0 8px",
      }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#333" }}>{title}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {autoTransition && (
            <button style={{
              width: 28, height: 28, borderRadius: 14,
              background: "#f2f2f2", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 12 }}>⏸</span>
            </button>
          )}
          <button onClick={onMoreClick} style={{
            display: "flex", alignItems: "center", gap: 2,
            background: "none", border: "none", cursor: "pointer", padding: 0,
          }}>
            <YdsIcon name="chevron_right_s" size={20} color="#999" />
          </button>
        </div>
      </div>

      {/* Brand list (current page) */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {pageItems.map((brand, i) => (
          <BrandCard key={`${currentPage}-${i}`} {...brand} />
        ))}
      </div>

      {/* Page indicator dots */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i)} style={{
              width: currentPage === i ? 16 : 6, height: 6,
              borderRadius: 3,
              background: currentPage === i ? "#333" : "#ddd",
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
const SAMPLE_BRANDS = [
  { shopName: "교촌치킨", logoSrc: getShopLogo("kyochon"), benefit: "최대 3,000원 할인", badges: ["lowest"] },
  { shopName: "BBQ", logoSrc: getShopLogo("bbq"), benefit: "2,000원 즉시할인" },
  { shopName: "BHC", logoSrc: getShopLogo("bhc"), benefit: "무료배달 + 적립 5%", badges: ["specialpoint"] },
  { shopName: "피자헛", logoSrc: getShopLogo("pizzahut"), benefit: "라지 피자 50% 할인", badges: ["menu_discount"] },
  { shopName: "도미노피자", logoSrc: getShopLogo("domino"), benefit: "1+1 이벤트", badges: ["recommend"] },
  { shopName: "서브웨이", logoSrc: getShopLogo("subway"), benefit: "최대 5,000원 할인 + 최대 15% 적립", badges: ["lowest", "specialpoint"] },
  { shopName: "맘스터치", logoSrc: getShopLogo("moms"), benefit: "무료배달", badges: ["menu_discount"] },
  { shopName: "맥도날드", logoSrc: getShopLogo("mcdonalds"), benefit: "배달비 0원" },
  { shopName: "청년피자", logoSrc: getShopLogo("youngman"), benefit: "최대 5,000원 할인 + 최대 15% 적립", badges: ["lowest", "specialpoint", "menu_discount"] },
];

export default function DiscountBrandSwimlaneSection() {
  return (
    <div style={{ padding: "24px 0" }}>
      {/* Full component */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 12 }}>DiscountBrandSwimlane (3 pages)</div>
        <div style={{ width: 375, background: "#fff", borderRadius: 12, padding: 16 }}>
          <DiscountBrandSwimlane brands={SAMPLE_BRANDS} />
        </div>
      </div>

      {/* Individual BrandCard */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 12 }}>BrandCard variants</div>
        <div style={{ width: 375, background: "#fff", borderRadius: 12, padding: "8px 16px" }}>
          <BrandCard shopName="교촌치킨" logoSrc={getShopLogo("kyochon")} benefit="최대 3,000원 할인" badges={["lowest"]} />
          <BrandCard shopName="BBQ 치킨" logoSrc={getShopLogo("bbq")} benefit="2,000원 즉시할인" badges={["specialpoint"]} />
          <BrandCard shopName="청년피자" logoSrc={getShopLogo("youngman")} benefit="최대 5,000원 할인 + 최대 15% 적립" badges={["lowest", "specialpoint", "menu_discount"]} />
        </div>
      </div>

      {/* Without auto transition */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 12 }}>Without auto transition</div>
        <div style={{ width: 375, background: "#fff", borderRadius: 12, padding: 16 }}>
          <DiscountBrandSwimlane
            title="지금 핫한 브랜드"
            brands={SAMPLE_BRANDS.slice(0, 6)}
            autoTransition={false}
          />
        </div>
      </div>
    </div>
  );
}
