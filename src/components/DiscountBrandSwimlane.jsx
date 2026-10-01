import { useState, useRef, useCallback, useEffect } from "react";
import { metaTokens } from "../tokens";
import { YdsIcon } from "../icons.jsx";
import { SingleBadge } from "./Badge.jsx";
import { getShopLogo } from "../shopLogos";

// ─── YDS 2.0 DiscountBrandSwimlane (리뉴얼-2026) ──────────────────────────
// 3아이템 × 1컬럼 = 1페이지, 스와이프 캐러셀
// width: stretch(디바이스-60), min 260 / max 316

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
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, height: 18 }}>
          <span style={{
            fontSize: 12, fontWeight: 400, color: "#333",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{shopName}</span>
          {badges.map((badgeKey, i) => {
            const preset = BRAND_BADGE_PRESETS[badgeKey];
            if (!preset) return null;
            return <SingleBadge key={i} text={preset.text} colorStyle={preset.colorStyle} size="small" showLeftIcon={preset.showLeftIcon} leftIconName={preset.leftIconName} />;
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
  onMoreClick,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef(null);
  const totalPages = Math.ceil(brands.length / itemsPerPage);

  // 페이지 데이터
  const pages = [];
  for (let i = 0; i < brands.length; i += itemsPerPage) {
    pages.push(brands.slice(i, i + itemsPerPage));
  }

  // 스크롤 → 현재 페이지 감지
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !el.children[0]) return;
    const pageW = el.children[0].offsetWidth;
    const gap = 12;
    const idx = Math.round(el.scrollLeft / (pageW + gap));
    setCurrentPage(Math.min(idx, totalPages - 1));
  }, [totalPages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el?.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // dot 클릭 → 해당 페이지로 스크롤
  const goToPage = (idx) => {
    const el = scrollRef.current;
    if (!el || !el.children[idx]) return;
    el.children[idx].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  return (
    <div style={{ fontFamily: "Pretendard, Roboto, sans-serif" }}>
      {/* Section header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 0 8px",
      }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#333" }}>{title}</span>
        <button onClick={onMoreClick} style={{
          display: "flex", alignItems: "center",
          background: "none", border: "none", cursor: "pointer", padding: 0,
        }}>
          <YdsIcon name="chevron_right_s" size={20} color="#999" />
        </button>
      </div>

      {/* 캐러셀 — 스와이프 가능 */}
      <div ref={scrollRef} style={{
        display: "flex", gap: 12,
        overflowX: "auto", scrollSnapType: "x mandatory",
        scrollbarWidth: "none", WebkitOverflowScrolling: "touch",
      }}>
        {pages.map((pageItems, pi) => (
          <div key={pi} style={{
            width: "calc(100%)", minWidth: 260, maxWidth: 316,
            flexShrink: 0, scrollSnapAlign: "start",
            display: "flex", flexDirection: "column",
          }}>
            {pageItems.map((brand, i) => (
              <BrandCard key={`${pi}-${i}`} {...brand} />
            ))}
          </div>
        ))}
      </div>

      {/* Page indicator dots */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => goToPage(i)} style={{
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
      {/* Full carousel */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8 }}>Preview</div>
        <div style={{
          width: "calc(100% - 60px)", minWidth: 260, maxWidth: 316,
          background: "#fff", borderRadius: 12, padding: 16,
          border: "1px solid #e8e8e8",
        }}>
          <DiscountBrandSwimlane brands={SAMPLE_BRANDS} />
        </div>
      </div>

      {/* Individual BrandCard */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8 }}>BrandCard variants</div>
        <div style={{ width: "100%", maxWidth: 316, background: "#fff", borderRadius: 12, padding: "8px 16px", border: "1px solid #e8e8e8" }}>
          <BrandCard shopName="교촌치킨" logoSrc={getShopLogo("kyochon")} benefit="최대 3,000원 할인" badges={["lowest"]} />
          <BrandCard shopName="BBQ 치킨" logoSrc={getShopLogo("bbq")} benefit="2,000원 즉시할인" badges={["specialpoint"]} />
          <BrandCard shopName="청년피자" logoSrc={getShopLogo("youngman")} benefit="최대 5,000원 할인 + 최대 15% 적립" badges={["lowest", "specialpoint", "menu_discount"]} />
        </div>
      </div>
    </div>
  );
}
