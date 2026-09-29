import { useState, useRef, useCallback } from "react";
import { metaTokens } from "../tokens";
import { YdsIcon } from "../icons.jsx";
import { SingleBadge, GroupBadge, LogoBadge } from "./Badge.jsx";
import { RatingCompact } from "./Rating.jsx";
import { getShopLogo } from "../shopLogos";
import { getMenusByShop, getShopImage, imageStyle } from "../shopImages";

// ─── YDS 2.0 ShopListCard Component (리뉴얼-2026 v2) ──────────────────────
// Figma: 리뉴얼-2026 > shoplist_p04
// 구조: 메뉴 썸네일 → 빨간 혜택배너 → 가게정보(36px 로고) → 하단 뱃지 lane

// ── 빨간 혜택 배너 (Red Benefit Banner) ─────────────────────────────────────
const BENEFIT_BANNER_PRESETS = {
  none: null,
  ypx_free_delivery: { items: ["무료배달", "즉시할인", "최대 15% 적립"] },
  store_free_delivery: { items: ["무료배달", "즉시할인", "최대 3% 적립"] },
  single_discount: { items: ["즉시할인"] },
  single_cashback: { items: ["최대 5% 적립"] },
  single_ypx_free: { items: ["무료배달"] },
  single_store_free: { items: ["가게무배"] },
};

function RedBenefitBanner({ items = [] }) {
  if (items.length === 0) return null;
  return (
    <div style={{
      display: "flex", gap: 2, alignItems: "center", justifyContent: "center",
      height: 20, padding: "4px 6px",
      background: "#FA0050", borderRadius: 12,
      overflow: "hidden", width: "100%", maxWidth: 300,
    }}>
      {items.map((text, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {i > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>+</span>}
          <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>{text}</span>
        </span>
      ))}
    </div>
  );
}

// ── 하단 뱃지 (Badge Wrap) ──────────────────────────────────────────────────
// Figma 기준: 혜택 관련 → secondary(파란색), 정보성 → gray
const DEFAULT_BOTTOM_BADGES = [
  { text: "배달앱 최저가", colorStyle: "gray", showLeftIcon: true, leftIconName: "ic_lowest" },
  { text: "스페셜적립", colorStyle: "gray", showLeftIcon: true, leftIconName: "ic_specialpoint" },
  { text: "한식 할인 1위", colorStyle: "gray", showLeftIcon: true, leftIconName: "ic_bpr" },
  { text: "1,000원 추가할인", colorStyle: "secondary" },
  { text: "카카오페이 쿠폰", colorStyle: "secondary" },
  { text: "위생안심", colorStyle: "gray" },
];

// ── 메뉴 썸네일 가로 스크롤 + auto_transition 버튼 ──────────────────────────
// 스크롤 끝에 도달하면 > 버튼이 28→48px로 커짐 (당겨서 새로고침 UX)
function MenuThumbnailRow({ shopId, onTransition }) {
  const menus = getMenusByShop(shopId);
  const scrollRef = useRef(null);
  const [btnScale, setBtnScale] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const overscroll = el.scrollLeft + el.clientWidth - el.scrollWidth;
    const progress = Math.min(1, Math.max(0, overscroll / 60));
    setBtnScale(progress);
  }, []);

  if (!menus || menus.length === 0) return null;

  const btnSize = 28 + btnScale * 20; // 28→48
  const btnRadius = 10 + btnScale * 6; // 10→16
  const iconSize = 16 + btnScale * 16; // 16→32
  const btnBorder = 1.3 + btnScale * 1.3; // 1.3→2.6

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, position: "relative" }}>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          display: "flex", gap: 8, overflowX: "auto",
          flex: 1, scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          paddingRight: 56,
        }}
      >
        {menus.map((menu) => (
          <div key={menu.id} style={{
            position: "relative", flexShrink: 0,
            width: 148, height: 148,
            borderRadius: 12, overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.04)",
          }}>
            <img src={menu.url} alt={menu.label || menu.id}
              style={{ ...imageStyle(148, 148, 0), display: "block" }} />
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0,
              padding: "8px 8px 12px",
              background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.35) 59%, transparent 100%)",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", lineHeight: "16px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {menu.label || `메뉴 ${menu.seq}`}
              </div>
              <div style={{ fontSize: 12, fontWeight: 400, color: "#fff", lineHeight: "16px" }}>
                11,000원
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* auto_transition 버튼 — 스크롤 끝에서 scale up */}
      <div style={{
        position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        width: btnSize, height: btnSize,
        borderRadius: btnRadius,
        background: "#f6f6f6",
        border: `${btnBorder}px solid #e5e5e5`,
        cursor: "pointer",
        transition: "all 0.15s ease-out",
        zIndex: 2,
      }} onClick={onTransition}>
        <YdsIcon name="chevron_right_s" size={iconSize} color="#999" />
      </div>
    </div>
  );
}

const SUBSCRIPTION_LABELS = {
  none: null,
  ypx_sub: { text: "요기패스X", colorStyle: "primary" },
  ypx_nonsub: { text: "요기패스X 가입하면", colorStyle: "dimmed" },
};

export function ShopListCard({
  shopName = "맛있는 분식집",
  logoSrc = null,
  shopId = null,
  rating = 4.8,
  reviewCount = 1234,
  deliveryTime = "30~45분",
  deliveryFee = "1,900~2,900원",
  distance = "1.2km",
  minOrder = "12,000원",
  benefitType = "ypx_free_delivery",
  subscriptionType = "none",
  bottomBadges = null,
  showMenuThumbnails = true,
  isAd = false,
}) {
  const banner = BENEFIT_BANNER_PRESETS[benefitType];
  const badges = bottomBadges || DEFAULT_BOTTOM_BADGES;
  const subLabel = SUBSCRIPTION_LABELS[subscriptionType];

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 6,
      padding: "16px 0",
      borderBottom: "1px solid #F2F2F2",
      fontFamily: "Pretendard, Roboto, sans-serif",
    }}>
      {/* 메뉴 썸네일 + 빨간 혜택 배너 */}
      {showMenuThumbnails && shopId && (
        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", alignItems: "start" }}>
          <MenuThumbnailRow shopId={shopId} />
          {banner && (
            <div style={{ marginTop: -10, paddingLeft: 4, position: "relative", zIndex: 1, width: "100%" }}>
              <RedBenefitBanner items={banner.items} />
            </div>
          )}
        </div>
      )}

      {/* 가게 정보 */}
      <div style={{ display: "flex", gap: 6, padding: "0 16px", alignItems: "flex-start" }}>
        {/* Logo — 36px (신규) */}
        <div style={{ flexShrink: 0, position: "relative" }}>
          <LogoBadge src={logoSrc} size={44} />
          {isAd && (
            <span style={{
              position: "absolute", top: -4, right: -4,
              fontSize: 9, color: "#fff", background: "rgba(0,0,0,0.12)",
              padding: "2px 5px", borderRadius: 100, lineHeight: 1,
            }}>AD</span>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {/* 가게명 + 별점 */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{
                fontSize: 18, fontWeight: 700, color: "#333", lineHeight: "24px",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>{shopName}</span>
              <RatingCompact grade={rating} total={reviewCount} size="small" />
              {isAd && (
                <span style={{
                  fontSize: 9, color: "#fff", background: "rgba(0,0,0,0.12)",
                  padding: "3px 5px 2px", borderRadius: 100, lineHeight: 1, flexShrink: 0,
                }}>AD</span>
              )}
            </div>

            {/* 배달비 */}
            <div style={{ fontSize: 12, color: "#333", display: "flex", gap: 2 }}>
              <span>배달비</span>
              <span>{deliveryFee}</span>
            </div>

            {/* 배달시간 · 거리 · 최소주문 */}
            <div style={{ fontSize: 12, color: "#666", display: "flex", gap: 4, alignItems: "center" }}>
              <span>{deliveryTime}</span>
              <span style={{ width: 3, height: 3, borderRadius: 1.5, background: "#ccc", display: "inline-block" }} />
              <span>{distance}</span>
              {minOrder && (
                <>
                  <span style={{ width: 3, height: 3, borderRadius: 1.5, background: "#ccc", display: "inline-block" }} />
                  <span>최소주문 {minOrder}</span>
                </>
              )}
            </div>
          </div>

          {/* 하단 뱃지 lane — 혜택뱃지는 secondary(파란색) */}
          {badges.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {badges.map((badge, i) => (
                <SingleBadge
                  key={i}
                  text={badge.text}
                  colorStyle={badge.colorStyle || "secondary"}
                  size="small"
                  showLeftIcon={badge.showLeftIcon}
                  leftIconName={badge.leftIconName}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 메뉴 썸네일 없을 때 — 기존 스타일 (로고 큰 버전) fallback */}
      {!showMenuThumbnails && banner && (
        <div style={{ padding: "0 16px" }}>
          <GroupBadge
            items={banner.items.map(text => ({ text, colorStyle: "secondary" }))}
            colorStyle="secondary"
            size="small"
          />
        </div>
      )}
    </div>
  );
}

// ── Section (Storybook) ─────────────────────────────────────────────────────
export default function ShopListCardSection() {
  const [benefitType, setBenefitType] = useState("ypx_free_delivery");
  const [subType, setSubType] = useState("none");
  const [showThumbnails, setShowThumbnails] = useState(true);

  return (
    <div style={{ padding: "24px 0" }}>
      {/* Controls */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#999", marginRight: 4 }}>Benefits:</span>
          {["none", "ypx_free_delivery", "store_free_delivery", "single_discount", "single_cashback"].map(t => (
            <button key={t} onClick={() => setBenefitType(t)}
              style={{ padding: "4px 10px", borderRadius: 20, border: `1.5px solid ${benefitType === t ? "#0C74E4" : "#e0e0e0"}`,
                background: benefitType === t ? "#0C74E4" : "#fff", color: benefitType === t ? "#fff" : "#666",
                fontSize: 10, cursor: "pointer" }}>{t.replace(/_/g, " ")}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#999", marginRight: 4 }}>Thumbnails:</span>
          <button onClick={() => setShowThumbnails(!showThumbnails)}
            style={{ padding: "4px 10px", borderRadius: 20, border: `1.5px solid ${showThumbnails ? "#0C74E4" : "#e0e0e0"}`,
              background: showThumbnails ? "#0C74E4" : "#fff", color: showThumbnails ? "#fff" : "#666",
              fontSize: 10, cursor: "pointer" }}>{showThumbnails ? "ON" : "OFF"}</button>
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#999", marginRight: 4 }}>Subscription:</span>
          {["none", "ypx_sub", "ypx_nonsub"].map(t => (
            <button key={t} onClick={() => setSubType(t)}
              style={{ padding: "4px 10px", borderRadius: 20, border: `1.5px solid ${subType === t ? "#0C74E4" : "#e0e0e0"}`,
                background: subType === t ? "#0C74E4" : "#fff", color: subType === t ? "#fff" : "#666",
                fontSize: 10, cursor: "pointer" }}>{t.replace(/_/g, " ")}</button>
          ))}
        </div>
      </div>

      {/* Demo cards */}
      <div style={{ width: 390, background: "#fff", borderRadius: 12, padding: "0", overflow: "hidden" }}>
        <ShopListCard
          shopName="본도시락-역삼역"
          shopId="hansik_1"
          logoSrc={getShopLogo("bon")}
          rating={4.8} reviewCount={1567}
          deliveryTime="30~45분" deliveryFee="1,900~2,900원" distance="372m" minOrder="12,000원"
          benefitType={benefitType} subscriptionType={subType}
          showMenuThumbnails={showThumbnails}
          bottomBadges={[
            { text: "배달앱 최저가", colorStyle: "gray", showLeftIcon: true, leftIconName: "ic_lowest" },
            { text: "스페셜적립", colorStyle: "gray", showLeftIcon: true, leftIconName: "ic_specialpoint" },
            { text: "한식 할인 1위", colorStyle: "gray", showLeftIcon: true, leftIconName: "ic_bpr" },
            { text: "1,000원 추가할인", colorStyle: "secondary" },
            { text: "카카오페이 n% 쿠폰", colorStyle: "secondary" },
            { text: "위생안심", colorStyle: "gray" },
            { text: "신규", colorStyle: "gray" },
          ]}
        />
        <ShopListCard
          shopName="서브웨이 서초점"
          shopId="sandwitch_1"
          logoSrc={getShopLogo("subway")}
          rating={4.5} reviewCount={892}
          deliveryTime="25~40분" deliveryFee="0원~2,000원" distance="0.8km" minOrder="10,000원"
          benefitType={benefitType} subscriptionType={subType}
          showMenuThumbnails={showThumbnails}
          bottomBadges={[
            { text: "즉시할인", colorStyle: "secondary" },
            { text: "최대 5% 적립", colorStyle: "secondary" },
          ]}
        />
        <ShopListCard
          shopName="피자헛 역삼점 맛있는 피자 전문점"
          shopId="pizza_1"
          logoSrc={getShopLogo("pizzahut")}
          rating={4.2} reviewCount={456}
          deliveryTime="35~50분" deliveryFee="0원" distance="2.1km" minOrder="15,000원"
          benefitType={benefitType} subscriptionType={subType}
          showMenuThumbnails={showThumbnails}
          isAd
        />
      </div>
    </div>
  );
}
