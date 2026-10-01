import { useState, useRef, useCallback } from "react";
import { metaTokens } from "../tokens";
import { YdsIcon } from "../icons.jsx";
import { SingleBadge, GroupBadge, LogoBadge, AdBadge } from "./Badge.jsx";
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

// ── 메뉴 썸네일 가로 스크롤 + auto_transition ────────────────────────────────
// 실제 상용 Swift 코드(InteractionViewAllButtonView.swift) 기반 구현:
// - minButtonSize: 28, maxButtonSize: 48
// - leftMargin: 16 (Spacing.s7), trailingMargin: 4
// - 전체 버튼 영역: leftMargin(16) + maxButtonSize(48) + trailingMargin(4) = 68
// - 버튼: 28 + (48-28) * pullProgress, .leading 정렬
// - pullProgress >= 1 + 드래그 중 → 햅틱 + 화면전환
const BTN_MIN = 28;
const BTN_MAX = 48;
const LEFT_MARGIN = 16;
const TRAILING_MARGIN = 4;
const BTN_AREA_W = LEFT_MARGIN + BTN_MAX + TRAILING_MARGIN; // 68

function MenuThumbnailRow({ shopId, onTransition }) {
  const menus = getMenusByShop(shopId);
  const scrollRef = useRef(null);
  const [pullProgress, setPullProgress] = useState(0); // 0~1
  const pulling = useRef(false);
  const anchorX = useRef(0);
  const triggered = useRef(false);

  const onPointerDown = useCallback((e) => {
    anchorX.current = e.touches ? e.touches[0].clientX : e.clientX;
    triggered.current = false;
  }, []);

  const onPointerMove = useCallback((e) => {
    const el = scrollRef.current;
    if (!el) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const remaining = el.scrollWidth - el.scrollLeft - el.clientWidth;
    const atEnd = remaining < 2;

    if (atEnd && !pulling.current) {
      pulling.current = true;
      anchorX.current = x;
    }

    if (pulling.current) {
      const rawPull = Math.max(0, anchorX.current - x);
      // 러버밴드: 80px raw → progress 1.0
      const progress = Math.min(1, rawPull / 80);
      setPullProgress(progress);

      // progress >= 1 + 아직 트리거 안 됨 → 전환
      if (progress >= 1 && !triggered.current) {
        triggered.current = true;
        // 웹에서 햅틱 시도 (지원 시)
        if (navigator.vibrate) navigator.vibrate(10);
        if (onTransition) onTransition();
      }
    }

    if (!atEnd && pulling.current) {
      pulling.current = false;
      setPullProgress(0);
    }
  }, [onTransition]);

  const onPointerUp = useCallback(() => {
    setPullProgress(0);
    pulling.current = false;
    triggered.current = false;
    if (scrollRef.current) {
      const el = scrollRef.current;
      el.scrollTo({ left: el.scrollWidth - el.clientWidth, behavior: "smooth" });
    }
  }, []);

  if (!menus || menus.length === 0) return null;

  const btnSize = BTN_MIN + (BTN_MAX - BTN_MIN) * pullProgress;

  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <div
        ref={scrollRef}
        onTouchStart={onPointerDown}
        onTouchMove={onPointerMove}
        onTouchEnd={onPointerUp}
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onMouseLeave={() => { if (pulling.current) onPointerUp(); }}
        style={{
          display: "flex", alignItems: "center",
          overflowX: "auto", scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          paddingLeft: 16,
        }}
      >
        {/* 메뉴 썸네일들 */}
        {menus.map((menu, i) => (
          <div key={menu.id} onClick={() => menu.onClick && menu.onClick()} style={{
            position: "relative", flexShrink: 0,
            width: 148, height: 118,
            borderRadius: 12, overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.04)",
            cursor: "pointer",
            marginLeft: i > 0 ? 2 : 0,
          }}>
            <img src={menu.url} alt={menu.label || menu.id}
              style={{ ...imageStyle(148, 118, 0), display: "block" }} />
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

        {/* 버튼 영역: leftMargin(16) + maxBtn(48) + trailing(4) = 68, .leading 정렬 */}
        <div style={{
          flexShrink: 0,
          width: BTN_AREA_W, height: BTN_MAX,
          display: "flex", alignItems: "center",
          paddingLeft: LEFT_MARGIN, paddingRight: TRAILING_MARGIN,
        }}>
          <div onClick={onTransition} style={{
            width: btnSize, height: btnSize,
            borderRadius: 10,
            background: "#f6f6f6",
            border: "1.3px solid #e5e5e5",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            transition: pullProgress > 0 ? "none" : "all 0.3s ease-out",
          }}>
            <YdsIcon name="chevron_right_s" size={btnSize * 0.57} color="#999" />
          </div>
        </div>
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
          <MenuThumbnailRow shopId={shopId} />
          {banner && (
            <div style={{ marginTop: -10, paddingLeft: 20, position: "relative", zIndex: 1, width: "100%" }}>
              <RedBenefitBanner items={banner.items} />
            </div>
          )}
        </div>
      )}

      {/* 가게 정보 */}
      <div style={{ display: "flex", gap: 6, padding: "0 16px", alignItems: "flex-start" }}>
        {/* Logo — 36px (신규) */}
        <div style={{ flexShrink: 0, position: "relative" }}>
          <LogoBadge src={logoSrc} size={36} />
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
              {isAd && <AdBadge />}
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
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 4,
              maxHeight: 40, overflow: "hidden", // 2줄 제한 (18px * 2 + gap 4)
            }}>
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
      <div style={{ width: "100%", background: "#fff", borderRadius: 12, padding: "0", overflow: "hidden" }}>
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
